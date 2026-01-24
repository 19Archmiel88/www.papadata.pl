/**
 * apps/web/context/AuthContext.tsx
 *
 * UWAGA: to jest prosty "client-side flag" (placeholder), NIE realne bezpieczeństwo.
 * Docelowo: prawdziwe auth + sesja (najlepiej cookies httpOnly + backend validation).
 */

import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('papadata_auth_token');
  });

  const [billingState, setBillingState] = useState<{
    plan?: string;
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
  } | null>(() => {
    try {
      const raw = localStorage.getItem('pd_billing_state');
      return raw ? (JSON.parse(raw) as { plan?: string; subscriptionStatus?: string; trialEndsAt?: string | null }) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('papadata_auth') === '1';
    return stored || Boolean(localStorage.getItem('papadata_auth_token'));
  });

  useEffect(() => {
    localStorage.setItem('papadata_auth', isAuthenticated ? '1' : '0');
    if (!isAuthenticated) {
      localStorage.removeItem('papadata_auth_token');
      localStorage.removeItem('papadata_user_id');
      localStorage.removeItem('papadata_user_roles');
      localStorage.removeItem('pd_billing_state');
      setToken(null);
      setBillingState(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('papadata_auth_token', token);
      if (!isAuthenticated) setIsAuthenticated(true);
    } else {
      localStorage.removeItem('papadata_auth_token');
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    try {
      if (billingState) {
        localStorage.setItem('pd_billing_state', JSON.stringify(billingState));
      } else {
        localStorage.removeItem('pd_billing_state');
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
    <AuthContext.Provider value={{ isAuthenticated, token, billingState, setIsAuthenticated, setToken, setBillingState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
