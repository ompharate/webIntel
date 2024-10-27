import Redis from "ioredis";

let redis: Redis;

const getRedisClient = () => {
  if (!redis) {
    const redisConnectionString = process.env.NEXT_REDIS_URL;

    if (!redisConnectionString) {
      throw new Error(
        "Redis connection string is not defined. Please set NEXT_REDIS_URL in your environment."
      );
    }

    redis = new Redis(redisConnectionString);

    redis.on("connect", () => {
      console.log("Connected to Redis");
    });

    redis.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  return redis;
};

const redisClient = getRedisClient();

export default redisClient;
