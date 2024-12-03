import { Link } from "react-router-dom";
import { Button } from "antd";
import { useAppContext } from "../../useContext";

export const PageNotFound = () => {
	const { userUid } = useAppContext();

	return (
		<>
			<div className="mt-6 flex flex-col justify-center items-center gap-3">
				<h2>Hey!</h2>
				<p>{userUid ? "The page does not exist!" : "You are not logged in!"}</p>
				<Link to={userUid ? "/profilepage" : "/"}>
					<Button type="default" size="large">
						{userUid ? "Back To Profile" : "Back to Login"}
					</Button>
				</Link>
			</div>
		</>
	);
};
