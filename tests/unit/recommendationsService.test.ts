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

	it.todo('should throw an error if the id does not exist');
});
