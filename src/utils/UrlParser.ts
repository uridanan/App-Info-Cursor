/**
 * Enum representing supported app store types.
 */
export enum AppStoreType {
  APPLE = 'apple',
  GOOGLE = 'google',
  UNKNOWN = 'unknown',
}

/**
 * Utility class for parsing and validating app store URLs.
 */
export class UrlParser {
  private static readonly APPLE_PATTERNS = [
    /apps\.apple\.com/,
    /itunes\.apple\.com/,
  ];

  private static readonly GOOGLE_PATTERN = /play\.google\.com/;

  /**
   * Determines the app store type from a URL.
   * @param url - The URL to analyze
   * @returns The AppStoreType
   */
  static getStoreType(url: string): AppStoreType {
    const normalizedUrl = this.normalizeUrl(url);
    
    for (const pattern of this.APPLE_PATTERNS) {
      if (pattern.test(normalizedUrl)) {
        return AppStoreType.APPLE;
      }
    }

    if (this.GOOGLE_PATTERN.test(normalizedUrl)) {
      return AppStoreType.GOOGLE;
    }

    return AppStoreType.UNKNOWN;
  }

  /**
   * Validates if the URL is a supported app store URL.
   * @param url - The URL to validate
   * @returns true if the URL is valid
   */
  static isValidAppStoreUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    return this.getStoreType(url) !== AppStoreType.UNKNOWN;
  }

  /**
   * Normalizes and cleans the URL.
   * @param url - The URL to normalize
   * @returns The normalized URL
   */
  static normalizeUrl(url: string): string {
    return url.trim();
  }
}
