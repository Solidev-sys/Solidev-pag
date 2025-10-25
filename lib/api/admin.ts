import { BaseApiService } from './base';
import type { AdminPingResponse } from '@/types';

export class AdminApiService extends BaseApiService {
  // Planes (admin)
  async getPlans() {
    return this.request('/api/planes');
  }

  async getPlan(id: string | number) {
    return this.request(`/api/planes/${id}`);
  }

  async createPlan(data: Record<string, unknown>) {
    return this.request('/api/planes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlan(id: string | number, data: Record<string, unknown>) {
    return this.request(`/api/planes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlan(id: string | number) {
    return this.request(`/api/planes/${id}`, {
      method: 'DELETE',
    });
  }

  // Características de Plan (admin)
  async getFeaturesByPlan(planId: string | number) {
    return this.request(`/api/planes/${planId}/caracteristicas`);
  }

  async getFeature(id: string | number) {
    return this.request(`/api/caracteristicas/${id}`);
  }

  async createFeature(data: Record<string, unknown>) {
    return this.request('/api/caracteristicas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFeature(id: string | number, data: Record<string, unknown>) {
    return this.request(`/api/caracteristicas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFeature(id: string | number) {
    return this.request(`/api/caracteristicas/${id}`, {
      method: 'DELETE',
    });
  }

  // Páginas del sitio (admin)
  async getPages() {
    return this.request('/api/paginas');
  }

  async getPageBySlug(slug: string) {
    return this.request(`/api/paginas/${slug}`);
  }

  async createPage(data: Record<string, unknown>) {
    return this.request('/api/paginas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(id: string | number, data: Record<string, unknown>) {
    return this.request(`/api/paginas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string | number) {
    return this.request(`/api/paginas/${id}`, {
      method: 'DELETE',
    });
  }

  // Pagos (admin)
  async getPayments() {
    return this.request('/api/pagos');
  }

  async createPaymentManual(data: Record<string, unknown>) {
    return this.request('/api/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(id: string | number, data: Record<string, unknown>) {
    return this.request(`/api/pagos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getPaymentById(id: string | number) {
    return this.request(`/api/pagos/${id}`);
  }

  // Facturas (admin)
  async getInvoices() {
    return this.request('/api/facturas');
  }

  async getInvoiceById(id: string | number) {
    return this.request(`/api/facturas/${id}`);
  }

  async createInvoice(data: Record<string, unknown>) {
    return this.request('/api/facturas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notificaciones (admin)
  async getNotifications() {
    return this.request('/api/notificaciones');
  }

  async createNotification(data: Record<string, unknown>) {
    return this.request('/api/notificaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteNotification(id: string | number) {
    return this.request(`/api/notificaciones/${id}`, {
      method: 'DELETE',
    });
  }

  // Utilidades admin
  async adminPing(): Promise<AdminPingResponse> {
    return this.request('/api/admin/ping');
  }
}

export const adminApiService = new AdminApiService();