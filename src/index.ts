import express, { Application } from 'express';
import { AppInfoController } from './controllers/AppInfoController';
import { AppScraperFactory } from './services/AppScraperFactory';

const PORT = process.env.PORT || 3001;

/**
 * Creates and configures the Express application.
 */
export function createApp(): Application {
  const app = express();
  
  app.use(express.json());

  const scraperFactory = new AppScraperFactory();
  const controller = new AppInfoController(scraperFactory);

  app.post('/api/app-info', (req, res) => controller.getAppInfo(req, res));

  return app;
}

// Start server if this is the main module
if (require.main === module) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
