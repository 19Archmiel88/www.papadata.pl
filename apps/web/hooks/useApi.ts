import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { configureApiRuntime, getApiClient, setApiTelemetryContext } from '../data/api';
import { getWebConfig } from '../config';
import { useAuth } from '../context/useAuth';
import { useModal } from '../context/useModal';

type TelemetryMode = 'demo' | 'prod' | 'stg' | string;

const getRuntimeMode = (): TelemetryMode => {
  if (typeof window === 'undefined') return 'demo';
  return new URLSearchParams(window.location.search).get('mode') ?? 'demo';
};

export const useApi = () => {
  const { token, logout } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const env = getWebConfig().env;
  const mode = getRuntimeMode();

  useEffect(() => {
    configureApiRuntime({
      getToken: () => token ?? null,
      onUnauthorized: () => {
        logout();
        navigate('/');
        openModal('auth', { isRegistered: true });
      },
    });
  }, [token, logout, navigate, openModal]);

  useEffect(() => {
    setApiTelemetryContext({ env, mode });
    return () => setApiTelemetryContext(null);
  }, [env, mode]);

  return useMemo(() => getApiClient(), []);
};
