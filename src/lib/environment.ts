'use client';

export const environment =
  process.env.NEXT_PUBLIC_APP_ENVIRONMENT ||
  process.env.ENVIRONMENT ||
  process.env.NODE_ENV;

export const isDevelopment = environment === 'development';

export const isStaging =
  // do not override this for stage branch
  environment === 'staging' || environment == 'stage';

export const isProduction = environment === 'production';
