import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Input, Button, Card, Image, Badge } from "antd";
import { Layout } from "antd";

import { Spinner } from "../../components/spin";
import { useAppContext } from "../../useContext";

const { Search } = Input;
const { Meta } = Card;
const { Content } = Layout;
export const OverallMessages = () => {
	const navigate = useNavigate();
	const { userUid, matchedUsers, roomInfo, unreadMessageCount } =
		useAppContext();
	const [searchQuery, setSearchQuery] = useState("");
	const [allRecentMessages, setAllRecentMessages] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (roomInfo && matchedUsers) {
			setLoading(false);
		}
	}, [userUid, roomInfo, matchedUsers]);

	if (loading) {
		<Spinner />;
	}

	const filteredRoomInfo = roomInfo.filter((room) => {
		const otherUser = room.users;
		const foundUser = matchedUsers.find(
			(user) => user.userLogin.uid === otherUser
		);
		return foundUser?.userInfo?.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
	});

	return (
		<>
			<h2 className="text-center">Messages</h2>
			<Layout
				style={{
					overflowY: "auto",
					height: "100%",
					background: "white",
				}}
			>
				<Search
					className="m-2"
					size="large"
					placeholder="Search name"
					allowClear
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<Content
					style={{
						overflow: "auto",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{!loading && filteredRoomInfo
						? filteredRoomInfo?.map((room, i) => {
								const otherUser = room.users;
								const foundUser = matchedUsers.find(
									(user) => user.userLogin.uid == otherUser
								);

								return (
									<>
										<Card hoverable className="m-2" key={i}>
											<Meta title={foundUser?.userInfo?.name} />
											<div className="flex">
												<Image
													width={150}
													src={foundUser?.profilePicture?.url}
												/>
												<div className="flex flex-col m-2">
													<Badge offset={[12, 3]} count={unreadMessageCount}>
														<h3 className="font-bold">Most Recent Message</h3>
													</Badge>
													<p>
														{room?.recentMessage
															? room?.recentMessage
															: "No messages yet"}
													</p>
													<Button
														className="m-1"
														onClick={() => {
															navigate(
																`/chatroom/${room.roomNumber}/${foundUser.userLogin.uid}`
															);
														}}
													>
														Message
													</Button>
												</div>
											</div>
										</Card>
									</>
								);
						  })
						: "Start by swiping"}
				</Content>
			</Layout>
		</>
	);
};
