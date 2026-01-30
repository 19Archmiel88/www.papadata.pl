import { BadRequestException, Injectable } from '@nestjs/common';
import type { CompanyLookupResponse, HealthResponse } from '@papadata/shared';
import { getAppMode } from './common/app-mode';

const isValidNip = (nip: string) => {
  if (!/^\d{10}$/.test(nip)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = w.reduce((acc, weight, i) => acc + weight * Number(nip[i]), 0);
  const mod = sum % 11;
  if (mod === 10) return false;
  return mod === Number(nip[9]);
};

@Injectable()
export class AppService {
  health(): HealthResponse {
    return {
      status: 'ok',
      mode: getAppMode(),
      timestamp: new Date().toISOString(),
    };
  }

  lookupCompany(nipRaw: string): CompanyLookupResponse {
    const nip = (nipRaw ?? '').trim();
    if (!isValidNip(nip)) {
      throw new BadRequestException('Invalid NIP');
    }

    const suffix = nip.slice(-4);
    const cityCode = Number(nip.slice(-2));
    const city = cityCode % 2 === 0 ? 'Warszawa' : 'Krakow';

    return {
      nip,
      name: `PapaData Demo ${suffix}`,
      address: {
        street: `Demo Street ${(Number(suffix) % 50) + 1}`,
        postalCode: `00-${suffix.padStart(4, '0')}`,
        city,
      },
      regon: `REG${nip.slice(0, 9)}`,
      krs: `KRS${nip.slice(1, 10)}`,
      source: { gus: false, mf: true },
    };
  }
}
