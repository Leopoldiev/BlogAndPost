import express from 'express';
import { setupApp } from './setup-app';

const app = express();

const PORT = process.env.PORT || 5005;

setupApp(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
