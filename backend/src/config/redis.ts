import { createClient } from 'redis';
import config from './index';

const redisClient = createClient({
  url: config.REDIS_URL,
  password: config.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('disconnect', () => {
  console.log('Disconnected from Redis');
});

export default redisClient;
