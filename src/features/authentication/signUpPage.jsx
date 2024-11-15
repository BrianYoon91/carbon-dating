import React from "react";
import { Form, Input, Checkbox, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DefaultButton } from "../../components/buttons";
import { MainTitle } from "../../components/title";
import { PercentageOutline } from "../../components/icons";
import { SubmitButton } from "../../components/buttons";
import { useAppContext } from "../../useContext";

export const SignUpPage = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [api] = notification.useNotification();
	const { signUp } = useAppContext();

	const signUpNotification = () => {
		api.info({
			message: "Sign Up Successful!",
			duration: 2,
		});
	};

	const signIn = async () => {
		try {
			await signUp(form.getFieldsValue().email, form.getFieldsValue().password);
			signUpNotification();
			navigate("/calibratelandingpage");
		} catch (err) {}
	};

	return (
		<div className="mt-6 flex flex-col justify-center items-center gap-5">
			<PercentageOutline />
			<MainTitle />
			<Form form={form} name="validateOnly">
				<Form.Item
					name="email"
					label="E-mail"
					rules={[
						{
							type: "email",
							message: "The input is not valid E-mail!",
						},
						{
							required: true,
							message: "Please input your E-mail!",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="password"
					label="Password"
					rules={[
						{
							required: true,
							message: "Your password needs to be more than 6 characters",
							min: 6,
						},
					]}
					hasFeedback
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					name="confirm"
					label="Confirm Password"
					dependencies={["password"]}
					hasFeedback
					rules={[
						{
							required: true,
							message: "Please confirm your password!",
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("password") === value) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error("The new password that you entered do not match!")
								);
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					className="flex justify-center"
					name="agreement"
					valuePropName="checked"
					rules={[
						{
							validator: (_, value) =>
								value
									? Promise.resolve()
									: Promise.reject(new Error("Should accept agreement")),
						},
					]}
				>
					<Checkbox>
						I have read the <a href="">agreement</a>
					</Checkbox>
				</Form.Item>
				<Form.Item className="flex justify-center">
					<SubmitButton form={form} onSubmit={signIn} />
				</Form.Item>
			</Form>
			<Link to="/loginpage">
				<DefaultButton>Back to login</DefaultButton>
			</Link>
		</div>
	);
};
