import { AppleAppStoreScraper } from '../../src/services/AppleAppStoreScraper';
import { AppInfo } from '../../src/models/AppInfo';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppleAppStoreScraper', () => {
  let scraper: AppleAppStoreScraper;

  beforeEach(() => {
    scraper = new AppleAppStoreScraper();
    jest.clearAllMocks();
  });

  describe('canHandle', () => {
    it('should return true for apps.apple.com URLs', () => {
      const url = 'https://apps.apple.com/us/app/example-app/id123456789';
      expect(scraper.canHandle(url)).toBe(true);
    });

    it('should return true for itunes.apple.com URLs', () => {
      const url = 'https://itunes.apple.com/us/app/example-app/id123456789';
      expect(scraper.canHandle(url)).toBe(true);
    });

    it('should return false for Google Play URLs', () => {
      const url = 'https://play.google.com/store/apps/details?id=com.example.app';
      expect(scraper.canHandle(url)).toBe(false);
    });

    it('should return false for random URLs', () => {
      const url = 'https://example.com/some-page';
      expect(scraper.canHandle(url)).toBe(false);
    });
  });

  describe('fetchAppInfo', () => {
    const mockAppleApiResponse = {
      data: {
        resultCount: 1,
        results: [{
          trackName: 'Test App',
          artworkUrl512: 'https://example.com/icon.png',
          bundleId: 'com.test.app',
          description: 'A test application',
          sellerName: 'Test Developer',
          sellerUrl: 'https://testdeveloper.com',
        }],
      },
    };

    it('should fetch app info from valid Apple URL', async () => {
      mockedAxios.get.mockResolvedValueOnce(mockAppleApiResponse);

      const url = 'https://apps.apple.com/us/app/test-app/id123456789';
      const result = await scraper.fetchAppInfo(url);

      expect(result).toBeInstanceOf(AppInfo);
      expect(result.appName).toBe('Test App');
      expect(result.bundleId).toBe('com.test.app');
      expect(result.iconUrl).toBe('https://example.com/icon.png');
      expect(result.description).toBe('A test application');
      expect(result.developer.name).toBe('Test Developer');
    });

    it('should throw error for invalid Apple URL', async () => {
      const url = 'https://apps.apple.com/invalid-url';

      await expect(scraper.fetchAppInfo(url)).rejects.toThrow();
    });

    it('should throw error when app not found', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { resultCount: 0, results: [] },
      });

      const url = 'https://apps.apple.com/us/app/test-app/id999999999';

      await expect(scraper.fetchAppInfo(url)).rejects.toThrow('App not found');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const url = 'https://apps.apple.com/us/app/test-app/id123456789';

      await expect(scraper.fetchAppInfo(url)).rejects.toThrow();
    });

    it('should extract app ID from various Apple URL formats', async () => {
      mockedAxios.get.mockResolvedValue(mockAppleApiResponse);

      const urls = [
        'https://apps.apple.com/us/app/test-app/id123456789',
        'https://apps.apple.com/app/id123456789',
        'https://itunes.apple.com/us/app/test-app/id123456789',
      ];

      for (const url of urls) {
        await scraper.fetchAppInfo(url);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('123456789')
        );
      }
    });
  });
});
