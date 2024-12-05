import React, { useState, useEffect } from "react";
import { Button, message, Upload, Form, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
	Timestamp,
	doc,
	updateDoc,
	getDoc,
	arrayUnion,
	onSnapshot,
} from "firebase/firestore";

import { ProfilePictureBox } from "../../components/profilePictureBox";
import { useAppContext } from "../../useContext";
import { storage, dataCollection } from "../../firebase";

const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

export const ProfilePage = () => {
	const { userUid, setUploadedPictures } = useAppContext();
	const navigate = useNavigate();

	const [fileList, setFileList] = useState([]);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState(false);
	const [previewTitle, setPreviewTitle] = useState(false);

	const handleCancel = () => setPreviewVisible(false);

	const beforeUpload = (file) => {
		if (!["image/jpeg", "image/png"].includes(file.type)) {
			message.error(`${file.name} is not a valid image type`, 2);
			return null;
		}
		return false;
	};

	const handleChange = ({ fileList }) =>
		setFileList(fileList.filter((file) => file.status !== "error"));

	const onRemove = async (file) => {
		const index = fileList.indexOf(file);
		const newFileList = fileList.slice();
		newFileList.splice(index, 1);

		setFileList(newFileList);
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
		);
	};

	const handleFinish = async () => {
		if (fileList.length > 0) {
			try {
				await Promise.all(
					fileList.map(async (file) => {
						const fileName = `pictures-${userUid}-${file.name}`;
						const fileStorageRef = ref(storage, fileName);
						try {
							await uploadBytes(fileStorageRef, file.originFileObj);
							const downloadUrl = await getDownloadURL(fileStorageRef);
							const pictures = {
								url: downloadUrl,
								path: fileName,
								uploadedAt: Timestamp.now(),
							};
							const docRef = doc(dataCollection, userUid);
							const docSnapshot = await getDoc(docRef);

							if (docSnapshot.data().pictures) {
								const existingPictures = docSnapshot.data().pictures || [];
								const pictureExists = existingPictures.filter(
									(existingPicture) => {
										return existingPicture.path === pictures.path;
									}
								);
								if (pictureExists.length > 0) {
									message.error(`This picture exists!`, 2);
									setFileList([]);
								} else if (pictureExists.length == 0) {
									await updateDoc(docRef, {
										pictures: arrayUnion(pictures),
									});
									setFileList([]);
								}
							} else {
								await updateDoc(docRef, { pictures: [pictures] });
								setFileList([]);
							}
						} catch (error) {
							console.log(error);
						}
					})
				);
				message.success(`Images added successfully.`, 2);
			} catch (error) {
				message.error(`Error adding images`, 2);
			}
		} else {
			message.error("Please choose pictures", 2);
		}
	};

	useEffect(() => {
		const documentRef = doc(dataCollection, userUid);
		const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot?.data()?.pictures;
				setUploadedPictures(data);
			} else {
				console.log("Document does not exist");
			}
		});
	}, [userUid]);

	return (
		<>
			<div className="flex flex-col mx-4 gap-2">
				<h1 className="text-center mt-5 mb-auto font-bold">profile</h1>
				<div className="flex justify-center">
					<ProfilePictureBox />
				</div>
				<div className="flex flex-col my-20 gap-3">
					<Button
						style={{
							color: " #7f5af0",
						}}
						size="large"
						onClick={() => navigate("/recalibrationpage")}
					>
						Recalibrate
					</Button>
					<Button
						style={{
							color: " #7f5af0",
						}}
						size="large"
						onClick={() => navigate("/calibrationquestions")}
					>
						Edit Personal Info
					</Button>
					<Form onFinish={handleFinish}>
						<Upload
							className="flex flex-col justify-center"
							fileList={fileList}
							beforeUpload={beforeUpload}
							onPreview={handlePreview}
							onChange={handleChange}
							onRemove={onRemove}
							multiple={true}
							maxCount={5}
						>
							<Button
								style={{
									color: " #7f5af0",
								}}
								block
								size="large"
								icon={<UploadOutlined />}
							>
								Upload Pictures
							</Button>
						</Upload>
						<Modal
							open={previewVisible}
							title={previewTitle}
							footer={null}
							onCancel={handleCancel}
						>
							<img
								alt="example"
								style={{
									width: "100%",
								}}
								src={previewImage}
							/>
						</Modal>
						<Button
							style={{ marginTop: 10, color: " #7f5af0" }}
							htmlType="submit"
							size="large"
							block
						>
							Upload
						</Button>
					</Form>
				</div>
			</div>
		</>
	);
};
