import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationBody } from '../factories/recommendationBodyFactory.js';

describe('Recommendations services unit tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should not create a recommendation with repeatead name', async () => {
		const recommendation = recommendationBody();
		jest
			.spyOn(recommendationRepository, 'findByName')
			.mockResolvedValue(recommendation);

		const insert = async () =>
			await recommendationService.insert({
				name: recommendation.name,
				youtubeLink: recommendation.youtubeLink,
			});

		const create = jest.spyOn(recommendationRepository, 'create');

		expect(insert()).rejects.toEqual({
			message: 'Recommendations names must be unique',
			type: 'conflict',
		});
		expect(create).not.toBeCalled();
	});

	it('should remove the music where the score is -5', async () => {
		const body = recommendationBody();
		jest.spyOn(recommendationRepository, 'find').mockResolvedValue(body)

		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValue(body)
		
		const remove = jest
			.spyOn(recommendationRepository, 'remove')
			.mockResolvedValue(null);

		await recommendationService.downvote(body.id)

		expect(remove).toBeCalled();
	});

	it('should search for recommendations by id and throw error if not found', async () => {
		const upvote = async () =>
			await recommendationService.upvote(null);

		expect(upvote()).rejects.toEqual({
			message: '',
			type: 'not_found'
		})
	});

	it('should throw an error if no recommendations are found', async () => {
		const scoreFilter = recommendationService.getScoreFilter(1);

    	jest.spyOn(recommendationService, 'getByScore').mockResolvedValue([]);
    	jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);
		
		const getRandom = async () => 
			await recommendationService.getRandom();

		expect(getRandom()).rejects.toEqual({
			message: '',
			type: 'not_found',
		});
		expect(scoreFilter).toEqual('lte');
	});

	it('should return recommendations by score filter', async () => {
		const getByScore = async () => await recommendationService.getByScore('gt');
		
		expect((await getByScore()).length).toBeGreaterThan(0);
	})

	it('should truncate the database', async () => {
		const truncate = jest.spyOn(recommendationRepository, 'truncate')

		await recommendationService.truncate();

		expect(truncate).toBeCalled();
	})

	it('should seed the database', async () => {
		const seed = jest.spyOn(recommendationRepository, 'seed')

		await recommendationService.seed();

		expect(seed).toBeCalled();
	})
});
