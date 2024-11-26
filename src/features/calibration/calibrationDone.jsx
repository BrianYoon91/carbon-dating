import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export const CalibrationDone = () => {
	const navigate = useNavigate();

	return (
		<>
			<div className="flex flex-col items-center gap-3">
				<div className="my-10">
					<h2 className="text-center">All done!</h2>
				</div>
				<div>
					<h2>Let go upload</h2>
					<h2 className="text-center">some pictures!</h2>
				</div>
				<div className="my-10">
					<Button size="large" onClick={() => navigate("/profilepage")}>
						Profile Page
					</Button>
				</div>
			</div>
		</>
	);
};
