import { IAppScraper } from './IAppScraper';
import { AppleAppStoreScraper } from './AppleAppStoreScraper';
import { GooglePlayScraper } from './GooglePlayScraper';

/**
 * Factory class for creating appropriate app scrapers based on URL.
 * Implements the Factory pattern for scraper selection.
 */
export class AppScraperFactory {
  private readonly scrapers: IAppScraper[];

  constructor() {
    this.scrapers = [
      new AppleAppStoreScraper(),
      new GooglePlayScraper(),
    ];
  }

  /**
   * Returns the appropriate scraper for the given URL.
   * @param url - The app store URL
   * @returns The matching scraper
   * @throws Error if no scraper can handle the URL
   */
  getScraper(url: string): IAppScraper {
    for (const scraper of this.scrapers) {
      if (scraper.canHandle(url)) {
        return scraper;
      }
    }
    throw new Error('No scraper available for URL');
  }

  /**
   * Checks if any registered scraper can handle the given URL.
   * @param url - The URL to check
   * @returns true if a scraper exists for the URL
   */
  canHandle(url: string): boolean {
    return this.scrapers.some(scraper => scraper.canHandle(url));
  }
}
