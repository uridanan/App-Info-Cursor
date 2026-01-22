import { AppInfo } from '../models/AppInfo';

/**
 * Interface for app store scrapers.
 * Implementations must handle fetching app information from specific stores.
 */
export interface IAppScraper {
  /**
   * Fetches app information from the given URL.
   * @param url - The app store URL
   * @returns Promise resolving to AppInfo
   */
  fetchAppInfo(url: string): Promise<AppInfo>;

  /**
   * Determines if this scraper can handle the given URL.
   * @param url - The URL to check
   * @returns true if this scraper can handle the URL
   */
  canHandle(url: string): boolean;
}
