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
    rol?: string;
  }): Promise<RegisterResponse> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ ...userData, rol: userData.rol ?? 'cliente' }),
    });
  }

  async logout(): Promise<LogoutResponse> {
    return this.request('/api/logout', { method: 'POST' });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request('/api/users/me');
  }

  async changeEmail(payload: { currentPassword: string; newEmail: string }): Promise<{ message: string; user: import('@/types').ApiUser }> {
    return this.request('/api/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ current_password: payload.currentPassword, new_email: payload.newEmail }),
    });
  }

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return this.request('/api/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: payload.currentPassword, new_password: payload.newPassword }),
    });
  }
  
  async changePhone(newPhone: string): Promise<{ message: string }> {
    return this.request('/api/users/me/telefono', {
      method: 'PUT',
      body: JSON.stringify({ new_phone: newPhone }),
    });
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
  async createPayment(payload?: { items: Array<{ id: number|string; name: string; quantity: number; price: number; currency_id?: string }>; total: number }): Promise<PaymentResponse> {
    return this.request('/api/pago', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  }

  async createSubscription(planId: number): Promise<import('@/types/indexNew').BackendSuscripcion> {
    return this.request('/api/suscripciones', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId }),
    });
  }

  async startSubscription(suscripcionId: number, cardTokenId: string): Promise<{ preapproval_id: string }> {
    return this.request(`/api/suscripciones/${suscripcionId}/iniciar`, {
      method: 'POST',
      body: JSON.stringify({ card_token_id: cardTokenId }),
    });
  }

  async startSubscriptionCheckout(suscripcionId: number): Promise<{ preapproval_id: string; init_point: string | null; init_point_prod?: string | null; init_point_test?: string | null }> {
    return this.request(`/api/suscripciones/${suscripcionId}/iniciar`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async confirmSubscription(preapprovalId: string): Promise<{ ok: boolean; estado: string }> {
    return this.request(`/api/suscripcion-exitosa?preapproval_id=${encodeURIComponent(preapprovalId)}`);
  }

  // History methods
  async getHistory(): Promise<HistoryResponse> {
    return this.request('/api/historial');
  }

  // Nuevos métodos públicos: planes y páginas
  async getPlans(): Promise<import('@/types/indexNew').PlanesResponse> {
      return this.request('/api/planes');
  }
  
  async getPages(): Promise<import('@/types/indexNew').PaginasResponse> {
      return this.request('/api/paginas');
  }
  
  // Endpoint de verificación/health: devuelve { q: 'pex' }
  async getApiTest(): Promise<{ q: string }> {
      return this.request('/api/test');
  }
}
export const apiService = new ApiService();

// Re-export specialized services
export { adminApiService } from './admin';
export { historyApiService } from './history';
