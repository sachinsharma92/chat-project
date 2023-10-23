export const getPortkeyApiKey = () => {
  return process.env.PORTKEY_API_KEY || '';
};