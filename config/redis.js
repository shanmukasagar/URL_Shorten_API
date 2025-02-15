require("dotenv").config();
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URI, // Ensure this is set in your .env file or Render environment variables
  socket: { tls: true }, // Required for Upstash
});

client.on("error", (err) => console.error("Redis Error:", err));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Upstash Redis");

    // Test connection
    const pong = await client.ping();
    console.log("Redis Ping Response:", pong); // Should print: PONG
  } catch (error) {
    console.error("Redis Connection Failed:", error);
  }
};

connectRedis();

module.exports = client; // Export for use in other files if needed
