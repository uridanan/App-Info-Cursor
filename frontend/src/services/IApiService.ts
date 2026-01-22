import { AppInfo } from '../types/AppInfo';

/**
 * Interface for API service.
 * Abstracts the HTTP client for fetching app information.
 */
export interface IApiService {
  /**
   * Fetches app information from the backend API.
   * @param url - The app store URL
   * @returns Promise resolving to AppInfo
   * @throws Error if the request fails
   */
  fetchAppInfo(url: string): Promise<AppInfo>;
}
