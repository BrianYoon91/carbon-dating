import { useEffect, useState } from "react";
import { Input, Button, Space, Layout, Form, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router";

import {
	doc,
	getDoc,
	setDoc,
	getDocs,
	addDoc,
	onSnapshot,
	where,
	collection,
	query,
	orderBy,
	writeBatch,
} from "firebase/firestore";

import { dataCollection, messageCollection, db } from "../../firebase";
import { useAppContext } from "../../useContext";
import { Spinner } from "../../components/spin";

const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

export const ChatRoom = () => {
	const { userUid } = useAppContext();
	const { roomNumber, matchUserUid } = useParams();
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const [newMessage, setNewMessage] = useState("");
	const [sortedMessages, setSortedMessages] = useState([]);
	const [matchUserInfo, setMatchUserInfo] = useState({});
	const [readHover, setReadHover] = useState(false);
	const [form] = Form.useForm();

	const sendNewMessage = async () => {
		try {
			if (newMessage === "") return;
			const querySnapshot = await getDocs(
				query(messageCollection, where("roomNumber", "==", roomNumber))
			);
			if (querySnapshot.empty) {
				console.log("Document not found");
				return;
			}
			const messageRoomDocRef = querySnapshot.docs[0].ref;
			const messagesCollectionRef = collection(messageRoomDocRef, "messages");
			const timestamp = new Date();
			const messageData = {
				text: newMessage,
				user: userUid,
				readStatus: false,
				time: timestamp,
			};

			await setDoc(
				messageRoomDocRef,
				{ recentMessage: newMessage, sentBy: userUid },
				{ merge: true }
			);
			await addDoc(messagesCollectionRef, messageData);
			console.log("Message sent");
			setNewMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	useEffect(() => {
		if (matchUserInfo) {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const querySnapshot = onSnapshot(
			query(messageCollection, where("roomNumber", "==", roomNumber)),
			(snapshot) => {
				snapshot.forEach((doc) => {
					const messageRoomDocRef = doc.ref;
					const usersArray = doc.data().users;
					const [matched] = usersArray.filter((uid) => uid !== userUid);
					const matchedUser = getMatchedUserProfile(matched);
					matchedUser.then((response) => {
						setMatchUserInfo(response);
					});
					const messageRoomMessagesCollectionRef = collection(
						messageRoomDocRef,
						"messages"
					);
					const queryMessages = query(
						messageRoomMessagesCollectionRef,
						orderBy("time", "desc")
					);
					const messagesWatcher = onSnapshot(
						queryMessages,
						(messagesSnapshot) => {
							const updateBatch = writeBatch(db);
							let messages = [];
							messagesSnapshot.forEach((messageDoc) => {
								messages.push(messageDoc.data());
								if (messageDoc.data().user !== userUid) {
									updateBatch.update(messageDoc.ref, { readStatus: true });
								}
							});
							setSortedMessages(messages);
							setTimeout(() => {
								updateBatch.commit();
							}, 1000);
						}
					);
				});
			}
		);

		return () => {
			querySnapshot();
		};
	}, [roomNumber]);

	const getMatchedUserProfile = async (matchedUid) => {
		const matchedProfile = await getDoc(doc(dataCollection, matchedUid));
		const response = matchedProfile.data();
		return response;
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<>
			{!loading && matchUserInfo?.userLogin?.uid ? (
				<Layout
					style={{
						padding: 10,
						overflow: "auto",
						height: "100%",
						background: "white",
						position: "relative",
						width: "100%",
					}}
				>
					<Header
						style={{
							position: "sticky",
							top: 0,
							background: "transparent",
						}}
					>
						<div className="flex justify-center">
							<Avatar
								className="m-3"
								shape="square"
								size="large"
								src={matchUserInfo?.profilePicture?.url}
							/>
							<h2 className="text-center">{matchUserInfo?.userInfo?.name}</h2>
						</div>
					</Header>
					<Content
						style={{
							background: "white",
							overflow: "auto",
							marginLeft: 10,
							marginBottom: 30,
							display: "flex",
							flexDirection: "column-reverse",
						}}
					>
						{sortedMessages && matchUserInfo?.userLogin?.uid
							? sortedMessages?.map((message, id) => {
									const options = {
										year: "numeric",
										month: "numeric",
										day: "numeric",
										hour12: true,
										hour: "numeric",
										minute: "numeric",
										timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
									};

									// Convert Firebase timestamp to milliseconds
									const timestampMilliseconds = message.time.seconds * 1000;

									// Create a new Date object with the timestamp in milliseconds
									const localTime = new Date(
										timestampMilliseconds
									).toLocaleString("en-us", options);

									return (
										<>
											<div className="flex flex-col">
												{readHover === id ? (
													<p className="text-center">{localTime}</p>
												) : null}
												<div
													className={
														message.user == userUid
															? "flex flex-row-reverse"
															: "flex flex-row"
													}
												>
													<h3
														className={
															message.user == userUid
																? "bg-blue-600 text-white p-2 my-1 rounded-md "
																: "bg-gray-500 text-white p-2 my-1 rounded-md"
														}
														onClick={() => {
															setReadHover(id);
														}}
													>
														{message.text}
													</h3>
												</div>
												{message.user == userUid ? (
													<div className="flex flex-row-reverse">
														{readHover === id ? (
															<p>{message.readStatus ? "Read" : "Sent"}</p>
														) : null}
													</div>
												) : null}
											</div>
										</>
									);
							  })
							: null}
					</Content>
					<Footer
						style={{
							background: "white",
							overflow: "auto",
							padding: 0,
							width: "100%",
							flex: "0 0 auto",
						}}
					>
						<Form
							form={form}
							onFinish={() => {
								sendNewMessage();
							}}
						>
							<Space.Compact
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Input
									type="text"
									value={newMessage}
									onChange={(event) => {
										setNewMessage(event.target.value);
									}}
									placeholder="Put your message here!"
									allowClear
								/>
								<Button
									htmlType="submit"
									size="large"
									type="default"
									icon={<SendOutlined />}
								/>
							</Space.Compact>
						</Form>
					</Footer>
				</Layout>
			) : (
				<Spinner />
			)}
		</>
	);
};
