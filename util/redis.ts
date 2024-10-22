import Redis from "ioredis";
const redisConnectionString = process.env.NEXT_REDIS_URL!;
const redis = new Redis(redisConnectionString);
export default redis;