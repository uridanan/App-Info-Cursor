import gplay from 'google-play-scraper';
import { IAppScraper } from './IAppScraper';
import { AppInfo } from '../models/AppInfo';
import { DeveloperInfo } from '../models/DeveloperInfo';

/**
 * Scraper for Google Play Store.
 * Uses google-play-scraper package to fetch app information.
 */
export class GooglePlayScraper implements IAppScraper {
  private static readonly GOOGLE_PLAY_PATTERN = /play\.google\.com/;

  async fetchAppInfo(url: string): Promise<AppInfo> {
    const appId = this.extractAppId(url);
    if (!appId) {
      throw new Error('Invalid Google Play URL: could not extract app ID');
    }

    const app = await gplay.app({ appId });

    const developer = new DeveloperInfo(
      app.developer || 'Unknown',
      app.developerEmail || null,
      app.developerWebsite || null
    );

    return new AppInfo(
      app.title,
      app.icon,
      app.appId,
      app.description,
      developer
    );
  }

  canHandle(url: string): boolean {
    return GooglePlayScraper.GOOGLE_PLAY_PATTERN.test(url);
  }

  /**
   * Extracts the app ID (package name) from a Google Play URL.
   * @param url - The Google Play URL
   * @returns The app ID or null if not found
   */
  protected extractAppId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('id');
    } catch {
      return null;
    }
  }
}
