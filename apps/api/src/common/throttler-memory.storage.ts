import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import type { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';

type MemoryState = {
  totalHits: number;
  windowExpiresAt: number;
  blockExpiresAt: number | null;
};

@Injectable()
export class ThrottlerMemoryStorage implements ThrottlerStorage, OnModuleDestroy {
  private storage = new Map<string, MemoryState>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, s] of this.storage.entries()) {
      const maxExpiry = Math.max(s.windowExpiresAt, s.blockExpiresAt ?? 0);
      if (now >= maxExpiry) this.storage.delete(key);
    }
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    const now = Date.now();
    const k = `throttle:${throttlerName}:${key}`;

    let s = this.storage.get(k);

    // Reset window if missing/expired
    if (!s || now >= s.windowExpiresAt) {
      s = {
        totalHits: 0,
        windowExpiresAt: now + ttl,
        blockExpiresAt: null,
      };
    }

    // If currently blocked, just return blocked state
    if (s.blockExpiresAt && now < s.blockExpiresAt) {
      const timeToExpire = Math.max(0, s.windowExpiresAt - now);
      const timeToBlockExpire = Math.max(0, s.blockExpiresAt - now);

      this.storage.set(k, s);
      return {
        totalHits: limit + 1,
        timeToExpire,
        isBlocked: true,
        timeToBlockExpire,
      };
    }

    // Increment hits in current window
    s.totalHits += 1;

    // Block if over limit
    if (s.totalHits > limit && blockDuration > 0) {
      s.blockExpiresAt = now + blockDuration;
    }

    const isBlocked = !!(s.blockExpiresAt && now < s.blockExpiresAt);
    const timeToExpire = Math.max(0, s.windowExpiresAt - now);
    const timeToBlockExpire = isBlocked ? Math.max(0, (s.blockExpiresAt as number) - now) : 0;

    this.storage.set(k, s);

    return {
      totalHits: s.totalHits,
      timeToExpire,
      isBlocked,
      timeToBlockExpire,
    };
  }
}
