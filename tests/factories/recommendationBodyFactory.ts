import faker from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

export function recommendationBody(): Recommendation {
    return {
        id: 1,
        name: faker.lorem.words(2),
        youtubeLink: 'https://www.youtube.com/',
        score: -1000
    }
}