import express from 'express';
import { setupApp } from './setup-app';
import dotenv from 'dotenv';
import { runDB } from './db/mongo.db';

dotenv.config();

const startApp = async () => {
  const app = express();

  setupApp(app);
  const PORT = process.env.PORT || 5005;

  await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017');

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  return app;
};

startApp();
