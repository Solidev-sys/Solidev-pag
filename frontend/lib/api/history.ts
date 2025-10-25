import { BaseApiService } from './base';
import type { HistoryResponse } from '@/types';

export class HistoryApiService extends BaseApiService {
  async getHistory() {
    // Admin: historial como lista de pagos
    return this.request('/api/pagos');
  }
}

export const historyApiService = new HistoryApiService();