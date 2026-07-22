import express from 'express';
import { setupApp } from './setup-app';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

const app = express();

const PORT = process.env.PORT || 5005;

setupApp(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
