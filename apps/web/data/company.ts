import type { CompanyLookupResponse } from '@papadata/shared';
import { apiGet } from './api';

export type CompanyLookupError = {
  message: string;
  requestId?: string;
};

export const lookupCompanyByNip = async (
  nip: string,
  options?: { signal?: AbortSignal },
): Promise<CompanyLookupResponse> => {
  const normalized = nip.trim();
  return apiGet<CompanyLookupResponse>(`/public/company?nip=${encodeURIComponent(normalized)}`, {
    signal: options?.signal,
  });
};
