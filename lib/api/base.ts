// Forzando la URL del backend para evitar problemas de conexión
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
console.log('API URL:', API_BASE_URL);

export class BaseApiService {
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const bodyPreview = typeof (options as any).body === 'string' ? (options as any).body : (options as any).body ? JSON.stringify((options as any).body) : undefined;
    console.log('[API] request', { url, method, body: bodyPreview });

    // Configuración mejorada para evitar problemas de CORS
    const config: RequestInit = {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const status = response.status;
      const ok = response.ok;
      if (!ok) {
        let errorData: any = null;
        try { errorData = await response.json(); } catch {}
        const message = (errorData && (errorData.message || errorData.error)) || `Error ${response.status}`;
        const err: any = new Error(message);
        if (errorData && errorData.error_code) err.code = errorData.error_code;
        err.status = status;
        console.error('[API] error', { url, method, status, error: errorData || message });
        throw err;
      }
      const data = await response.json();
      console.log('[API] response', { url, method, status, data });
      return data as T;
    } catch (error) {
      console.error('[API] exception', { url, method, error: (error as any)?.message || String(error) });
      throw error;
    }
  }
}
