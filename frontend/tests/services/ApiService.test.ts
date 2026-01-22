import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../../src/services/ApiService';
import { AppInfo } from '../../src/types/AppInfo';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService('/api');
    vi.restoreAllMocks();
  });

  describe('fetchAppInfo', () => {
    const mockAppInfo: AppInfo = {
      appName: 'Test App',
      iconUrl: 'https://example.com/icon.png',
      bundleId: 'com.test.app',
      description: 'A test application',
      developer: {
        name: 'Test Developer',
        email: 'dev@test.com',
        website: 'https://test.com',
      },
    };

    it('should fetch app info successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAppInfo),
      });

      const url = 'https://apps.apple.com/us/app/test/id123';
      const result = await apiService.fetchAppInfo(url);

      expect(result).toEqual(mockAppInfo);
      expect(fetch).toHaveBeenCalledWith('/api/app-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    });

    it('should throw error when API returns error response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'App not found' }),
      });

      const url = 'https://apps.apple.com/us/app/test/id999';

      await expect(apiService.fetchAppInfo(url)).rejects.toThrow('App not found');
    });

    it('should throw error when network fails', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const url = 'https://apps.apple.com/us/app/test/id123';

      await expect(apiService.fetchAppInfo(url)).rejects.toThrow('Network error');
    });

    it('should use custom base URL', async () => {
      const customService = new ApiService('http://localhost:3001/api');
      
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAppInfo),
      });

      await customService.fetchAppInfo('https://play.google.com/store/apps/details?id=com.app');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/app-info',
        expect.any(Object)
      );
    });
  });
});
