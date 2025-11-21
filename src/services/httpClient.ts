import ky from 'ky';

/**
 * Centralised HTTP client for all backend API calls. The client uses the ky
 * library for concise, promise‑based requests and installs a set of
 * interceptors to automatically include credentials and common headers.
 *
 * - The `credentials: 'include'` option ensures cookies (e.g. auth tokens)
 *   are sent with every request.
 * - The `X-Client-Id` header can be set from local storage to identify the
 *   tenant to the backend. If no client ID has been set yet the header will
 *   be omitted.
 * - The base URL comes from the Vite environment (VITE_API_BASE_URL). In
 *   development you can configure a proxy in vite.config.ts to forward to
 *   your BFF.
 */
const httpClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL || '',
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        const clientId = window.localStorage.getItem('clientId');
        if (clientId) {
          request.headers.set('X-Client-Id', clientId);
        }
      }
    ],
    afterResponse: [
      (_request, _options, response) => {
        // Example global error handling; real implementation could refresh
        // expired sessions or redirect to login on 401.
        if (response.status === 401 || response.status === 403) {
          console.warn('Unauthorized. Consider redirecting to login.');
        }
      }
    ]
  }
});

export default httpClient;