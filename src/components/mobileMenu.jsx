import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Space } from "antd";
import { useNavigate } from "react-router";

import { useAppContext } from "../useContext";

export function MobileMenu() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { logOut, userInfo, categoryLikes, profilePicture } = useAppContext();

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	const signOut = async () => {
		try {
			await logOut();
			navigate("/");
		} catch (err) {
			console.error("Error:", err.message);
		}
	};

	return (
		<>
			<MenuOutlined
				style={{
					fontSize: 25,
					color: " #7f5af0",
				}}
				onClick={showDrawer}
			/>
			<Drawer width={300} onClose={onClose} open={open}>
				<Space direction="vertical" style={{ width: "100%" }}>
					{(!userInfo && !categoryLikes) || (userInfo && !categoryLikes) ? (
						<Button
							style={{
								color: " #7f5af0",
							}}
							block
							onClick={() => {
								navigate(
									!userInfo && !categoryLikes
										? "/calibratelandingpage"
										: "/calibrationintro"
								);
								onClose();
							}}
						>
							Please Finish Your Calibration!
						</Button>
					) : null}

					{profilePicture ? (
						<>
							<Button
								style={{
									color: " #7f5af0",
								}}
								block
								onClick={() => {
									navigate("/profilepage");
									onClose();
								}}
							>
								Profile Page
							</Button>
							<Button
								style={{
									color: " #7f5af0",
								}}
								block
								onClick={() => {
									navigate("/swipelandingpage");
									onClose();
								}}
							>
								Swiping
							</Button>
							<Button
								style={{
									color: " #7f5af0",
								}}
								block
								onClick={() => {
									navigate("/matches");
									onClose();
								}}
							>
								Matches
							</Button>
							<Button
								style={{
									color: " #7f5af0",
								}}
								block
								onClick={() => {
									navigate("/overallmessages");
									onClose();
								}}
							>
								Messages
							</Button>
							<Button
								style={{
									color: " #7f5af0",
								}}
								block
								onClick={() => {
									navigate("/tierlistpage");
									onClose();
								}}
							>
								Tier List Info
							</Button>
						</>
					) : !profilePicture && userInfo && categoryLikes ? (
						<Button
							style={{
								color: " #7f5af0",
							}}
							block
							onClick={() => {
								navigate("/profilepage");
								onClose();
							}}
						>
							Please Set Your Profile Picture!
						</Button>
					) : null}
					<Button
						style={{
							color: " #7f5af0",
						}}
						block
						onClick={() => {
							signOut();
						}}
					>
						Logout
					</Button>
				</Space>
			</Drawer>
		</>
	);
}
