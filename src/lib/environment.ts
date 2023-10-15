'use client';

export const environment =
  process.env.NEXT_PUBLIC_APP_ENVIRONMENT ||
  process.env.ENVIRONMENT ||
  process.env.NODE_ENV;

export const isDevelopment = environment === 'development';

export const isStaging =
  // do not override this for stage branch
  !isDevelopment || environment === 'staging' || environment == 'stage';

export const isProduction = environment === 'production';

export const botnetSpaceId = isStaging
  ? // Test ID
    '1cf033cc-26a8-4290-9073-a4eff8ccc075-stage'
  : isProduction
  ? '1cf033cc-26a8-4290-9073-a4eff8ccc075-prod'
  : '1cf033cc-26a8-4290-9073-a4eff8ccc075-dev';
