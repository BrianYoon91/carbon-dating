import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { v1 as uuidv1 } from "uuid";
import {
	UpSquareOutlined,
	DownSquareOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	UndoOutlined,
} from "@ant-design/icons";
import { message, Modal, Button, Avatar } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
	doc,
	getDoc,
	setDoc,
	arrayUnion,
	updateDoc,
	collection,
	addDoc,
} from "firebase/firestore";

// Local Imports

import { MatchesCard } from "./matchesCards";
import { dataCollection, messageCollection } from "../../firebase";
import { useAppContext } from "../../useContext";

export const SwipeLandingPage = () => {
	const {
		allProfiles,
		setLeaveX,
		userUid,
		currentUserProfile,
		nonSwipedUsers,
		roomNumber,
		setRoomNumber,
		setMatchNofiticationStatus,
		modalIsOpen,
		setModalIsOpen,
	} = useAppContext();
	const navigate = useNavigate();
	const [profileExpanded, setProfileExpanded] = useState(false);
	const [filteredProfiles, setFilteredProfiles] = useState([]);
	const [removedCards, setRemovedCards] = useState([]);
	const [sameInterest, setSameInterest] = useState([]);
	const [tier, setTier] = useState("");
	const [matchedUser, setMatchedUser] = useState();

	const activeIndex = filteredProfiles.length - 1;

	useEffect(() => {
		const filterBy = nonSwipedUsers.length ? nonSwipedUsers : allProfiles;
		filterProfile(filterBy);
	}, [nonSwipedUsers, allProfiles]);

	const filterProfile = (profiles) => {
		const filteredWithSwipe = [];
		const filteredWithoutSwipe = [];

		profiles.forEach((profile) => {
			if (
				profile?.swiped?.yes?.length > 0 &&
				profile.swiped.yes.includes(userUid)
			) {
				filteredWithSwipe.push(profile);
			} else {
				filteredWithoutSwipe.push(profile);
			}
		});
		const filtered = [...filteredWithoutSwipe, ...filteredWithSwipe];
		const withProfilePic = filtered.filter((profile) => {
			if (
				profile?.profilePicture &&
				profile?.userLogin?.uid !== currentUserProfile?.userLogin?.uid
			) {
				return profile;
			}
		});
		setFilteredProfiles(withProfilePic);
	};

	function profileExpander() {
		setProfileExpanded(!profileExpanded);
	}

	const removeCard = async (id, direction) => {
		console.log(id);
		const removedCard = filteredProfiles.filter(
			(profiles) => profiles?.userLogin?.uid === id
		);

		setRemovedCards((prev) => [...prev, ...removedCard]);

		setFilteredProfiles((current) =>
			current.filter((card) => card?.userLogin?.uid !== id)
		);

		const { userLogin } = removedCard[0];
		addSwiped(direction, userLogin?.uid);
		if (direction == "yes") {
			await matchCheck(userLogin);
		}
	};

	const onDragEnd = (info, profileId) => {
		if (info.offset.y < -200) {
			profileExpander();
		}

		if (
			(info.offset.x > 200 && info.offset.y > -200) ||
			(info.offset.x < -200 && info.offset.y > -200)
		) {
			removeCard(profileId, info.offset.x > 200 ? "yes" : "no");
		}
	};

	const undoSwipe = () => {
		if (removedCards.length > 0) {
			const singleRemovedCard = removedCards.pop();
			setFilteredProfiles((current) => [...current, singleRemovedCard]);
			removeProfileFromSwiped(singleRemovedCard.userLogin?.uid);
		} else {
			message.error(`You didn't swipe yet!`, 2);
		}
	};

	const modalClose = () => {
		setModalIsOpen(false);
	};

	async function addSwiped(direction, uid) {
		const userDocRef = doc(dataCollection, userUid);
		try {
			const docSnapshot = await getDoc(userDocRef);
			if (!docSnapshot.exists()) {
				await setDoc(userDocRef, {
					swiped: {
						[direction]: [uid],
					},
				});
			} else {
				await updateDoc(userDocRef, {
					[`swiped.${direction}`]: arrayUnion(uid),
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function removeProfileFromSwiped(uid) {
		const userDocRef = doc(dataCollection, userUid);
		try {
			const docSnapshot = await getDoc(userDocRef);
			if (docSnapshot.exists()) {
				const userData = docSnapshot.data();
				const swipedData = userData.swiped;
				for (const direction in swipedData) {
					const directionArray = swipedData[direction];
					const updatedArray = directionArray.filter(
						(profile) => profile !== uid
					);
					await updateDoc(userDocRef, {
						[`swiped.${direction}`]: updatedArray,
					});
				}
			} else {
				console.log("Document does not exist.");
			}
		} catch (error) {
			console.error("Error removing profile:", error);
		}
	}

	const matchCheck = async (swipedProfile) => {
		const swipedUserProfile = allProfiles.find(
			(profile) => profile?.userLogin?.uid == swipedProfile.uid
		);
		if (
			swipedUserProfile?.swiped?.yes.includes(currentUserProfile.userLogin?.uid)
		) {
			setMatchedUser(swipedUserProfile);
			await tierSetter(swipedUserProfile);
			setModalIsOpen(true);
		}
	};

	function categorySorter(categoryObj) {
		let lowTierObj = {};
		let highTierObj = {};
		const likesArray = Object.keys(categoryObj);

		likesArray.forEach((category) => {
			let subCategoryArray = Object.keys(categoryObj[category]);
			subCategoryArray.forEach((subcategory) => {
				highTierObj[subcategory] = categoryObj[category][subcategory].length;
			});
		});

		const highTier = highTierObj;
		likesArray.forEach((category) => {
			lowTierObj[category] = Object.keys(categoryObj[category]).length;
		});
		const lowTier = Object.entries(lowTierObj).sort((a, b) => b[1] - a[1]);
		return { highTier, lowTier };
	}

	const tierSetter = async (swipedProfile) => {
		const profileSwipedSortedPromise = categorySorter(
			swipedProfile.categoryLikes
		);
		const currentUserLikesSortedPromise = categorySorter(
			currentUserProfile.categoryLikes
		);

		const profileSwipedSorted = await profileSwipedSortedPromise;
		const currentUserLikesSorted = await currentUserLikesSortedPromise;

		let lowMatched = 0;
		let lowTierInterest = [];
		let highestTier = null;
		let tierObj = {
			Carbon: {
				count: 0,
				interest: [],
				priority: 3,
			},
			Platinum: {
				count: 0,
				interest: [],
				priority: 2,
			},
			Gold: {
				count: 0,
				interest: [],
				priority: 1,
			},
		};

		for (let i = 0; i < 5; i++) {
			const currentUserCategory = currentUserLikesSorted.lowTier;
			const profileSwipedCategory = profileSwipedSorted.lowTier;
			if (
				currentUserCategory &&
				profileSwipedCategory &&
				currentUserCategory[i] &&
				profileSwipedCategory[i]
			) {
				if (
					currentUserCategory[i][0] == profileSwipedCategory[i][0] ||
					(i > 0 &&
						currentUserCategory[i][0] == profileSwipedCategory[i - 1]?.[0]) ||
					(i < 4 &&
						currentUserCategory[i][0] == profileSwipedCategory[i + 1]?.[0])
				) {
					lowMatched += 1;
					lowTierInterest.push(currentUserCategory[i][0]);
				}
			}
		}

		if (lowMatched >= 3) {
			const currHighTier = currentUserLikesSorted.highTier;
			const swipedUserHighTier = profileSwipedSorted.highTier;
			Object.keys(currHighTier).forEach((category) => {
				if (category in swipedUserHighTier) {
					const difference = Math.abs(
						currHighTier[category] - swipedUserHighTier[category]
					);
					if (difference <= 3) {
						tierObj.Carbon.count += 1;
						tierObj.Carbon.interest.push(category);
					} else if (difference >= 5 && difference <= 10) {
						tierObj.Platinum.count += 1;
						tierObj.Platinum.interest.push(category);
					} else if (difference > 10 && difference <= 15) {
						tierObj.Gold.count += 1;
						tierObj.Gold.interest.push(category);
					}
				}
			});

			for (const [tier, details] of Object.entries(tierObj)) {
				if (
					!highestTier ||
					details.count > tierObj[highestTier].count ||
					(details.count === tierObj[highestTier].count &&
						details.priority > tierObj[highestTier].priority)
				) {
					highestTier = tier;
				}
			}
			if (!highestTier) {
				setTier("Silver");
				addMatched(swipedProfile, "Silver");
				setSameInterest(lowTierInterest);
			} else {
				setTier(highestTier);
				addMatched(swipedProfile, highestTier);
				setSameInterest(tierObj[highestTier].interest);
			}
		} else {
			setTier("Bronze");
			addMatched(swipedProfile, "Bronze");
			setSameInterest(lowTierInterest);
		}
	};

	async function addMatched(swipedProfile, tierSet) {
		const userDocRef = doc(dataCollection, userUid);
		const swipedRef = doc(dataCollection, swipedProfile.userLogin?.uid);

		const userRoomSubCollection = collection(userDocRef, "chatRooms");
		const swipedRoomSubCollection = collection(swipedRef, "chatRooms");

		const roomNo = uuidv1();

		try {
			setRoomNumber(roomNo);
			const timestamp = new Date();

			await addDoc(userRoomSubCollection, {
				rank: tierSet,
				room: roomNo,
				checked: false,
				matchedTime: timestamp,
				matchedUserUid: swipedProfile.userLogin?.uid,
			});

			await addDoc(swipedRoomSubCollection, {
				rank: tierSet,
				room: roomNo,
				checked: false,
				matchedTime: timestamp,
				matchedUserUid: userUid,
			});

			await addDoc(messageCollection, {
				roomNumber: roomNo,
				users: [userUid, swipedProfile.userLogin?.uid],
			});
		} catch (error) {
			console.error("Error Adding Matched", error);
		}
	}

	return (
		<>
			<div className="flex flex-col mt-[25%]">
				<div className="flex justify-center m-4">
					<motion.div
						className="jello-horizontal"
						animate={{
							scale: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
						}}
						initial={{ scale: 1 }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						{profileExpanded ? (
							<DownSquareOutlined
								onClick={() => {
									profileExpander();
								}}
								className="text-5xl"
							/>
						) : (
							<UpSquareOutlined
								onClick={() => {
									profileExpander();
								}}
								className="text-5xl"
							/>
						)}
					</motion.div>
				</div>
				<div className="flex flex-col items-center relative">
					<Modal
						centered
						open={modalIsOpen}
						width={300}
						closable={true}
						footer={null}
						onCancel={() => {
							modalClose();
							setTier("");
							setSameInterest([]);
						}}
					>
						<div className="flex flex-col justify-center gap-3 m-2">
							<h2 className="text-center">It's A {tier} Match!</h2>
							<div className="flex flex-wrap gap-2">
								<h3>You share interests in:</h3>
								{sameInterest.map((interest) => (
									<h3 className="capitalize font-bold">{interest}</h3>
								))}
							</div>
							<div className="flex justify-center gap-3">
								<Avatar
									size={100}
									src={
										<img
											src={currentUserProfile?.profilePicture?.url}
											alt="User's profile picture"
										/>
									}
								/>
								<Avatar
									size={100}
									src={
										<img
											src={matchedUser?.profilePicture?.url}
											alt="User's profile picture"
										/>
									}
								/>
							</div>
							<Button
								onClick={() => {
									navigate(
										`/chatroom/${roomNumber}/${matchedUser.userLogin.uid}`
									);
								}}
							>
								Message Your Match!
							</Button>
							<Button
								onClick={() => {
									modalClose();
								}}
							>
								Back To Swiping
							</Button>
						</div>
					</Modal>
					<AnimatePresence onExitComplete={() => setLeaveX(0)}>
						{filteredProfiles.map((profile, index) => {
							return (
								<MatchesCard
									key={profile.userLogin.uid}
									index={index}
									profile={profile}
									activeIndex={activeIndex}
									profileExpanded={profileExpanded}
									onDragEnd={onDragEnd}
									currentProfile={filteredProfiles[index]}
								/>
							);
						})}
					</AnimatePresence>
					{filteredProfiles.length === 0 ? (
						<div className="flex flex-col justify-center items-center mt-6">
							<h3 className="text-center">No more!</h3>
							<h3 className="text-center">Please come back later!</h3>
						</div>
					) : null}
				</div>
				<div className="w-full flex flex-col justify-center mt-[300px]">
					<h3 className="text-center mb-4">
						{profileExpanded
							? "Click To See Details"
							: "Swipe Up To See Details"}
					</h3>
					<div className="flex justify-around">
						<CloseCircleOutlined
							className="text-4xl mx-5"
							onClick={() => {
								setLeaveX(-1000);
								removeCard(filteredProfiles[activeIndex].userLogin.uid, "no");
							}}
						/>

						<UndoOutlined
							className="text-4xl mx-5"
							onClick={() => {
								undoSwipe();
							}}
						/>

						<CheckCircleOutlined
							className="text-4xl mx-5"
							onClick={() => {
								setLeaveX(1000);
								removeCard(filteredProfiles[activeIndex]?.userLogin.uid, "yes");
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
