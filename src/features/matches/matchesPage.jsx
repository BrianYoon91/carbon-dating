import { useState, useEffect } from "react";
import { doc, collection, writeBatch, onSnapshot } from "firebase/firestore";
import { Button, Card, Modal, Carousel, Image, Layout } from "antd";
import { useNavigate } from "react-router";
import { StarTwoTone } from "@ant-design/icons";

import { dataCollection, db } from "../../firebase";
import { Spinner } from "../../components/spin";
import { useAppContext } from "../../useContext";

const { Meta } = Card;

const { Content } = Layout;

export const MatchesPage = () => {
	const { userUid, matchedUsers } = useAppContext();
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [matchedRooms, setMatchedRooms] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const userDocRef = doc(dataCollection, userUid);
		const chatRoomsCollectionRef = collection(userDocRef, "chatRooms");

		const chatRoomWatcher = onSnapshot(chatRoomsCollectionRef, (snapshot) => {
			const rooms = [];
			const updateBatch = writeBatch(db);
			snapshot.forEach((room) => {
				rooms.push(room.data());
				updateBatch.update(room.ref, { checked: true });
			});
			setMatchedRooms(rooms);
			setTimeout(() => {
				updateBatch.commit();
			}, 1000);
		});
	}, [userUid, matchedUsers, matchedRooms]);

	useEffect(() => {
		if (matchedUsers && matchedRooms) {
			setIsLoading(false);
		}
	}, []);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<h1 className="text-center mt-5 mb-auto font-bold">Matches</h1>
			{!isLoading && (
				<Layout
					style={{
						overflowY: "auto",
						height: "100%",
						background: "white",
					}}
				>
					<Content
						style={{
							overflow: "auto",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						{matchedRooms.length > 0 ? (
							matchedRooms.map((room, i) => {
								const otherUser = room.matchedUserUid;
								const foundUser = matchedUsers.find(
									(user) => user.userLogin.uid == otherUser
								);
								return (
									<Card
										hoverable
										style={{
											width: 240,
										}}
										cover={<img src={foundUser?.profilePicture?.url} />}
									>
										<div className="flex flex-col gap-1">
											<Meta
												avatar={
													!room.checked && (
														<StarTwoTone twoToneColor="#eb2f96" />
													)
												}
												title={foundUser.userInfo.name}
											/>
											<h3>Tier: {room.rank}</h3>
											<Button
												onClick={() => {
													navigate(`/chatroom/${room.room}/${otherUser}`);
												}}
											>
												Message
											</Button>
											<Button
												onClick={() => {
													setOpenModal(true);
													setSelectedUser(foundUser);
												}}
											>
												Profile
											</Button>
											{openModal && selectedUser && (
												<Modal
													title={selectedUser.userInfo.name}
													open={openModal}
													closable={true}
													footer={null}
													destroyOnClose={true}
													onCancel={() => {
														setOpenModal(false);
														setSelectedUser(null);
													}}
												>
													<Carousel dotPosition="top" autoplay>
														{selectedUser?.pictures.map((pic) => (
															<div className="flex justify-center">
																<Image
																	height={200}
																	width={200}
																	src={pic.url}
																	path={pic.path}
																/>
															</div>
														))}
													</Carousel>
													<div className="m-5">
														{Object.keys(selectedUser.userInfo).map((info) => (
															<p className="text-center">
																{info}: {selectedUser.userInfo[info]}
															</p>
														))}
													</div>
												</Modal>
											)}
										</div>
									</Card>
								);
							})
						) : (
							<div className="flex flex-col my-28">
								<h2 className="text-center">Sorry no matches yet!</h2>
								<h2 className="text-center">Let's keep looking!</h2>
							</div>
						)}
					</Content>
				</Layout>
			)}
		</>
	);
};
