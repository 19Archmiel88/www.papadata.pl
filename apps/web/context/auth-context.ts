import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  billingState: {
    plan?: string;
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
  } | null;
  setIsAuthenticated: (val: boolean) => void;
  setToken: (token: string | null) => void;
  setBillingState: (
    state: { plan?: string; subscriptionStatus?: string; trialEndsAt?: string | null } | null
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
