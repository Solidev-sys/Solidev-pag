// Forzando la URL del backend para evitar problemas de conexión
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
console.log('API URL:', API_BASE_URL);

function redactBodyPreview(bodyPreview: string | undefined) {
  if (!bodyPreview) return bodyPreview;
  const s = bodyPreview.length > 5000 ? `${bodyPreview.slice(0, 5000)}…` : bodyPreview;
  try {
    const obj = JSON.parse(s);
    if (obj && typeof obj === 'object') {
      const clone: any = Array.isArray(obj) ? [...obj] : { ...obj };
      const keysToRedact = new Set([
        'card_token_id',
        'token',
        'securityCode',
        'cvv',
        'cvc',
        'password',
      ]);
      for (const k of Object.keys(clone)) {
        if (keysToRedact.has(k)) clone[k] = '[REDACTED]';
      }
      return JSON.stringify(clone);
    }
  } catch {}
  return s;
}

export class BaseApiService {
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const bodyPreview = typeof (options as any).body === 'string' ? (options as any).body : (options as any).body ? JSON.stringify((options as any).body) : undefined;
    console.log('[API] request', { url, method, body: redactBodyPreview(bodyPreview) });

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
        let rawText: string | null = null;
        try {
          rawText = await response.text();
          if (rawText) {
            try { errorData = JSON.parse(rawText); } catch {}
          }
        } catch {}
        const message =
          (errorData && (errorData.message || errorData.error)) ||
          (rawText && rawText.trim().length > 0 ? rawText : null) ||
          `Error ${response.status}`;
        const err: any = new Error(message);
        if (errorData && errorData.error_code) err.code = errorData.error_code;
        err.status = status;
        console.error('[API] error', { url, method, status, error: errorData || rawText || message });
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
