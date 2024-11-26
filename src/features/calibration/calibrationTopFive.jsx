import { useState } from "react";
import { useNavigate } from "react-router";

import { PercentageOutline } from "../../components/icons";
import { categories } from "./calibrationConstants";

import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAppContext } from "../../useContext";
import { dataCollection } from "../../firebase";

export const CalibrationTopFive = () => {
	const navigate = useNavigate();
	const { userUid, setTopFive } = useAppContext();
	const [topFiveIndex, setTopFiveIndex] = useState(0);
	const categoriesArray = Object.keys(categories);
	let firstTopFive = categoriesArray[topFiveIndex];
	let secondTopFive = categoriesArray[topFiveIndex + 1];

	function nextTopFive() {
		if (topFiveIndex < categoriesArray.length) {
			let newIndex = topFiveIndex + 2;
			setTopFiveIndex(newIndex);
		}
		if (topFiveIndex == categoriesArray.length - 2) {
			navigate("/calibrationdone");
		}
	}

	async function getTopFive() {
		const userDocRef = doc(dataCollection, userUid);
		try {
			const docSnapshot = await getDoc(userDocRef);
			if (docSnapshot.exists()) {
				const topFive = docSnapshot.data().topFive;
				setTopFive(topFive);
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function addTopFive(selection) {
		const userDocRef = doc(dataCollection, userUid);
		try {
			const docSnapshot = await getDoc(userDocRef);
			if (!docSnapshot.exists()) {
				await setDoc(userDocRef, { topFive: selection });
			} else {
				await updateDoc(userDocRef, { topFive: arrayUnion(selection) });
			}
			getTopFive();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="flex flex-col items-center gap-10">
				<PercentageOutline />
				<div
					className="flex flex-col p-5 items-center border-2 rounded-lg
 border-solid	border-white"
				>
					<h2>{firstTopFive}</h2>
					<div className="w-full flex justify-center my-5">
						<RightSquareOutlined
							onClick={() => {
								nextTopFive();
								addTopFive(firstTopFive);
							}}
							className="text-5xl"
						/>
					</div>
				</div>

				<h2>swipe!</h2>

				<div
					className="flex flex-col p-5 items-center border-2 rounded-lg
border-solid border-white	"
				>
					<h2>{secondTopFive}</h2>
					<div className="w-full flex justify-center my-5">
						<LeftSquareOutlined
							onClick={() => {
								nextTopFive();
								addTopFive(secondTopFive);
							}}
							className="text-5xl"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
