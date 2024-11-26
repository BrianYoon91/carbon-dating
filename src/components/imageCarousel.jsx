import React from "react";
import { Carousel, Image, message, Button, Space } from "antd";

import { useAppContext } from "../useContext";
import { Spinner } from "./spin";

import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { dataCollection } from "../firebase";

export const ImageCarousel = ({ pickProfilePicture, setProfilePicture }) => {
	const { uploadedPictures, userUid } = useAppContext();

	if (!uploadedPictures) {
		return <Spinner />;
	}

	const deletePicture = async (picturePath) => {
		try {
			const docRef = doc(dataCollection, userUid);
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.data().pictures) {
				const existingPictures = docSnapshot.data().pictures || [];
				const updatedPictures = existingPictures.filter(
					(existingPicture) => existingPicture.path !== picturePath
				);
				const profilePictureCheck = updatedPictures.some(
					(existingPicture) => existingPicture.path === picturePath
				);
				if (!profilePictureCheck) {
					await updateDoc(docRef, { profilePicture: deleteField() });
					setProfilePicture(null);
				}

				await updateDoc(docRef, {
					pictures: updatedPictures,
				});

				message.success("Image deleted successfully.", 2);
			}
		} catch (error) {
			console.log(error);
			message.error("Error deleting image", 2);
		}
	};

	return (
		<>
			<Carousel dotPosition="top">
				{uploadedPictures.map((pic) => (
					<>
						<div className="m-2 flex justify-center">
							<Image
								height={250}
								width={250}
								src={pic.url}
								key={pic.id}
								path={pic.path}
							/>
						</div>
						<Space>
							<Button
								onClick={() => {
									pickProfilePicture(pic);
								}}
							>
								Make it your profile!
							</Button>
							<Button
								onClick={() => {
									deletePicture(pic.path);
								}}
								danger
							>
								Delete
							</Button>
						</Space>
					</>
				))}
			</Carousel>
		</>
	);
};
