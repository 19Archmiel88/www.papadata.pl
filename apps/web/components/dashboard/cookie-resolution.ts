import { safeLocalStorage } from '../../utils/safeLocalStorage';

export const COOKIE_ACK_KEY = 'cookie_consent_ack';

export const persistCookieAck = (timestamp: number = Date.now()): number => {
  try {
    safeLocalStorage.setItem(COOKIE_ACK_KEY, String(timestamp));
  } catch {
    // storage may be unavailable; swallow to keep fail-closed
  }
  return timestamp;
};
