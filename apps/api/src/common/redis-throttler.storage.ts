import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ThrottlerStorage } from "@nestjs/throttler";
import type { ThrottlerStorageRecord } from "@nestjs/throttler/dist/throttler-storage-record.interface";
import type { Redis } from "ioredis";

const INCR_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("PTTL", KEYS[1])
return {current, ttl}
`;

@Injectable()
export class RedisThrottlerStorage
  implements ThrottlerStorage, OnModuleDestroy
{
  constructor(private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const throttleKey = `throttle:${throttlerName}:${key}`;
    const blockKey = `throttle:${throttlerName}:block:${key}`;

    // If user is currently blocked, return blocked state
    if (blockDuration > 0) {
      const blockTtl = await this.redis.pttl(blockKey);
      if (blockTtl > 0) {
        return {
          totalHits: limit + 1,
          timeToExpire: blockTtl,
          isBlocked: true,
          timeToBlockExpire: blockTtl,
        };
      }
    }

    // Normal rate-limit window increment
    const result = (await this.redis.eval(
      INCR_SCRIPT,
      1,
      throttleKey,
      ttl,
    )) as [number, number];
    const totalHits = Number(result?.[0] ?? 0);
    const ttlRemaining = Number(result?.[1] ?? ttl);
    const timeToExpire = ttlRemaining > 0 ? ttlRemaining : ttl;

    // Apply block if over limit
    let isBlocked = false;
    let timeToBlockExpire = 0;

    if (totalHits > limit && blockDuration > 0) {
      await this.redis.psetex(blockKey, blockDuration, "1");
      isBlocked = true;
      timeToBlockExpire = blockDuration;
    }

    return {
      totalHits,
      timeToExpire,
      isBlocked,
      timeToBlockExpire,
    };
  }
}
