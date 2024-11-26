import React, { useState } from "react";
import { PercentageOutline } from "../../components/icons";
import { Link } from "react-router-dom";
import { DownSquareOutlined } from "@ant-design/icons";

export const CalibrationIntroPage = () => {
	const [slideIndex, setSlideIndex] = useState(0);
	const introQuote = [
		"almost there!",
		"we just need to know",
		"a bit more about you!",
		"and explore our app!",
	];

	const slideClick = () => {
		if (slideIndex < 3) {
			const newIndex = slideIndex + 1;
			setSlideIndex(newIndex);
		}
	};

	return (
		<>
			<div className="flex flex-col items-center gap-40">
				<PercentageOutline />
				<div className="flex flex-col items-center">
					<h3 className="text-center text-4xl mx-10 mb-20">
						{introQuote[slideIndex]}
					</h3>
					{slideIndex < 3 ? (
						<DownSquareOutlined
							onClick={() => {
								slideClick();
							}}
							className="text-5xl"
						/>
					) : (
						<Link to="/calibrationcategories">
							<DownSquareOutlined className="text-5xl" />
						</Link>
					)}
				</div>
			</div>
		</>
	);
};
