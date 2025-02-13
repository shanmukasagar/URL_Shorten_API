const { shortenUrl, longURL } = require("../../services/shortenService");
const { connectDB, getDB } = require("../../config/db");
const redisClient = require("../../config/redis");

jest.mock("../../config/db");
jest.mock("../../config/redis");

describe("Shorten Service", () => {
    beforeEach(() => {
        connectDB.mockResolvedValue();
        getDB.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn(),
                insertOne: jest.fn().mockResolvedValue({ acknowledged: true }),
            }),
        });
        redisClient.get = jest.fn();
        redisClient.setEx = jest.fn();
    });

    describe("shortenUrl", () => {
        it("should return error if custom alias already exists", async () => {
            getDB().collection().findOne.mockResolvedValue({ shortUrl: "custom123" });

            const result = await shortenUrl({ longUrl: "https://example.com", customAlias: "custom123" });
            expect(result.error).toBe("Custom alias already taken!");
        });
    });

    describe("longURL", () => {
        it("should return long URL from Redis", async () => {
            redisClient.get.mockResolvedValue("https://example.com");

            const result = await longURL("abcd1234", "127.0.0.1", "Mozilla/5.0", "user@example.com");
            expect(result).toBe("https://example.com");
        });

        it("should return error if short URL is not found", async () => {
            redisClient.get.mockResolvedValue(null);
            getDB().collection().findOne.mockResolvedValue(null);

            const result = await longURL("invalidAlias", "127.0.0.1", "Mozilla/5.0", "user@example.com");
            expect(result.error).toBe("Short URL not found");
        });
    });
});
