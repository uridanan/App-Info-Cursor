import { Request, Response } from 'express';
import { AppScraperFactory } from '../services/AppScraperFactory';

/**
 * Controller for handling app info API requests.
 * Depends on AppScraperFactory for scraper selection.
 */
export class AppInfoController {
  private readonly scraperFactory: AppScraperFactory;

  constructor(scraperFactory: AppScraperFactory) {
    this.scraperFactory = scraperFactory;
  }

  /**
   * Handles POST /api/app-info requests.
   * Expects { url: string } in request body.
   */
  async getAppInfo(req: Request, res: Response): Promise<void> {
    const validationError = this.validateRequest(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const { url } = req.body;

    if (!this.scraperFactory.canHandle(url)) {
      res.status(400).json({
        error: 'Unsupported URL. Please provide an Apple App Store or Google Play Store URL.',
      });
      return;
    }

    try {
      const scraper = this.scraperFactory.getScraper(url);
      const appInfo = await scraper.fetchAppInfo(url);
      res.json(appInfo.toJSON());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      if (message.includes('not found')) {
        res.status(404).json({ error: 'App not found' });
        return;
      }

      res.status(500).json({ error: 'Failed to fetch app info' });
    }
  }

  /**
   * Validates the request body.
   * @param body - The request body
   * @returns Error message or null if valid
   */
  private validateRequest(body: unknown): string | null {
    if (!body || typeof body !== 'object') {
      return 'Invalid request body';
    }

    const { url } = body as { url?: unknown };

    if (url === undefined || url === null) {
      return 'URL is required';
    }

    if (typeof url !== 'string') {
      return 'URL must be a string';
    }

    if (url.trim() === '') {
      return 'URL cannot be empty';
    }

    return null;
  }
}
