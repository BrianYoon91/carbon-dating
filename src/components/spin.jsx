import { Spin } from "antd";

export const Spinner = () => {
	return (
		<div className="flex justify-center items-center h-screen">
			<Spin size="large" />
		</div>
	);
};
