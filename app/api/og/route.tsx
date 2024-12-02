import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    ),
    {
      width: 1200,
      height: 1200,
    },
  );
} 