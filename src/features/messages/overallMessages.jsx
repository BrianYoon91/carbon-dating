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
			<h1 className="text-center  mt-5 mb-auto font-bold">Messages</h1>
			<Layout
				style={{
					overflowY: "auto",
					height: "100%",
					background: "white",
				}}
			>
				<Search
					className="m-2 flex self-center max-w-[400px]"
					size="middle"
					width={300}
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
					{!loading && filteredRoomInfo.length > 0 ? (
						filteredRoomInfo?.map((room, i) => {
							const otherUser = room.users;
							const foundUser = matchedUsers.find(
								(user) => user.userLogin.uid == otherUser
							);

							return (
								<>
									<Card hoverable className="m-2" key={i}>
										<Meta title={foundUser?.userInfo?.name} />
										<div className="flex">
											<Image width={150} src={foundUser?.profilePicture?.url} />
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
					) : (
						<div className="flex flex-col gap-10">
							<h2 className="my-5">No Messages To Display</h2>
							<h2 className="text-center">Start by Swiping!</h2>
							<div className="flex justify-center">
								<Button
									onClick={() => {
										navigate("/swipelandingpage");
									}}
								>
									To Swiping
								</Button>
							</div>
						</div>
					)}
				</Content>
			</Layout>
		</>
	);
};
