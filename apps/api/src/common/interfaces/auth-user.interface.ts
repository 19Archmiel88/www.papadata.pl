export interface AuthUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  tenantId: string;
  roles?: string[];
  role?: string;
}
