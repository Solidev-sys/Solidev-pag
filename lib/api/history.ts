import { BaseApiService } from './base';
import type { HistoryResponse } from '@/types';

export class HistoryApiService extends BaseApiService {
  async getHistory(): Promise<HistoryResponse> {
    return this.request('/api/historial');
  }
}

export const historyApiService = new HistoryApiService();