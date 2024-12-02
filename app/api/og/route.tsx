import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          color: 'white',
        }}
      >
        <div style={{ 
          fontSize: 72, 
          fontWeight: 'bold',
          marginBottom: '40px',
          background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          Ding vs Gukesh
        </div>
        
        <div style={{ 
          fontSize: 48, 
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#4ECDC4'
        }}>
          Odds
        </div>
        
        <div style={{ 
          display: 'flex',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {text?.includes('Ding') && (
            <div style={{ 
              fontSize: 36,
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            }}>
              Ding<br/>28.21%
            </div>
          )}
          {text?.includes('Gukesh') && (
            <div style={{ 
              fontSize: 36,
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            }}>
              Gukesh<br/>38.72%
            </div>
          )}
          {text?.includes('Draw') && (
            <div style={{ 
              fontSize: 36,
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            }}>
              Draw<br/>33.07%
            </div>
          )}
        </div>
        
        <div style={{ 
          fontSize: 42,
          color: '#FF6B6B',
          fontWeight: 'bold',
        }}>
          {text?.split('DEGEN Prize Pool:')[1]}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1200,
    },
  );
} 