import { ImageResponse } from '@vercel/og';
import { isEmpty } from 'lodash';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const avatar = searchParams.get('avatar');

  return new ImageResponse(
    (
      <div
        style={{
          margin: 'auto',
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100vh',
          background: 'lavender',
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'transparent',
          }}
        >
          {!isEmpty(avatar) && avatar ? (
            <img
              alt="background"
              src={avatar}
              style={{
                position: 'relative',
                height: '120px',
                width: '120px',
                objectFit: 'cover',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0px 6px 20px 0px rgba(0, 0, 0, 0.15)',
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 675,
    },
  );
}
