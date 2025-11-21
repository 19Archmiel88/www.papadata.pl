/**
 * Simple client‑side helpers to obfuscate personally identifiable information
 * when rendering previews in the UI. This is purely for display purposes;
 * true anonymisation happens on the backend/ETL.
 */

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  const visible = user.slice(0, 2);
  return `${visible}***@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/.(?=.{2})/g, '*');
}

export function maskIp(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return '***.***.***.***';
  return `${parts[0]}.***.***.${parts[3]}`;
}