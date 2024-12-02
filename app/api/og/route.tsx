import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const outcomes = searchParams.get('text')?.split(',') || [];
  const degenBalance = searchParams.get('degenBalance') || '0';

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
          display: 'flex',
        }}>
          Ding vs Gukesh
        </div>
        
        <div style={{ 
          fontSize: 48, 
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#4ECDC4',
          display: 'flex',
        }}>
          Odds
        </div>
        
        <div style={{ 
          display: 'flex',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {outcomes.includes('Ding') && (
            <div style={{ 
              fontSize: 36,
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              display: 'flex',
            }}>
              Ding<br/>28.21%
            </div>
          )}
          {outcomes.includes('Gukesh') && (
            <div style={{ 
              fontSize: 36,
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              display: 'flex',
            }}>
              Gukesh<br/>38.72%
            </div>
          )}
          {outcomes.includes('Draw') && (
            <div style={{ 
              fontSize: 36,
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              display: 'flex',
            }}>
              Draw<br/>33.07%
            </div>
          )}
        </div>
        
        <div style={{ 
          fontSize: 42,
          color: '#FF6B6B',
          fontWeight: 'bold',
          display: 'flex',
        }}>
          DEGEN Prize Pool: {degenBalance} DEGEN
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1200,
    },
  );
} 