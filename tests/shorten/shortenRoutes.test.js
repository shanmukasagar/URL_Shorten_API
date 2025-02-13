const request = require("supertest");
const app = require("../../app"); // Import Express App

// Mock Service Layer
jest.mock("../../services/shortenService");

describe("Shorten Controller", () => {
    describe("POST /api/shorten", () => {
        it("should return 400 if longUrl is missing", async () => {
            const res = await request(app)
                .post("/api/shorten")
                .send({})
                .set("Authorization", "Bearer token");

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("longUrl is required!");
        });
    });

});
