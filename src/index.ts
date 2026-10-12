import express from 'express';
import { setupApp } from './setup-app';

import { runDB } from './db/mongo.db';
import { appConfig } from './core/config/config';

const startApp = async () => {
  const app = express();

  setupApp(app);
  const PORT = appConfig.PORT;

  await runDB(appConfig.MONGO_URL || 'mongodb://localhost:27017');

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  return app;
};

startApp();
