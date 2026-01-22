import { AppScraperFactory } from '../../src/services/AppScraperFactory';
import { AppleAppStoreScraper } from '../../src/services/AppleAppStoreScraper';
import { GooglePlayScraper } from '../../src/services/GooglePlayScraper';

describe('AppScraperFactory', () => {
  let factory: AppScraperFactory;

  beforeEach(() => {
    factory = new AppScraperFactory();
  });

  describe('getScraper', () => {
    it('should return AppleAppStoreScraper for Apple URLs', () => {
      const url = 'https://apps.apple.com/us/app/example-app/id123456789';
      const scraper = factory.getScraper(url);

      expect(scraper).toBeInstanceOf(AppleAppStoreScraper);
    });

    it('should return GooglePlayScraper for Google Play URLs', () => {
      const url = 'https://play.google.com/store/apps/details?id=com.example.app';
      const scraper = factory.getScraper(url);

      expect(scraper).toBeInstanceOf(GooglePlayScraper);
    });

    it('should throw error for unsupported URLs', () => {
      const url = 'https://example.com/some-page';

      expect(() => factory.getScraper(url)).toThrow('No scraper available for URL');
    });
  });

  describe('canHandle', () => {
    it('should return true for Apple URLs', () => {
      const url = 'https://apps.apple.com/us/app/example-app/id123456789';
      expect(factory.canHandle(url)).toBe(true);
    });

    it('should return true for Google Play URLs', () => {
      const url = 'https://play.google.com/store/apps/details?id=com.example.app';
      expect(factory.canHandle(url)).toBe(true);
    });

    it('should return false for unsupported URLs', () => {
      const url = 'https://example.com/some-page';
      expect(factory.canHandle(url)).toBe(false);
    });
  });
});
