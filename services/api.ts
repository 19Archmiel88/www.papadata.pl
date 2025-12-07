// services/api.ts

// services/api.ts

// Zmiana z process.env na import.meta.env dla Vite
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Uniwersalna funkcja do wysyłania zapytań
 */
// ... reszta kodu bez zmian ...
/**
 * Uniwersalna funkcja do wysyłania zapytań
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (!BASE_URL) {
    console.error("⚠️ Brak BACKEND_URL. Sprawdź plik .env.local");
    return null;
  }

  // Normalizacja adresu (żeby nie było podwójnych slashy //)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Błąd połączenia z ${url}:`, error);
    throw error;
  }
}

// --- TUTAJ DEFINIUJEMY FUNKCJE TWOJEJ APLIKACJI ---

/**
 * Sprawdza, czy backend w chmurze działa poprawnie.
 * Używa endpointu: GET /health
 */
export const checkHealth = async () => {
  return apiRequest('/health');
};

/**
 * Weryfikuje i zapisuje klucze integracji dla danego klienta.
 * Używa endpointu: POST /api/integrations/{tenant_slug}/verify
 */
export const verifyIntegration = async (tenantSlug: string, keys: Record<string, string>) => {
  return apiRequest(`/api/integrations/${tenantSlug}/verify`, {
    method: 'POST',
    body: JSON.stringify(keys),
  });
};
// services/api.ts (dodaj na końcu pliku)

export interface RegistrationData {
  email: string;
  company_name: string;
  nip: string;
  address: string;
  industry: string;
  currency: string;
  timezone: string;
  integrations: string[];
  marketing_consent: boolean;
}

/**
 * Rejestruje nowego klienta w systemie.
 * Endpoint: POST /api/register (Ten endpoint musimy potem utworzyć w Pythonie!)
 */
export const registerTenant = async (data: RegistrationData) => {
  return apiRequest('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};