import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { getApiConfig } from './config';

type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly store = new Map<string, CacheEntry>();
  private readonly defaultTtlMs = this.resolveDefaultTtl();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 30_000);
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const ms =
      Number.isFinite(Number(ttlMs)) && (ttlMs as number) > 0
        ? (ttlMs as number)
        : this.defaultTtlMs;
    const expiresAt = Date.now() + ms;
    this.store.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  onModuleDestroy(): void {
    clearInterval(this.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }

  private resolveDefaultTtl(): number {
    const raw = getApiConfig().cacheTtlMs;
    if (!Number.isFinite(raw) || raw <= 0) {
      return 15_000;
    }
    return raw;
  }
}
