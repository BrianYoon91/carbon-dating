import { useState } from "react";

import { motion } from "framer-motion";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { Card, Image, Carousel } from "antd";

import { useAppContext } from "../../useContext";

const { Meta } = Card;

export const MatchesCard = ({
	index,
	profile,
	activeIndex,
	profileExpanded,
	currentProfile,
	onDragEnd,
}) => {
	const { leaveX, setLeaveX } = useAppContext();
	const [selectedElement, setSelectedElement] = useState(null);

	const zIndexIncrement = (zIndex) => {
		let newZindex = zIndex + 50;
		return newZindex;
	};

	return activeIndex === index ? (
		<>
			<motion.div
				key={`card-${index}`}
				dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
				drag={true}
				initial={{ x: 0 }}
				onDragEnd={(event, info) => {
					if (info.delta.x === 0) {
						setLeaveX(0);
					}

					if (info.offset.x > 200) {
						setLeaveX(1000);
					}

					if (info.offset.x < -200) {
						setLeaveX(-1000);
					}
					onDragEnd(info, currentProfile.userLogin.uid);
				}}
				onDrag={(event, info) => {
					setLeaveX(info.offset.x);
				}}
				exit={{
					x: leaveX > 200 ? 1000 : -1000,
					opacity: 0,
					scale: 0.5,
					transition: { duration: 0.5 },
					rotate: 300,
				}}
				animate={{
					scale: 1.05,
				}}
				style={{
					position: "absolute",
					zIndex: 40 === selectedElement ? zIndexIncrement(40) : 40,
					rotate: profileExpanded ? 12 : 0,
					right: profileExpanded ? -20 : null,
				}}
				onClick={() => {
					setSelectedElement(40);
				}}
			>
				<Card
					hoverable
					style={{
						width: 200,
						margin: 10,
						boxShadow: profileExpanded ? "-7px 6px 18px 5px #FF9494" : null,
					}}
					cover={
						<Image
							height={200}
							width={200}
							src={profile.profilePicture.url}
							alt="cute cat picture"
						/>
					}
				>
					<Meta title={profile.userInfo.name} />
					{leaveX > 0 ? (
						<div className="flex justify-center">
							<CheckOutlined className="text-5xl" />
						</div>
					) : leaveX < 0 ? (
						<div className="flex justify-center">
							<CloseOutlined className="text-5xl" />
						</div>
					) : null}
				</Card>
			</motion.div>
			{profileExpanded && (
				<>
					<motion.div
						dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
						drag={true}
						initial={{ rotate: -360, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{
							position: "absolute",
							zIndex: selectedElement === 20 ? zIndexIncrement(20) : 20,
						}}
						onClick={(e) => {
							setSelectedElement(20);
						}}
					>
						<Card
							hoverable
							style={{
								marginTop: 15,
								width: 200,
								height: 200,
								boxShadow: "-7px 6px 21px 5px #696969",
							}}
							title="Loves (Top 5)"
						>
							<div className="flex flex-wrap justify-center">
								{profile.topFive.map((topic) => {
									return <p className="mx-1">{topic}</p>;
								})}
							</div>
						</Card>
					</motion.div>
					<motion.div
						dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
						drag={true}
						initial={{ rotate: -360, opacity: 0 }}
						animate={{ rotate: -6, opacity: 1 }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{
							position: "absolute",
							zIndex: selectedElement === 10 ? zIndexIncrement(10) : 10,
							left: 40,
							rotate: -6,
						}}
						onClick={(e) => {
							setSelectedElement(10);
						}}
					>
						<Card
							hoverable
							style={{
								width: 200,
								boxShadow: "-7px 6px 21px 5px #696969",
							}}
							title="Pictures"
						>
							<Carousel dotPosition="top" autoplay>
								{profile.pictures.map((picture) => (
									<div className="flex justify-center">
										<Image
											height={200}
											width={200}
											src={picture.url}
											path={picture.path}
										/>
									</div>
								))}
							</Carousel>
						</Card>
					</motion.div>
					<motion.div
						dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
						drag={true}
						initial={{ rotate: -360, opacity: 0 }}
						animate={{ rotate: -30, opacity: 1 }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{
							position: "absolute",
							zIndex: selectedElement === 5 ? zIndexIncrement(5) : 5,
							left: -40,
							rotate: -30,
						}}
						onClick={() => {
							setSelectedElement(5);
						}}
					>
						<Card
							hoverable
							style={{
								marginTop: 15,
								width: 200,
								boxShadow: "-7px 6px 21px 5px #696969",
							}}
							title="User details"
						>
							<div className="flex flex-wrap justify-center">
								{Object.keys(profile.userInfo).map((topic) => {
									return (
										<p className="mx-1">
											{topic}: {profile.userInfo[topic]}
										</p>
									);
								})}
							</div>
						</Card>
					</motion.div>
				</>
			)}
		</>
	) : (
		<div className="absolute rotate-[20deg]">
			<Card
				key={profile.userInfo.uid}
				hoverable
				style={{
					width: 200,
					margin: 10,
				}}
				cover={
					<Image
						height={200}
						width={200}
						src={profile.profilePicture.url}
						alt="cute cat picture"
					/>
				}
			>
				<Meta title={profile.userInfo.name} />
			</Card>
		</div>
	);
};
