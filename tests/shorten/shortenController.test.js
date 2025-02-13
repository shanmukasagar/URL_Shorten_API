const request = require("supertest");
const app = require("../../app"); // Import Express App
const { shortenUrl, longURL } = require("../../services/shortenService");
const { createShortUrl, redirectLongUrl } = require("../../controllers/shortenController");

// Mock Service Layer
jest.mock("../services/shortenService");

describe("Shorten Controller", () => {
    describe("POST /api/shorten", () => {
        it("should create a short URL successfully", async () => {
            shortenUrl.mockResolvedValue({
                shortUrl: "http://short.ly/abcd1234",
                createdAt: new Date(),
            });

            const res = await request(app)
                .post("/api/shorten")
                .send({ longUrl: "https://example.com" })
                .set("Authorization", "Bearer token");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("shortUrl");
        });

        it("should return 400 if longUrl is missing", async () => {
            const res = await request(app)
                .post("/api/shorten")
                .send({})
                .set("Authorization", "Bearer token");

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("longUrl is required!");
        });
    });

    describe("GET /api/shorten/:alias", () => {
        it("should redirect to long URL", async () => {
            longURL.mockResolvedValue("https://example.com");

            const res = await request(app)
                .get("/api/shorten/abcd1234")
                .set("Authorization", "Bearer token");

            expect(res.status).toBe(302);
            expect(res.headers.location).toBe("https://example.com");
        });

        it("should return 400 if short URL is not found", async () => {
            longURL.mockResolvedValue({ error: "Short URL not found" });

            const res = await request(app)
                .get("/api/shorten/wrongalias")
                .set("Authorization", "Bearer token");

            expect(res.status).toBe(400);
            expect(res.body).toBe("Short URL not found");
        });
    });
});
