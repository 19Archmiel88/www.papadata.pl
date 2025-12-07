// services/api.ts

const BASE_URL = process.env.BACKEND_URL;

/**
 * Uniwersalna funkcja do wysyłania zapytań
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (!BASE_URL) {
    const errorMsg = "⚠️ Brak BACKEND_URL. Sprawdź plik .env.local";
    console.error(errorMsg);
    throw new Error(errorMsg);
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