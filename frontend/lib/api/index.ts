import { BaseApiService } from './base';
import type { 
  LoginResponse, 
  RegisterResponse, 
  UserResponse, 
  LogoutResponse, 
  CartResponse, 
  CartActionResponse,
  HistoryResponse,
  PaymentResponse
} from '@/types';

export class ApiService extends BaseApiService {
  // Product methods (public facing)
  async getProducts() {
    return this.request('/api/Productos');
  }

  async getProduct(id: string | number) {
    return this.request(`/api/Productos/${id}`);
  }

  async getCategories() {
    return this.request('/api/categorias');
  }

  // Authentication - Fixed routes to match backend
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    return this.request('/api/login', {
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
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<LogoutResponse> {
    return this.request('/api/logout', { method: 'POST' });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request('/api/users/me');
  }

  // Cart management - Fixed routes to match backend
  async getCart(): Promise<CartResponse> {
    return this.request('/api/carrito');
  }

  async addToCart(productId: number, quantity: number): Promise<CartActionResponse> {
    return this.request('/api/carrito', {
      method: 'POST',
      body: JSON.stringify({ producto_id: productId, cantidad: quantity }),
    });
  }

  async updateCartItem(productId: number, quantity: number): Promise<CartActionResponse> {
    return this.request('/api/carrito', {
      method: 'PUT',
      body: JSON.stringify({ producto_id: productId, cantidad: quantity }),
    });
  }

  async removeFromCart(productId: number): Promise<CartActionResponse> {
    return this.request('/api/carrito', {
      method: 'DELETE',
      body: JSON.stringify({ producto_id: productId }),
    });
  }

  async clearCart(): Promise<CartActionResponse> {
    return this.request('/api/carrito/clear', {
      method: 'DELETE',
    });
  }

  // Payment methods
  async createPayment(): Promise<PaymentResponse> {
    return this.request('/api/pago', {
      method: 'POST',
    });
  }

  // History methods
  async getHistory(): Promise<HistoryResponse> {
    return this.request('/api/historial');
  }
}
export const apiService = new ApiService();

// Re-export specialized services
export { adminApiService } from './admin';
export { historyApiService } from './history';