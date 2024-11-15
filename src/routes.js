import { LandingPage, LoginPage, SignUpPage } from "./features";

export const routes = [
	{
		element: <LandingPage />,
		path: "/",
	},
	{
		element: <LoginPage />,
		path: "/loginpage",
	},
	{
		element: <SignUpPage />,
		path: "/signup",
	},
];
