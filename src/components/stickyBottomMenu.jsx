import React from "react";
import { Badge } from "antd";
import {
	UserOutlined,
	MessageOutlined,
	SwapOutlined,
	HeartOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router";

import { useAppContext } from "../useContext";

export const StickyBottomMenu = () => {
	const navigate = useNavigate();
	const { unreadMessageCount } = useAppContext();
	return (
		<>
			<div className="flex justify-between">
				<Badge>
					<UserOutlined
						className="text-2xl"
						onClick={() => {
							navigate("/profilepage");
						}}
					/>
				</Badge>

				<Badge>
					<SwapOutlined
						className="text-2xl"
						onClick={() => {
							navigate("/swipelandingpage");
						}}
					/>
				</Badge>
				<Badge count={unreadMessageCount}>
					<MessageOutlined
						className="text-2xl"
						onClick={() => {
							navigate("/overallmessages");
						}}
					/>
				</Badge>
				<Badge>
					<HeartOutlined
						className="text-2xl"
						onClick={() => {
							navigate("/matches");
						}}
					/>
				</Badge>
			</div>
		</>
	);
};
