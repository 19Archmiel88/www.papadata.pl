export interface AuthMagicLinkRequest {
  email: string;
}

export interface AuthMagicLinkResponse {
  ok: true;
  requestId: string;
}

export interface AuthLoginRequest {
  email: string;
  code?: string;
  password?: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  nip: string;
  companyName: string;
  companyAddress: string;
}

export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
  roles: string[];
}

export interface AuthSession {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
}

export type AuthLoginResponse = AuthSession;
export type AuthRegisterResponse = AuthSession;
