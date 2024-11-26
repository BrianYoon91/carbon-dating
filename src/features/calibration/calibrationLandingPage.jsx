import { Link } from "react-router-dom";
import { DownSquareOutlined } from "@ant-design/icons";
import { PercentageOutline } from "../../components/icons";

export const CalibrationLandingPage = () => {
	return (
		<>
			<div className="flex flex-col items-center gap-20">
				<div className="flex flex-col items-center justify-center gap-8 my-24">
					<PercentageOutline />
					<h3 className="self-center text-center text-4xl mx-10 mb-20">
						Let's find out more about YOU
					</h3>
				</div>
				<div>
					<Link to="/calibrationquestions">
						<DownSquareOutlined className="text-5xl" />
					</Link>
				</div>
			</div>
		</>
	);
};
