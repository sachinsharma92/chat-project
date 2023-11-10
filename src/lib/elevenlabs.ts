export const getElevenLabsApiKey = () => process.env.ELEVEN_LABS_API_KEY || '';

export const getElevenLabsTextToSpeechApiBaseUrl = () =>
  'https://api.elevenlabs.io/v1/text-to-speech/';

export const getElevenLabsAddVoicesApiBaseUrl = () =>
  'https://api.elevenlabs.io/v1/voices/add/';
