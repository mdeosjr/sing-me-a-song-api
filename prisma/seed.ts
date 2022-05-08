import { prisma } from '../src/database.js';

async function main() {
	await prisma.recommendation.createMany({
		data: [
			{
				name: 'Kendrick Lamar - Humble',
				youtubeLink:
					'https://www.youtube.com/watch?v=tvTRZJ-4EyI&ab_channel=KendrickLamarVEVO',
				score: 200,
			},
			{
				name: 'Childish Gambino -  This Is America',
				youtubeLink:
					'https://www.youtube.com/watch?v=VYOjWnS4cMY&ab_channel=ChildishGambinoVEVO',
				score: 100,
			},
			{
				name: 'Kanye West - Hurricane',
				youtubeLink:
					'https://www.youtube.com/watch?v=VRJiK-kdDb4&ab_channel=KanyeWestVEVO',
				score: 0,
			},
		],
		skipDuplicates: true,
	});
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
