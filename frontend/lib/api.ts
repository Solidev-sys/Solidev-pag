import type { LoginResponse, RegisterResponse, UserResponse, LogoutResponse, CartResponse, CartActionResponse, HistoryResponse, DiscountsResponse, DiscountActionResponse, DiscountFormData, AdminPingResponse, PaymentResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autenticado');
        }
        
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión');
    }
  }

  async getProducts() {
    return this.request('/api/Productos');
  }

  async getProduct(id: string | number) {
    return this.request(`/api/Productos/${id}`);
  }

  async getCategories() {
    return this.request('/api/categorias');
  }

  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    username: string;
    nombreCompleto: string;
    email: string;
    password: string;
    rut: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    region: string;
  }): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<LogoutResponse> {
    return this.request<LogoutResponse>('/api/logout', { method: 'POST' });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/users/me');
  }

  // Cart methods
  async getCart(): Promise<CartResponse> {
    return this.request<CartResponse>('/api/carrito');
  }

  async addToCart(productId: number, quantity: number): Promise<CartActionResponse> {
    return this.request<CartActionResponse>('/api/carrito', {
      method: 'POST',
      body: JSON.stringify({ producto_id: productId, cantidad: quantity }),
    });
  }

  async updateCartItem(productId: number, quantity: number): Promise<CartActionResponse> {
    return this.request<CartActionResponse>('/api/carrito', {
      method: 'PUT',
      body: JSON.stringify({ producto_id: productId, cantidad: quantity }),
    });
  }

  async removeFromCart(productId: number): Promise<CartActionResponse> {
    return this.request<CartActionResponse>('/api/carrito', {
      method: 'DELETE',
      body: JSON.stringify({ producto_id: productId }),
    });
  }

  async clearCart(): Promise<CartActionResponse> {
    return this.request<CartActionResponse>('/api/carrito/clear', {
      method: 'DELETE',
    });
  }

  // History methods
  async getHistory(): Promise<HistoryResponse> {
    return this.request<HistoryResponse>('/api/historial');
  }

  // Discount methods
  async getDiscounts(): Promise<DiscountsResponse> {
    return this.request<DiscountsResponse>('/api/descuentos');
  }

  async createDiscount(discountData: DiscountFormData): Promise<DiscountActionResponse> {
    return this.request<DiscountActionResponse>('/api/descuentos', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
  }

  async updateDiscount(id: string, discountData: DiscountFormData): Promise<DiscountActionResponse> {
    return this.request<DiscountActionResponse>(`/api/descuentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(discountData),
    });
  }

  async deleteDiscount(id: string): Promise<DiscountActionResponse> {
    return this.request<DiscountActionResponse>(`/api/descuentos/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment methods
  async createPayment(): Promise<PaymentResponse> {
    return this.request<PaymentResponse>('/api/pago', {
      method: 'POST',
    });
  }

  // Admin methods
  async adminPing(): Promise<AdminPingResponse> {
    return this.request<AdminPingResponse>('/api/admin/ping');
  }
}


export { apiService } from './api/index';
export { adminApiService } from './api/admin';
export { historyApiService } from './api/history';

// Re-export types for convenience
export type * from '@/types';
