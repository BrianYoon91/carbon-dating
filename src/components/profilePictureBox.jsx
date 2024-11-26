import React, { useState } from "react";
import { Card, message, Image } from "antd";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { ImageCarousel } from "./imageCarousel";
import { useAppContext } from "../useContext";
import { dataCollection } from "../firebase";

const { Meta } = Card;

export const ProfilePictureBox = () => {
	const {
		userUid,
		uploadedPictures,
		profilePicture,
		setProfilePicture,
		userInfo,
	} = useAppContext();
	const [activeTabKey, setActiveTabKey] = useState("main" || "main");

	const pickProfilePicture = async (picture) => {
		try {
			const docRef = doc(dataCollection, userUid);
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				await updateDoc(docRef, { profilePicture: picture });
				setProfilePicture(picture);
				message.success("Profile picture has been updated", 2);
			}
		} catch (error) {
			message.error("There has been an error", 2);
		}
	};

	const onTabChange = (key) => {
		setActiveTabKey(key);
	};

	const tabList = [
		{
			key: "main",
			tab: "Main",
		},
		{
			key: "pictures",
			tab: "Your Pictures",
		},
	];

	const contentList = {
		main: profilePicture ? (
			<div className="flex justify-center">
				<Image height={250} width={250} src={profilePicture?.url} />
			</div>
		) : (
			"Please upload pictures and set your profile picture!"
		),
		pictures: uploadedPictures ? (
			<ImageCarousel
				pickProfilePicture={pickProfilePicture}
				profilePicture={profilePicture}
				setProfilePicture={setProfilePicture}
			/>
		) : (
			"Click the upload button below to upload!"
		),
	};

	return (
		<Card
			hoverable
			style={{
				width: "90%",
			}}
			tabList={tabList}
			activeTabKey={activeTabKey || "main"}
			onTabChange={onTabChange}
		>
			<div className="my-3">{contentList[activeTabKey]}</div>
			<Meta title={userInfo?.name} />
		</Card>
	);
};
