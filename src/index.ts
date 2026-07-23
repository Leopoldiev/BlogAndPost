import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';

const app = express();

setupApp(app);

app.listen(SETTINGS.PORT, () => {
  console.log(`Server started on port ${SETTINGS.PORT}`);
});
