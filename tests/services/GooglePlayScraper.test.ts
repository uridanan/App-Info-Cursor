import { GooglePlayScraper } from '../../src/services/GooglePlayScraper';
import { AppInfo } from '../../src/models/AppInfo';
import gplay from 'google-play-scraper';

jest.mock('google-play-scraper');
const mockedGplay = gplay as jest.Mocked<typeof gplay>;

describe('GooglePlayScraper', () => {
  let scraper: GooglePlayScraper;

  beforeEach(() => {
    scraper = new GooglePlayScraper();
    jest.clearAllMocks();
  });

  describe('canHandle', () => {
    it('should return true for play.google.com URLs', () => {
      const url = 'https://play.google.com/store/apps/details?id=com.example.app';
      expect(scraper.canHandle(url)).toBe(true);
    });

    it('should return false for Apple App Store URLs', () => {
      const url = 'https://apps.apple.com/us/app/example-app/id123456789';
      expect(scraper.canHandle(url)).toBe(false);
    });

    it('should return false for random URLs', () => {
      const url = 'https://example.com/some-page';
      expect(scraper.canHandle(url)).toBe(false);
    });
  });

  describe('fetchAppInfo', () => {
    const mockGooglePlayResponse = {
      title: 'Test Android App',
      icon: 'https://example.com/android-icon.png',
      appId: 'com.test.androidapp',
      description: 'An Android test application',
      developer: 'Android Test Developer',
      developerEmail: 'dev@androidtest.com',
      developerWebsite: 'https://androidtest.com',
    };

    it('should fetch app info from valid Google Play URL', async () => {
      mockedGplay.app.mockResolvedValueOnce(mockGooglePlayResponse as any);

      const url = 'https://play.google.com/store/apps/details?id=com.test.androidapp';
      const result = await scraper.fetchAppInfo(url);

      expect(result).toBeInstanceOf(AppInfo);
      expect(result.appName).toBe('Test Android App');
      expect(result.bundleId).toBe('com.test.androidapp');
      expect(result.iconUrl).toBe('https://example.com/android-icon.png');
      expect(result.description).toBe('An Android test application');
      expect(result.developer.name).toBe('Android Test Developer');
      expect(result.developer.email).toBe('dev@androidtest.com');
      expect(result.developer.website).toBe('https://androidtest.com');
    });

    it('should throw error for invalid Google Play URL', async () => {
      const url = 'https://play.google.com/invalid-url';

      await expect(scraper.fetchAppInfo(url)).rejects.toThrow();
    });

    it('should throw error when app not found', async () => {
      mockedGplay.app.mockRejectedValueOnce(new Error('App not found'));

      const url = 'https://play.google.com/store/apps/details?id=com.nonexistent.app';

      await expect(scraper.fetchAppInfo(url)).rejects.toThrow();
    });

    it('should handle missing developer email gracefully', async () => {
      mockedGplay.app.mockResolvedValueOnce({
        ...mockGooglePlayResponse,
        developerEmail: undefined,
      } as any);

      const url = 'https://play.google.com/store/apps/details?id=com.test.androidapp';
      const result = await scraper.fetchAppInfo(url);

      expect(result.developer.email).toBeNull();
    });

    it('should handle missing developer website gracefully', async () => {
      mockedGplay.app.mockResolvedValueOnce({
        ...mockGooglePlayResponse,
        developerWebsite: undefined,
      } as any);

      const url = 'https://play.google.com/store/apps/details?id=com.test.androidapp';
      const result = await scraper.fetchAppInfo(url);

      expect(result.developer.website).toBeNull();
    });

    it('should extract app ID from URL query parameter', async () => {
      mockedGplay.app.mockResolvedValueOnce(mockGooglePlayResponse as any);

      const url = 'https://play.google.com/store/apps/details?id=com.test.androidapp&hl=en';
      await scraper.fetchAppInfo(url);

      expect(mockedGplay.app).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'com.test.androidapp' })
      );
    });
  });
});
