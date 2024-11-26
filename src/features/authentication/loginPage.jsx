import React from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppContext } from "../../useContext";
import { PercentageOutline } from "../../components/icons";
import { MainTitle } from "../../components/title";
import { DefaultButton } from "../../components/buttons";

export const LoginPage = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { logIn, googleSignIn } = useAppContext();

	const signIn = async () => {
		try {
			await logIn(form.getFieldsValue().email, form.getFieldsValue().password);
		} catch (err) {}
	};

	return (
		<div className="mt-6 flex flex-col justify-center items-center gap-5">
			<PercentageOutline />
			<MainTitle />
			<Form
				form={form}
				name="normal_login"
				className="login-form"
				style={{
					maxWidth: 600,
				}}
			>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: "Please put your email!",
						},
					]}
				>
					<Input prefix={<UserOutlined />} placeholder="Email" type="email" />
				</Form.Item>

				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: "Please put your password!",
						},
					]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder="Password" />
				</Form.Item>

				<Form.Item className="flex justify-center">
					<Link>
						<a className="" href="">
							Forgot password
						</a>
					</Link>
				</Form.Item>
				<div className="flex flex-col mt-10 gap-4">
					<DefaultButton onClick={signIn}>
						<h3>L o g i n</h3>
					</DefaultButton>
					<DefaultButton onClick={googleSignIn}>
						<h3>Sign In With Google</h3>
					</DefaultButton>
					<div className="flex justify-center">
						<Link to="/signup">
							<DefaultButton>
								<h3>Create Account</h3>
							</DefaultButton>
						</Link>
					</div>
				</div>
			</Form>
		</div>
	);
};
