const request = require("supertest");
const app = require("../../app");  // Your express app

describe("Analytics Routes", () => {

    describe("GET /analytics/overall", () => {
        it("should return overall analytics for authenticated user", async () => {
            const res = await request(app)
                .get("/analytics/overall")
                .set("Authorization", `Bearer valid_token`);  // Replace with a valid JWT

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("totalUrls");
            expect(res.body).toHaveProperty("totalClicks");
            expect(res.body).toHaveProperty("uniqueUsers");
        });
    });

    describe("GET /analytics/:alias", () => {
        it("should return URL analytics for a given alias", async () => {
            const alias = "validAlias";  // Replace with a valid alias
            const res = await request(app).get(`/analytics/${alias}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("totalClicks");
            expect(res.body).toHaveProperty("uniqueUsers");
        });

        it("should return 404 if no analytics data found for alias", async () => {
            const alias = "invalidAlias";  // Replace with an invalid alias
            const res = await request(app).get(`/analytics/${alias}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("error", "No analytics data found for this shortAlias");
        });
    });

    describe("GET /analytics/topic/:topic", () => {
        it("should return topic analytics", async () => {
            const topic = "validTopic";  // Replace with a valid topic
            const res = await request(app).get(`/analytics/topic/${topic}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("totalClicks");
            expect(res.body).toHaveProperty("uniqueUsers");
            expect(res.body).toHaveProperty("urls");
        });

        it("should return 400 if topic parameter is missing", async () => {
            const res = await request(app).get(`/analytics/topic/`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error", "Topic parameter is required");
        });

        it("should return 400 if no URLs found for the given topic", async () => {
            const topic = "nonExistentTopic";  // Replace with a topic that has no URLs
            const res = await request(app).get(`/analytics/topic/${topic}`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error", "No URLs found for this topic.");
        });
    });
});
