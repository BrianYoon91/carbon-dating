import { PercentageOutline } from "../../components/icons";
import { bioQuestions } from "./calibrationConstants";
import { Link } from "react-router-dom";
import { Form, Input, message } from "antd";
import { SubmitButton } from "../../components/buttons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAppContext } from "../../useContext";
import { dataCollection } from "../../firebase";

export const CalibrationQuestionsPage = () => {
	const [form] = Form.useForm();
	const { userUid, setUserInfo } = useAppContext();

	const bioSubmit = async () => {
		const filledInfo = form.getFieldsValue();
		try {
			const userDocRef = doc(dataCollection, userUid);
			const docSnapshot = await getDoc(userDocRef);

			if (docSnapshot.exists()) {
				await updateDoc(userDocRef, { userInfo: filledInfo });
				setUserInfo(filledInfo);
				message.success("Information has been updated", 2);
			}
		} catch (err) {
			message.error(err, 2);
		}
	};

	return (
		<div className="flex flex-col items-center gap-10">
			<PercentageOutline />
			<div className="my-16">
				<Form form={form}>
					{bioQuestions.map((category) => (
						<Form.Item
							className="flex flex-col"
							name={category}
							label={capitalizeFirstLetter(category)}
							rules={[
								{
									required: true,
									message: `Please put your ${category}!`,
								},
							]}
						>
							<Input />
						</Form.Item>
					))}
					<Link to="/calibrationintro">
						<span className="flex justify-center">
							<SubmitButton form={form} onSubmit={bioSubmit} />
						</span>
					</Link>
				</Form>
			</div>
		</div>
	);
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
