import { PercentageOutlined } from "@ant-design/icons";

export const PercentageOutline = (props) => (
	<PercentageOutlined
		{...props}
		style={{
			color: "#7f5af0",
			fontSize: "3rem",
			...props.style,
		}}
	/>
);
