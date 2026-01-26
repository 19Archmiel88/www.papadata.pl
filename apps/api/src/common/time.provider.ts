import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeProvider {
  now(): Date {
    return new Date();
  }

  nowMs(): number {
    return Date.now();
  }
}
