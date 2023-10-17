import { NextResponse } from 'next/server';

export const returnApiUnauthorizedError = () => {
  return NextResponse.json(
    {
      message: 'Unauthorized',
    },
    {
      status: 401,
    },
  );
};

export const returnCommonStatusError = (message?: string) => {
  return NextResponse.json(
    {
      message: message || 'Something went wrong',
    },
    {
      status: 500,
    },
  );
};

export const returnRateLimitError = () => {
  return NextResponse.json(
    {
      message: 'Rate limited',
    },
    {
      status: 429,
    },
  );
};
