import { Request, Response } from 'express';
import { AppInfoController } from '../../src/controllers/AppInfoController';
import { AppScraperFactory } from '../../src/services/AppScraperFactory';
import { AppInfo } from '../../src/models/AppInfo';
import { DeveloperInfo } from '../../src/models/DeveloperInfo';

describe('AppInfoController', () => {
  let controller: AppInfoController;
  let mockFactory: jest.Mocked<AppScraperFactory>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockFactory = {
      getScraper: jest.fn(),
      canHandle: jest.fn(),
    } as any;

    controller = new AppInfoController(mockFactory);

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {};
  });

  describe('getAppInfo', () => {
    it('should return app info for valid Apple URL', async () => {
      const mockAppInfo = new AppInfo(
        'Test App',
        'https://example.com/icon.png',
        'com.test.app',
        'A test app',
        new DeveloperInfo('Test Dev', 'dev@test.com', 'https://test.com')
      );

      const mockScraper = {
        fetchAppInfo: jest.fn().mockResolvedValue(mockAppInfo),
        canHandle: jest.fn().mockReturnValue(true),
      };

      mockFactory.getScraper.mockReturnValue(mockScraper);
      mockFactory.canHandle.mockReturnValue(true);

      mockRequest.body = { url: 'https://apps.apple.com/us/app/test-app/id123456789' };

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(mockAppInfo.toJSON());
    });

    it('should return app info for valid Google Play URL', async () => {
      const mockAppInfo = new AppInfo(
        'Android App',
        'https://example.com/icon.png',
        'com.android.app',
        'An Android app',
        new DeveloperInfo('Android Dev', 'dev@android.com', 'https://android.com')
      );

      const mockScraper = {
        fetchAppInfo: jest.fn().mockResolvedValue(mockAppInfo),
        canHandle: jest.fn().mockReturnValue(true),
      };

      mockFactory.getScraper.mockReturnValue(mockScraper);
      mockFactory.canHandle.mockReturnValue(true);

      mockRequest.body = { url: 'https://play.google.com/store/apps/details?id=com.android.app' };

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(mockAppInfo.toJSON());
    });

    it('should return 400 for missing URL', async () => {
      mockRequest.body = {};

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'URL is required' });
    });

    it('should return 400 for invalid URL type', async () => {
      mockRequest.body = { url: 12345 };

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'URL must be a string' });
    });

    it('should return 400 for unsupported URL', async () => {
      mockFactory.canHandle.mockReturnValue(false);
      mockFactory.getScraper.mockImplementation(() => {
        throw new Error('No scraper available for URL');
      });

      mockRequest.body = { url: 'https://example.com/not-an-app-store' };

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Unsupported URL. Please provide an Apple App Store or Google Play Store URL.',
      });
    });

    it('should return 404 when app not found', async () => {
      const mockScraper = {
        fetchAppInfo: jest.fn().mockRejectedValue(new Error('App not found')),
        canHandle: jest.fn().mockReturnValue(true),
      };

      mockFactory.getScraper.mockReturnValue(mockScraper);
      mockFactory.canHandle.mockReturnValue(true);

      mockRequest.body = { url: 'https://apps.apple.com/us/app/test-app/id999999999' };

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'App not found' });
    });

    it('should return 500 for unexpected errors', async () => {
      const mockScraper = {
        fetchAppInfo: jest.fn().mockRejectedValue(new Error('Network error')),
        canHandle: jest.fn().mockReturnValue(true),
      };

      mockFactory.getScraper.mockReturnValue(mockScraper);
      mockFactory.canHandle.mockReturnValue(true);

      mockRequest.body = { url: 'https://apps.apple.com/us/app/test-app/id123456789' };

      await controller.getAppInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch app info' });
    });
  });
});
