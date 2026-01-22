import { IApiService } from './IApiService';
import { AppInfo, ApiError } from '../types/AppInfo';

/**
 * API service implementation using Fetch API.
 */
export class ApiService implements IApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async fetchAppInfo(url: string): Promise<AppInfo> {
    const response = await fetch(`${this.baseUrl}/app-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      throw new Error(errorData.error || 'Failed to fetch app info');
    }

    return data as AppInfo;
  }
}
