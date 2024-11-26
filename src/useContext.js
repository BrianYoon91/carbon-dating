import React, { createContext, useContext, useEffect, useState } from "react";

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
} from "firebase/auth";

import {
	doc,
	setDoc,
	getDoc,
	getDocs,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { message } from "antd";

import { auth, dataCollection } from "./firebase";

const appContext = createContext();

export function AppContextProvider({ children }) {
	const [currentUserProfile, setCurrentUserProfile] = useState({});
	const [userUid, setUserUid] = useState({});
	const [userInfo, setUserInfo] = useState();
	const [categoryLikes, setCategoryLikes] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [uploadedPictures, setUploadedPictures] = useState([]);
	const [allProfiles, setAllProfiles] = useState([]);
	const [topFive, setTopFive] = useState([]);
	const [leaveX, setLeaveX] = useState(0);
	const [apiData, setApiData] = useState([]);
	const [nonSwipedUsers, setNonSwipedUsers] = useState([]);
	const [profilePicture, setProfilePicture] = useState();
	const [roomNumber, setRoomNumber] = useState("");
	const [matchedUpdates, setMatchedUpdates] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [matchedUsers, setMatchedUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [unreadMessageCount, setUnreadMessageCount] = useState();
	const [recentMessages, setRecentMessages] = useState([]);
	const [roomInfo, setRoomInfo] = useState([]);

	const signUp = async (email, password) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log(`Logged in:${user.email}`);
		} catch (error) {
			console.error("Sign-up error:", error.message);
			throw error;
		}
	};

	const logIn = async (email, password) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			message.success("Logged in successfully.", 2);
		} catch (error) {
			message.error("Login error. Please check your email and password", 2);
		}
	};

	const logOut = async () => {
		try {
			await signOut(auth);
			setUserUid(null);
			setCategoryLikes(null);
			setUserInfo(null);
			setUploadedPictures([]);
			setProfilePicture(null);
			message.success("Logged out successfully.", 2);
		} catch (error) {
			message.error(`Log out error: ${error.message}`, 2);
			throw error;
		}
	};

	const googleSignIn = async () => {
		try {
			const googleAuthProvider = new GoogleAuthProvider();
			const userCredential = await signInWithPopup(auth, googleAuthProvider);
			const user = userCredential.user;
			console.log("User signed in with Google:", user.email);
			return user;
		} catch (error) {
			console.error("Google sign-in error:", error.message);
			throw error;
		}
	};

	const userLoginCheck = async (user) => {
		try {
			// Reference the user's document in the Firestore collection
			const userDocRef = doc(dataCollection, user.uid);
			const docSnapshot = await getDoc(userDocRef);

			// Default user data to be set if the document doesn't exist
			const userData = {
				userLogin: {
					email: user.email,
					uid: user.uid,
				},
			};

			// Ensure userUid is set immediately
			setUserUid(user.uid);

			if (docSnapshot.exists()) {
				// Extract existing data from the document
				const existingData = docSnapshot.data();
				const { userInfo, categoryLikes, topFive, pictures, profilePicture } =
					existingData || {};

				// Safely set state with the extracted data
				setUserInfo(userInfo || null);
				setCategoryLikes(categoryLikes || null);
				setTopFive(topFive || []);
				setUploadedPictures(pictures || []);
				setProfilePicture(profilePicture || null);
				setCurrentUserProfile(existingData);

				// Update user login info if missing
				if (!existingData.userLogin) {
					await setDoc(userDocRef, userData);
				} else {
					await updateDoc(userDocRef, {
						"userLogin.timeLogged": new Date(),
					});
				}
			} else {
				// If the document doesn't exist, create it with default data
				await setDoc(userDocRef, userData);
				setCurrentUserProfile(userData);
			}

			// Signal that the app has finished loading user data
			setIsLoading(false);
		} catch (error) {
			// Log the error for debugging
			console.error("Error in userLoginCheck:", error.message);

			// Ensure `setIsLoading` is turned off even in case of errors
			setIsLoading(false);
		}
	};

	const getAllProfiles = async () => {
		const querySnapshot = await getDocs(dataCollection);
		let profileArray = [];
		querySnapshot.forEach((doc) => {
			profileArray.push(doc.data());
		});
		setAllProfiles(profileArray);
	};

	const handleAuthStateChanged = async (user) => {
		if (user) {
			await userLoginCheck(user);
			await getAllProfiles();
		}
	};

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				handleAuthStateChanged(user);
			} else {
				setUserUid(null);
			}
		});
	}, [auth]);

	return (
		<appContext.Provider
			value={{
				currentUserProfile,
				setCurrentUserProfile,
				userUid,
				setUserUid,
				logIn,
				logOut,
				signUp,
				googleSignIn,
				userInfo,
				setUserInfo,
				categoryLikes,
				setCategoryLikes,
				isLoading,
				setIsLoading,
				uploadedPictures,
				setUploadedPictures,
				allProfiles,
				setAllProfiles,
				topFive,
				setTopFive,
				leaveX,
				setLeaveX,
				apiData,
				setApiData,
				profilePicture,
				setProfilePicture,
				nonSwipedUsers,
				setNonSwipedUsers,
				roomNumber,
				setRoomNumber,
				matchedUpdates,
				setMatchedUpdates,
				modalIsOpen,
				setModalIsOpen,
				matchedUsers,
				setMatchedUsers,
				messages,
				setMessages,
				unreadMessageCount,
				setUnreadMessageCount,
				recentMessages,
				setRecentMessages,
				roomInfo,
				setRoomInfo,
			}}
		>
			{children}
		</appContext.Provider>
	);
}

export const useAppContext = () => {
	return useContext(appContext);
};
