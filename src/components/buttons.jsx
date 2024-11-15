import React, { useState, useEffect } from "react";
import { Button, Form } from "antd";

export const SubmitButton = ({ form, onSubmit }) => {
	const values = Form.useWatch([], form);
	const [submitStatus, setsubmitStatus] = useState(false);
	useEffect(() => {
		form
			.validateFields({
				validateOnly: true,
			})
			.then(
				() => {
					setsubmitStatus(true);
				},
				() => {
					setsubmitStatus(false);
				}
			);
	}, [values]);
	return (
		<DefaultButton disabled={!submitStatus} onClick={onSubmit}>
			Register
		</DefaultButton>
	);
};

export const DefaultButton = ({
	children,
	type = "default",
	size = "large",
	disabled,
	htmlType,
	onClick,
}) => {
	return (
		<Button
			className="border-[#6246ea] bg-[#fffffe]"
			disabled={disabled}
			type={type}
			size={size}
			htmlType={htmlType}
			onClick={() => {
				if (onClick) {
					onClick();
				}
			}}
		>
			{children}
		</Button>
	);
};
