import { BaseApiService } from './base';
import type { 
  DiscountsResponse, 
  DiscountActionResponse, 
  DiscountFormData, 
  AdminPingResponse,
  CategoriesResponse,
  ProductFormData,
  ProductActionResponse,
  AdminOrdersResponse,
  OrderStatusUpdateResponse,
  SimpleProduct
} from '@/types';

export class AdminApiService extends BaseApiService {
  // Discount management
  async getDiscounts(): Promise<DiscountsResponse> {
    return this.request('/api/descuentos');
  }

  async createDiscount(discountData: DiscountFormData): Promise<DiscountActionResponse> {
    return this.request('/api/descuentos', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
  }

  async updateDiscount(id: string, discountData: DiscountFormData): Promise<DiscountActionResponse> {
    return this.request(`/api/descuentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(discountData),
    });
  }

  async deleteDiscount(id: string): Promise<DiscountActionResponse> {
    try {
      const response = await this.request<DiscountActionResponse>(`/api/descuentos/${id}`, {
        method: 'DELETE',
      });
      
      // Verificar que la respuesta sea exitosa
      if (!response || typeof response !== 'object') {
        throw new Error('Respuesta inválida del servidor');
      }
      
      return response;
    } catch (error) {
      console.error('Error en deleteDiscount:', error);
      
      // Re-lanzar el error con un mensaje más específico
      if (error instanceof Error) {
        throw new Error(`Error al eliminar descuento: ${error.message}`);
      }
      
      throw new Error('Error desconocido al eliminar descuento');
    }
  }

  // Product management
  async getProducts() {
    return this.request('/api/Productos');
  }

  async getProduct(id: string | number) {
    return this.request(`/api/Productos/${id}`);
  }

  async getProductsForSelect(): Promise<SimpleProduct[]> {
    try {
      const products = await this.request<any[]>('/api/Productos');
      return products.map((p: any) => ({ 
        id: String(p.id || ''), 
        name: p.nombre || p.name || 'Sin nombre'
      }));
    } catch (error) {
      console.error('Error al obtener productos para select:', error);
      return [];
    }
  }

  async createProduct(productData: ProductFormData): Promise<ProductActionResponse> {
    return this.request('/api/Productos', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: ProductFormData): Promise<ProductActionResponse> {
    return this.request(`/api/Productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ProductActionResponse> {
    return this.request(`/api/Productos/${id}`, {
      method: 'DELETE',
    });
  }

  async getProductCategories(id: string | number) {
    return this.request(`/api/Productos/${id}/categorias`);
  }

  // Category management
  async getCategories(): Promise<CategoriesResponse> {
    return this.request('/api/admin/categorias');
  }

  async getCategory(id: string | number) {
    return this.request(`/api/admin/categorias/${id}`);
  }

  async createCategory(categoryData: { nombre: string }) {
    return this.request('/api/admin/categorias', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string | number, categoryData: { nombre: string }) {
    return this.request(`/api/admin/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string | number) {
    return this.request(`/api/admin/categorias/${id}`, {
      method: 'DELETE',
    });
  }

  // Order management
  async getOrders(): Promise<AdminOrdersResponse> {
    return this.request('/api/historial/admin');
  }

  async updateOrderStatus(orderId: string, status: string): Promise<OrderStatusUpdateResponse> {
    return this.request(`/api/historial/${orderId}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: status }),
    });
  }

  // Admin utilities
  async adminPing(): Promise<AdminPingResponse> {
    return this.request('/api/admin/ping');
  }
}

export const adminApiService = new AdminApiService();