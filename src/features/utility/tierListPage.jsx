export const TierListPage = () => {
	return (
		<>
			<div className="m-10">
				{tierArray.map((tier) => (
					<div className="flex flex-col">
						<h3 className="font-bold">{tier.tier}</h3>
						<p>{tier.description}</p>
					</div>
				))}
			</div>
		</>
	);
};

const tierArray = [
	{
		tier: "Bronze",
		description:
			"You have some common interests, but not the same genres. For example, you may have interest in music but not like the same genre of music.",
	},
	{
		tier: "Silver",
		description: "You have decent amount of interests, but not the same genres",
	},
	{
		tier: "Gold",
		description:
			"Quite a bit of same interests! And some similarities in sub genres",
	},
	{
		tier: "Platinum",
		description: "Wow, this is quite a bit of similarities!",
	},
	{
		tier: "Carbon",
		description: "This is an insane. Tread carefully.",
	},
];
