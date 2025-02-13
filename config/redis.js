const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
  });

  redisClient.on("error", (err) => console.error("Redis Error:", err));

  redisClient.connect()  // Explicitly connecting the Redis client
    .then(() => {
      console.log("Redis client connected successfully");
    })
    .catch((err) => {
      console.error("Error connecting to Redis:", err);
  });


module.exports = redisClient;
