import { createClient } from 'redis';
const client = createClient({
  url: process.env.REDIS_STRING_URL,
  database: 10,
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err: any) => {
  console.log('Redis error: ', err);
});

client.connect();

export const setRedis = async (key: string, data: any) => {
  client.set(key, JSON.stringify(data));
}

export const getRedis = async (key: string) => {
  const value = await client.get(key);
  return value ? JSON.parse(value): value;
}
