// Forzando la URL del backend para evitar problemas de conexión
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
console.log('API URL:', API_BASE_URL);

export class BaseApiService {
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Realizando petición a:', url);
    
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
      if (!response.ok) {
        let errorData: any = null;
        try { errorData = await response.json(); } catch {}
        const message = (errorData && (errorData.message || errorData.error)) || `Error ${response.status}`;
        const err: any = new Error(message);
        if (errorData && errorData.error_code) err.code = errorData.error_code;
        err.status = response.status;
        throw err;
      }
      const data = await response.json();
      return data as T;
    } catch (error) {
      throw error;
    }
  }
}
