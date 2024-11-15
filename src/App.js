import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";

import { HeartOutlineIcon } from "./components/icons";
import { Button, Layout, message, notification } from "antd";
import { routes } from "./routes";

const { Header, Content, Footer } = Layout;

function App() {
	return (
		<div className="flex justify-center items-center m-4">
			<Layout
				style={{
					margin: 5,
					maxWidth: 480,
					borderStyle: "double",
					borderColor: "#6246ea",
					borderWidth: 4,
					height: "95vh",
				}}
			>
				<Header
					style={{
						display: "flex",
						justifyContent: "flex-end",
						background: "#fffffe",
						padding: 20,
					}}
				></Header>
				<Content
					style={{
						background: "#fffffe",
						overflow: "auto",
					}}
				>
					<Routes>
						{routes.map(({ element, path }, key) => (
							<Route path={path} element={element} key={key} />
						))}
					</Routes>
				</Content>
				{/* <Footer
					style={{
						position: "sticky",
						bottom: 0,
						background: "#fffffe",
						width: "100%",
						borderTopStyle: "double",
						borderTopColor: "#6246ea",
						borderTopWidth: 4,
					}}
				></Footer> */}
			</Layout>
		</div>
	);
}

export default App;
