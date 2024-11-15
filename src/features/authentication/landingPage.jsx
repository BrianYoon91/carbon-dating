import { Link } from "react-router-dom";
import { PercentageOutline } from "../../components/icons";
import { MainTitle } from "../../components/title";
import { DefaultButton } from "../../components/buttons";

export const LandingPage = () => {
	return (
		<div className="flex flex-col items-center gap-5 my-[20%]">
			<PercentageOutline />
			<MainTitle />
			<div className="flex flex-col items-center gap-4 mt-20">
				<Link to="/loginpage">
					<DefaultButton>L o g i n</DefaultButton>
				</Link>
				<Link to="/signuppage">
					<DefaultButton>Make Account</DefaultButton>
				</Link>
			</div>
		</div>
	);
};
