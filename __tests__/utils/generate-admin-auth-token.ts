import { appConfig } from '../../src/core/config/config';

export const generateBasicAuthToken = () => {
  const authorizationKey =
    'Basic ' +
    Buffer.from(
      `${appConfig.ADMIN_USERNAME}:${appConfig.ADMIN_PASSWORD}`,
    ).toString('base64');

  return authorizationKey;
};
