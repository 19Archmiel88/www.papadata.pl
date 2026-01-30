import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { SupportContactRequest, SupportContactResponse } from '@papadata/shared';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

@Injectable()
export class SupportService {
  submitContact(payload: SupportContactRequest): SupportContactResponse {
    const name = payload?.name?.trim() ?? '';
    const email = payload?.email?.trim().toLowerCase() ?? '';
    const message = payload?.message?.trim() ?? '';

    if (name.length < 2) {
      throw new BadRequestException('Name is required');
    }
    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }
    if (message.length < 10) {
      throw new BadRequestException('Message is too short');
    }

    return {
      ok: true,
      ticketId: randomUUID(),
      receivedAt: new Date().toISOString(),
    };
  }
}
