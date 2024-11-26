import { categories } from "./calibrationConstants";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
	UpSquareOutlined,
	DownSquareOutlined,
	RightSquareOutlined,
} from "@ant-design/icons";

import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAppContext } from "../../useContext";
import { dataCollection } from "../../firebase";
import { CategoryPictures } from "./categoryPictures";
import { motion } from "framer-motion";
import { CalibrationTopIntro } from "./calibrationTopIntro";

export const CalibrationCategories = () => {
	const { userUid, setCategoryLikes } = useAppContext();
	const [mainCategoryIndex, setMainCategoryIndex] = useState(0);
	const [upClickState, setUpClickState] = useState(false);
	const [subCategoryIndex, setSubCategoryIndex] = useState(0);
	const categoriesArray = Object.keys(categories);

	let location = useLocation();

	useEffect(() => {
		if (location?.state?.category) {
			let recalibrateIndex = categoriesArray.indexOf(location.state.category);
			setMainCategoryIndex(recalibrateIndex || 0);
		} else {
			setMainCategoryIndex(0);
		}
	}, []);

	console.log(categoriesArray);
	console.log(mainCategoryIndex, subCategoryIndex);

	function categoryExpander() {
		setUpClickState(!upClickState);
	}

	function questionSkip() {
		setUpClickState(false);
		if (mainCategoryIndex < categoriesArray.length) {
			const newIndex = mainCategoryIndex + 1;
			setMainCategoryIndex(newIndex);
			setSubCategoryIndex(0);
		}
	}
	function nextSubcategory() {
		const swipingIndex = subCategoryIndex + 1;
		setSubCategoryIndex(swipingIndex);
	}

	function nextArrayIndex() {
		if (
			subCategoryIndex < categories[categoriesArray[mainCategoryIndex]].length
		) {
			nextSubcategory();
		}

		if (
			subCategoryIndex ==
			categories[categoriesArray[mainCategoryIndex]].length - 1
		) {
			categoryExpander();
			setMainCategoryIndex(mainCategoryIndex + 1);
			setSubCategoryIndex(0);
		}
	}

	async function addCategory(categoryData) {
		const selectedCategory = categoriesArray[mainCategoryIndex];
		const selectedSubCategory =
			categories[categoriesArray[mainCategoryIndex]][subCategoryIndex].name;
		const userDocRef = doc(dataCollection, userUid);

		try {
			const docSnapshot = await getDoc(userDocRef);

			if (!docSnapshot.exists()) {
				await setDoc(userDocRef, {
					categoryLikes: {
						[selectedCategory]: { [selectedSubCategory]: [categoryData] },
					},
				});
			} else {
				const updatedCategoryLikes = {};
				updatedCategoryLikes[
					`categoryLikes.${selectedCategory}.${selectedSubCategory}`
				] = arrayUnion(categoryData);

				await updateDoc(userDocRef, updatedCategoryLikes);
			}
			setCategoryLikes((prev) => {
				const newObj = { ...prev };
				if (!newObj[selectedCategory]) {
					newObj[selectedCategory] = {};
				}
				if (!newObj[selectedCategory][selectedSubCategory]) {
					newObj[selectedCategory][selectedSubCategory] = [];
				}
				newObj[selectedCategory][selectedSubCategory].push(categoryData);
				return newObj;
			});
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			{mainCategoryIndex === categoriesArray.length ? (
				<CalibrationTopIntro />
			) : (
				<div className="flex flex-col gap-2 overflow-x-hidden">
					<h3 className="text-2xl text-center">
						{!upClickState ? "swipe up to expand!" : "swipe down to collapse"}
					</h3>
					<div className="flex justify-center">
						{!upClickState ? (
							<UpSquareOutlined
								onClick={() => {
									categoryExpander();
								}}
								className="text-4xl"
							/>
						) : (
							<DownSquareOutlined
								onClick={() => {
									categoryExpander();
								}}
								className="text-4xl"
							/>
						)}
					</div>
					<h2 className="text-center text-2xl">
						{categoriesArray[mainCategoryIndex]}
					</h2>
					{upClickState && (
						<motion.div
							className="jello-horizontal"
							animate={{
								scale: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
							}}
							initial={{ scale: 1 }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							<h4 className="text-center">Swipe More For Better Match!</h4>
						</motion.div>
					)}
					{upClickState && (
						<>
							<h2 className="text-center text-2xl">
								{
									categories[categoriesArray[mainCategoryIndex]][
										subCategoryIndex
									]?.name
								}
							</h2>
							<div className="flex flex-col items-center">
								<RightSquareOutlined
									className="text-4xl"
									onClick={() => {
										nextArrayIndex();
									}}
								/>
								<h3 className="text-center">Press to go to next topic</h3>
							</div>
						</>
					)}
					<div className="my-2">
						{upClickState &&
							categories[categoriesArray[mainCategoryIndex]][
								subCategoryIndex
							] && (
								<CategoryPictures
									category={categoriesArray[mainCategoryIndex]}
									subcategory={
										categories[categoriesArray[mainCategoryIndex]][
											subCategoryIndex
										]?.name
									}
									subcategoryId={
										categories[categoriesArray[mainCategoryIndex]][
											subCategoryIndex
										].id
											? categories[categoriesArray[mainCategoryIndex]][
													subCategoryIndex
											  ].id
											: categories[categoriesArray[mainCategoryIndex]][
													subCategoryIndex
											  ]
									}
									upClickState={upClickState}
									nextSubcategory={nextSubcategory}
									addCategory={addCategory}
								/>
							)}
					</div>

					<div className="flex flex-col items-center gap-5">
						<h3 className="text-xl">skip or next category</h3>
						<DownSquareOutlined
							onClick={() => {
								questionSkip();
							}}
							className="text-4xl"
						/>
					</div>
				</div>
			)}
		</>
	);
};
