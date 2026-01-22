import { UrlParser, AppStoreType } from '../../src/utils/UrlParser';

describe('UrlParser', () => {
  describe('getStoreType', () => {
    it('should return APPLE for apps.apple.com URLs', () => {
      const url = 'https://apps.apple.com/us/app/example-app/id123456789';
      expect(UrlParser.getStoreType(url)).toBe(AppStoreType.APPLE);
    });

    it('should return APPLE for itunes.apple.com URLs', () => {
      const url = 'https://itunes.apple.com/us/app/example-app/id123456789';
      expect(UrlParser.getStoreType(url)).toBe(AppStoreType.APPLE);
    });

    it('should return GOOGLE for play.google.com URLs', () => {
      const url = 'https://play.google.com/store/apps/details?id=com.example.app';
      expect(UrlParser.getStoreType(url)).toBe(AppStoreType.GOOGLE);
    });

    it('should return UNKNOWN for unsupported URLs', () => {
      const url = 'https://example.com/some-page';
      expect(UrlParser.getStoreType(url)).toBe(AppStoreType.UNKNOWN);
    });
  });

  describe('isValidAppStoreUrl', () => {
    it('should return true for valid Apple App Store URLs', () => {
      expect(UrlParser.isValidAppStoreUrl('https://apps.apple.com/us/app/test/id123')).toBe(true);
    });

    it('should return true for valid Google Play URLs', () => {
      expect(UrlParser.isValidAppStoreUrl('https://play.google.com/store/apps/details?id=com.app')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(UrlParser.isValidAppStoreUrl('https://example.com')).toBe(false);
      expect(UrlParser.isValidAppStoreUrl('')).toBe(false);
      expect(UrlParser.isValidAppStoreUrl('not-a-url')).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    it('should trim whitespace from URL', () => {
      const url = '  https://apps.apple.com/us/app/test/id123  ';
      expect(UrlParser.normalizeUrl(url)).toBe('https://apps.apple.com/us/app/test/id123');
    });

    it('should handle URL with query parameters', () => {
      const url = 'https://play.google.com/store/apps/details?id=com.app&hl=en';
      expect(UrlParser.normalizeUrl(url)).toContain('play.google.com');
    });
  });
});
