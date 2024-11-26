import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import {
	getDocs,
	where,
	query,
	onSnapshot,
	doc,
	collection,
} from "firebase/firestore";
import { Button, Layout, notification } from "antd";

import { useAppContext } from "./useContext";
import { Spinner } from "./components/spin";
import { MobileMenu } from "./components/mobileMenu";
import { StickyBottomMenu } from "./components/stickyBottomMenu";
import { dataCollection, messageCollection } from "./firebase";
import { appComponents } from "./routes";

const { Header, Content, Footer } = Layout;
function App() {
	const {
		userUid,
		isLoading,
		userInfo,
		categoryLikes,
		topFive,
		setNonSwipedUsers,
		setMatchedUpdates,
		setMatchedUsers,
		setMessages,
		setUnreadMessageCount,
		currentUserProfile,
		setIsLoading,
		setRecentMessages,
		setRoomInfo,
	} = useAppContext();
	const [calibrationDone, setCalibrationDone] = useState(false);
	const [api, contextHolder] = notification.useNotification();
	const navigate = useNavigate();

	const matchNotification = () => {
		api.info({
			message: "You have a new match!",
			description: (
				<Button
					onClick={() => {
						navigate("/matches");
					}}
				>
					See Your New Match!
				</Button>
			),
			duration: 2,
		});
	};

	const messageNotification = (number) => {
		api.info({
			message: `You have ${number} message!`,
			description: (
				<Button
					onClick={() => {
						navigate("/overallmessages");
					}}
				>
					See Your New Message!
				</Button>
			),
			duration: 2,
		});
	};

	const fetchNotSwipedUsers = async (swipedYesUsers) => {
		try {
			if (Array.isArray(swipedYesUsers) && swipedYesUsers.length > 0) {
				const qFiltered = query(
					dataCollection,
					where("userLogin.uid", "not-in", swipedYesUsers)
				);
				const filteredSnapshot = await getDocs(qFiltered);
				const documents = filteredSnapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setNonSwipedUsers(documents);
			} else {
				console.warn("No swiped users to filter out.");
				setNonSwipedUsers([]);
			}
		} catch (error) {
			console.error("Error fetching non-swiped users:", error);
		}
	};

	const newMatchWatcher = async () => {
		const userDocRef = doc(dataCollection, userUid);
		const chatRoomsCollectionRef = collection(userDocRef, "chatRooms");
		const q = query(chatRoomsCollectionRef, where("checked", "==", false));
		const matchWatcher = onSnapshot(q, (matches) => {
			const notChecked = [];
			matches.forEach((match) => {
				notChecked.push(match.data());
			});
			if (notChecked.length > 0) {
				matchNotification();
			}
		});
	};

	const newMessageWatcher = async () => {
		try {
			// Reference to the user's document
			const userDocRef = doc(dataCollection, userUid);
			const chatRoomsCollectionRef = collection(userDocRef, "chatRooms");

			// Watch for changes in the user's chat rooms
			const chatRoomWatch = onSnapshot(chatRoomsCollectionRef, (docs) => {
				const rooms = [];
				const matchedUser = [];

				// Collect all room numbers and matched user UIDs
				docs.forEach((doc) => {
					const data = doc.data();
					if (data.room && data.matchedUserUid) {
						rooms.push(data.room);
						matchedUser.push(data.matchedUserUid);
					}
				});

				// Fetch matched user profiles only if there are matched users
				if (Array.isArray(matchedUser) && matchedUser.length > 0) {
					const matchedUserProfilesQuery = query(
						dataCollection,
						where("userLogin.uid", "in", matchedUser)
					);

					onSnapshot(matchedUserProfilesQuery, (docs) => {
						const matchedUserData = [];
						docs.forEach((doc) => {
							matchedUserData.push(doc.data());
						});
						setMatchedUsers(matchedUserData);
					});
				} else {
					console.warn("No matched users to fetch profiles for.");
				}

				// Fetch messages in chat rooms only if there are rooms
				if (Array.isArray(rooms) && rooms.length > 0) {
					const messageRoomQuery = query(
						messageCollection,
						where("roomNumber", "in", rooms)
					);

					onSnapshot(messageRoomQuery, (docs) => {
						const roomData = [];

						docs.forEach((doc) => {
							const { users, ...rest } = doc.data();
							// Find the other user in the chat room
							const [otherUser] = users.filter((user) => user !== userUid);
							const newData = { ...rest, users: otherUser };
							roomData.push(newData);

							// Fetch unread messages in each room
							const messagesCollectionRef = collection(doc.ref, "messages");
							const unreadQuery = query(
								messagesCollectionRef,
								where("readStatus", "==", false)
							);

							onSnapshot(unreadQuery, (messageDocs) => {
								const unreadMessages = [];
								messageDocs.forEach((messageDoc) => {
									const messageData = messageDoc.data();
									if (messageData.user !== userUid) {
										unreadMessages.push(messageData);
									}
								});

								// Trigger notification for unread messages
								if (unreadMessages.length > 0) {
									messageNotification(unreadMessages.length);
									setUnreadMessageCount(unreadMessages.length);
								} else {
									setUnreadMessageCount(0);
								}
							});
						});

						setRoomInfo(roomData);
					});
				} else {
					console.warn("No rooms to fetch messages for.");
				}
			});
		} catch (error) {
			console.error("Error in newMessageWatcher:", error);
		}
	};

	useEffect(() => {
		if (userUid) {
			if (topFive && userInfo && categoryLikes) {
				if (currentUserProfile?.swiped?.yes?.length > 0) {
					fetchNotSwipedUsers(currentUserProfile.swiped.yes);
				}
				newMatchWatcher();
				newMessageWatcher();
				setCalibrationDone(true);
				navigate("/profilepage");
			} else if (userInfo && categoryLikes) {
				navigate("/calibrationtopintro");
			} else if (!categoryLikes && userInfo) {
				navigate("/calibrationintro");
			} else {
				navigate("/calibratelandingpage");
			}
		} else {
			navigate("/");
			setIsLoading(false);
		}
	}, [userUid]);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="flex justify-center items-center">
			{contextHolder}
			<Layout
				style={{
					margin: 5,
					maxWidth: 480,
					borderStyle: "double",
					borderColor: "black",
					borderWidth: 4,
					height: "100vh",
				}}
			>
				<Header
					style={{
						display: "flex",
						justifyContent: "flex-end",
						background: "white",
						padding: 20,
					}}
				>
					{userUid && <MobileMenu />}
				</Header>
				<Content
					style={{
						background: "white",
						overflow: "auto",
					}}
				>
					<Routes>
						{appComponents.map(({ element, path }, key) => (
							<Route path={path} element={element} key={key} />
						))}
					</Routes>
				</Content>
				{userUid && calibrationDone && (
					<Footer
						style={{
							position: "sticky",
							bottom: 0,
							background: "white",
							width: "100%",
							borderTopStyle: "double",
							borderTopColor: "black",
							borderTopWidth: 4,
						}}
					>
						<StickyBottomMenu />
					</Footer>
				)}
			</Layout>
		</div>
	);
}

export default App;
