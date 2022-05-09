import app from '../../src/app.js';
import supertest from 'supertest';
import { prisma } from '../../src/database.js';
import { faker } from '@faker-js/faker';

const agent = supertest(app);

beforeAll(async () => {
	await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe('GET /recommendations', () => {
	it('should return a list of recommendations or a empty list', async () => {
		const res = await agent.get('/recommendations');

		expect(res.status).toEqual(200);
		expect(res.body).not.toBeNull();
	});
});

describe('POST /recommendations', () => {
	it('should create and persist a new recommendation given a valid body', async () => {
		const body = {
			name: faker.lorem.words(3),
			youtubeLink:
				'https://www.youtube.com/watch?v=HmAsUQEFYGI&ab_channel=Tyler%2CTheCreator',
		};

		const res = await agent.post('/recommendations').send(body);
		const createdRecommendation = await prisma.recommendation.findMany({
			where: {
				name: body.name,
			},
		});

		expect(res.status).toEqual(201);
		expect(createdRecommendation.length).toEqual(1);
		expect(createdRecommendation[0].name).toEqual(body.name);
	});

	it('should not create a new recommendation given an invalid body', async () => {
		const body = {};

		const res = await agent.post('/recommendations').send(body);

		expect(res.status).toEqual(422);
	});
});

describe('POST /recommendations/:id/upvote', () => {
	it('should increase the score count by 1', async () => {
		const music = await prisma.recommendation.findFirst({});

		const res = await agent.post(`/recommendations/${music.id}/upvote`);

		const newScoreCount = await prisma.recommendation.findUnique({
			where: { id: music.id },
		});

		expect(res.status).toEqual(200);
		expect(music.score + 1).toEqual(newScoreCount.score);
	});
});

describe('POST /recommendations/:id/downvote', () => {
	it('should decrease the score count by 1', async () => {
		const music = await prisma.recommendation.findFirst({});

		const res = await agent.post(`/recommendations/${music.id}/downvote`);

		const newScoreCount = await prisma.recommendation.findUnique({
			where: { id: music.id },
		});

		expect(res.status).toEqual(200);
		expect(music.score - 1).toEqual(newScoreCount.score);
	});
});

describe('GET /recommendations/:id', () => {
	it('should return one recommendation given its id', async () => {
		const music = await prisma.recommendation.findFirst({});

		const res = await agent.get(`/recommendations/${music.id}`);

		expect(res.status).toEqual(200);
		expect(res.body.name).toEqual(music.name);
	});
});

describe('GET /recommendations/random', () => {
	it('should return one random recommendation', async () => {
		const res = await agent.get('/recommendations/random');
		const randomMusic = await prisma.recommendation.findMany({
			where: { name: res.body.name },
		});

		expect(res.status).toEqual(200);
        expect(randomMusic).not.toBeNull();
        expect(randomMusic.length).toEqual(1);
	});
});

describe('GET /recommendations/top/:amount', () => {
	it('should return a list of recommendations by a given amount', async () => {
		const res = await agent.get(`/recommendations/top/${faker.random.numeric()}`);
	
		expect(res.status).toEqual(200);
		expect(res.body).not.toBeNull();
	});
});

// describe('POST /reset-database', () => {
// 	it('should erase all data from the database', async () => {
// 		const res = await agent.post('/reset-database');

// 		expect(res.status).toEqual(200);
// 	})
// })

// describe('POST /seed-database', () => {
// 	it('should seed data to the database', async () => {
// 		const res = await agent.post('/seed-database');

// 		expect(res.status).toEqual(201);
// 	})
// })