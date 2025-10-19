// Forzando la URL del backend para evitar problemas de conexión
const API_BASE_URL = 'http://localhost:3002';
// Verificar en consola la URL que se está utilizando
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
      console.log('Enviando petición con config:', JSON.stringify(config));
      const response = await fetch(url, config);
      console.log('Respuesta recibida:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Error de autenticación');
          throw new Error('No autenticado');
        }
        
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          
          // Log adicional para debugging
          console.error('Error del servidor:', {
            status: response.status,
            url,
            method: options.method || 'GET',
            errorData
          });
          
        } catch (parseError) {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
          console.error('Error al parsear respuesta del servidor:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      return data;
    } catch (error) {
      console.error('Error en la petición:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión');
    }
  }
}