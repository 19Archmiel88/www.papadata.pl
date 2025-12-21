import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthCredentials, AuthSignupPayload, AuthState } from '../types/auth';

const STORAGE_KEY = 'pd_auth';

const randomDelay = () => 600 + Math.random() * 600;

const persistAuth = (value: AuthState | null) => {
  try {
    if (value === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
  } catch {
    // ignore storage errors
  }
};

const readAuth = (): AuthState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as AuthState;
    if (parsed?.isAuthed && parsed?.email && parsed?.name) return parsed;
    return null;
  } catch {
    return null;
  }
};

const formatNameFromEmail = (email: string) => {
  const local = email.split('@')[0];
  return local
    ? local
        .split('.')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')
    : 'Demo User';
};

type AuthContextValue = {
  user: AuthState | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthState>;
  signup: (payload: AuthSignupPayload) => Promise<AuthState>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthState | null>(() => readAuth());

  const login = useCallback(async ({ email }: AuthCredentials) => {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    const normalizedEmail = email.trim().toLowerCase();
    const next: AuthState = {
      isAuthed: true,
      email: normalizedEmail,
      name: formatNameFromEmail(normalizedEmail),
      orgName: 'Demo Team',
    };
    persistAuth(next);
    setUser(next);
    return next;
  }, []);

  const signup = useCallback(async (payload: AuthSignupPayload) => {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    const next: AuthState = {
      isAuthed: true,
      email: payload.email.trim().toLowerCase(),
      name: payload.name.trim(),
      orgName: payload.orgName.trim() || 'PapaData',
    };
    persistAuth(next);
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    persistAuth(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.isAuthed),
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
