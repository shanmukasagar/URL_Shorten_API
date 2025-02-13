const request = require('supertest');
const app = require('../../app');
const redisClient = require('../../config/redis'); // Import Redis client

describe('Authentication API', () => {
    let agent;

    beforeAll(() => {
        agent = request.agent(app); // Maintain session across requests
    });

    afterAll(async () => {
        await redisClient.quit(); // Close Redis connection
    });

    test('Should redirect to Google for authentication', async () => {
        const res = await agent.get('/auth/google');
        expect(res.statusCode).toBe(302); // Redirect
    });

});
