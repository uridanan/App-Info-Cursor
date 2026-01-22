/**
 * Developer information from app store.
 */
export interface DeveloperInfo {
  name: string;
  email: string | null;
  website: string | null;
}

/**
 * App information returned from the API.
 */
export interface AppInfo {
  appName: string;
  iconUrl: string;
  bundleId: string;
  description: string;
  developer: DeveloperInfo;
}

/**
 * API error response.
 */
export interface ApiError {
  error: string;
}
