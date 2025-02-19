import { redis } from "./redis.js";
const BLACKLIST_COLLECTION =
  process.env.REDIS_BLACKLIST_COLLECTION || "blacklist_ips";

export const isBlacklisted = async (ip: string) =>
  await redis.sIsMember(BLACKLIST_COLLECTION, ip);

export const addToBlaclist = async (ip: string) =>
  await redis.sAdd(BLACKLIST_COLLECTION, ip);
