import axios from 'axios';
import { IAppScraper } from './IAppScraper';
import { AppInfo } from '../models/AppInfo';
import { DeveloperInfo } from '../models/DeveloperInfo';

/**
 * Scraper for Apple App Store.
 * Uses iTunes Lookup API to fetch app information.
 */
export class AppleAppStoreScraper implements IAppScraper {
  private static readonly APPLE_URL_PATTERNS = [
    /apps\.apple\.com/,
    /itunes\.apple\.com/,
  ];

  private static readonly ITUNES_API_URL = 'https://itunes.apple.com/lookup';

  async fetchAppInfo(url: string): Promise<AppInfo> {
    const appId = this.extractAppId(url);
    if (!appId) {
      throw new Error('Invalid Apple App Store URL: could not extract app ID');
    }

    const response = await axios.get(`${AppleAppStoreScraper.ITUNES_API_URL}?id=${appId}`);
    const data = response.data;

    if (!data.resultCount || data.resultCount === 0 || !data.results || data.results.length === 0) {
      throw new Error('App not found');
    }

    const app = data.results[0];

    const developer = new DeveloperInfo(
      app.sellerName || app.artistName || 'Unknown',
      null, // Apple API doesn't provide developer email
      app.sellerUrl || null
    );

    return new AppInfo(
      app.trackName,
      app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60,
      app.bundleId,
      app.description,
      developer
    );
  }

  canHandle(url: string): boolean {
    for (const pattern of AppleAppStoreScraper.APPLE_URL_PATTERNS) {
      if (pattern.test(url)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Extracts the app ID from an Apple App Store URL.
   * @param url - The App Store URL
   * @returns The app ID or null if not found
   */
  protected extractAppId(url: string): string | null {
    // Match patterns like /id123456789 or ?id=123456789
    const idMatch = url.match(/\/id(\d+)/i) || url.match(/[?&]id=(\d+)/i);
    return idMatch ? idMatch[1] : null;
  }
}
