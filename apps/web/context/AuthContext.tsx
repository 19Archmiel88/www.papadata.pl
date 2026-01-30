import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import { safeLocalStorage } from '../utils/safeLocalStorage';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return safeLocalStorage.getItem('papadata_auth_token');
  });

  const [billingState, setBillingState] = useState<{
    plan?: string;
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
  } | null>(() => {
    try {
      const raw = safeLocalStorage.getItem('pd_billing_state');
      return raw
        ? (JSON.parse(raw) as {
            plan?: string;
            subscriptionStatus?: string;
            trialEndsAt?: string | null;
          })
        : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = safeLocalStorage.getItem('papadata_auth') === '1';
    return stored || Boolean(safeLocalStorage.getItem('papadata_auth_token'));
  });

  useEffect(() => {
    safeLocalStorage.setItem('papadata_auth', isAuthenticated ? '1' : '0');
    if (!isAuthenticated) {
      safeLocalStorage.removeItem('papadata_auth_token');
      safeLocalStorage.removeItem('papadata_user_id');
      safeLocalStorage.removeItem('papadata_user_roles');
      safeLocalStorage.removeItem('pd_billing_state');
      setToken(null);
      setBillingState(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (token) {
      safeLocalStorage.setItem('papadata_auth_token', token);
      if (!isAuthenticated) setIsAuthenticated(true);
    } else {
      safeLocalStorage.removeItem('papadata_auth_token');
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    try {
      if (billingState) {
        safeLocalStorage.setItem('pd_billing_state', JSON.stringify(billingState));
      } else {
        safeLocalStorage.removeItem('pd_billing_state');
      }
    } catch {
      // ignore
    }
  }, [billingState]);

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        billingState,
        setIsAuthenticated,
        setToken,
        setBillingState,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
