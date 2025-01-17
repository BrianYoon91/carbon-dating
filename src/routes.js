import {
	LandingPage,
	LoginPage,
	SignUpPage,
	CalibrationLandingPage,
	CalibrationQuestionsPage,
	CalibrationIntroPage,
	CalibrationCategories,
	CalibrationTopIntro,
	CalibrationTopFive,
	CalibrationDone,
	ProfilePage,
	SwipeLandingPage,
	MatchesPage,
	ChatRoom,
	OverallMessages,
	TierListPage,
	PageNotFound,
} from "./features";

export const appComponents = [
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
	{
		element: <CalibrationLandingPage />,
		path: "/calibratelandingpage",
	},
	{
		element: <CalibrationQuestionsPage />,
		path: "/calibrationquestions",
	},
	{
		element: <CalibrationIntroPage />,
		path: "/calibrationintro",
	},
	{
		element: <CalibrationCategories />,
		path: "/calibrationcategories",
	},
	{
		element: <CalibrationTopIntro />,
		path: "/calibrationtopintro",
	},
	{
		element: <CalibrationTopFive />,
		path: "/calibrationtopfive",
	},
	{
		element: <CalibrationDone />,
		path: "/calibrationdone",
	},
	{
		element: <ProfilePage />,
		path: "/profilepage",
	},
	{
		element: <SwipeLandingPage />,
		path: "/swipelandingpage",
	},
	{
		element: <MatchesPage />,
		path: "/matches",
	},
	{
		element: <ChatRoom />,
		path: "/chatroom/:roomNumber/:matchedUser",
	},
	{
		element: <OverallMessages />,
		path: "/overallmessages",
	},
	{
		element: <TierListPage />,
		path: "/tierlistpage",
	},
	{
		element: <PageNotFound />,
		path: "*",
	},
];
