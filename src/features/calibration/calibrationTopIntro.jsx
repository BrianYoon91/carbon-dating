import { Link } from "react-router-dom";
import { DownSquareOutlined } from "@ant-design/icons";
import { PercentageOutline } from "../../components/icons";

export const CalibrationTopIntro = () => {
	return (
		<>
			<div className="flex flex-col items-center gap-10">
				<PercentageOutline />
				<div className="my-10">
					<h2 className="text-center m-4 text-4xl">
						now let's see your top 5!
					</h2>
				</div>
				<Link to="/calibrationtopfive">
					<DownSquareOutlined className="text-5xl" />
				</Link>
			</div>
		</>
	);
};
