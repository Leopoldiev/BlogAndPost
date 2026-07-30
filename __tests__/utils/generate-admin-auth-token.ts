export const generateBasicAuthToken = () => {
  const authorizationKey =
    'Basic ' +
    Buffer.from(
      `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`,
    ).toString('base64');

  return authorizationKey;
};
