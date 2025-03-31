import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const text = searchParams.get('text') || '';
  const degenBalance = searchParams.get('degenBalance') || '0';

  let content;

  if (type === 'start') {
    const outcomes = text.split(',');
    content = (
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
          Player A vs Player B
        </div>
        
        <div style={{ 
          fontSize: 24,
          color: '#4ECDC4',
          marginBottom: '20px',
        }}>
          Odds
        </div>
        
        <div style={{
          fontSize: 16,
          color: '#808080',
          marginBottom: '20px',
        }}>
          Odds are based on FIDE Elo ratings, showing each player's win probability.
        </div>

        <div style={{ 
          display: 'flex',
          gap: '40px',
          marginBottom: '40px',
          fontSize: 36,
          color: 'white',
        }}>
          {outcomes.includes('Player-A') && (
            <div style={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Player A
              </div>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                0.28
              </div>
            </div>
          )}
          {outcomes.includes('Player-B') && (
            <div style={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Player B
              </div>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                0.36
              </div>
            </div>
          )}
          {outcomes.includes('Draw') && (
            <div style={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Draw
              </div>
              <div style={{
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                0.36
              </div>
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
    );
  } else if (type === 'approve') {
    content = (
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
          fontSize: 48, 
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#4ECDC4',
          display: 'flex',
        }}>
          Swap Approval
        </div>
        
        <div style={{ 
          fontSize: 36,
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          display: 'flex',
        }}>
          {text}
        </div>
      </div>
    );
  } else {
    content = (
      <div
        style={{
          background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        Invalid type
      </div>
    );
  }

  return new ImageResponse(content, {
    width: 1200,
    height: 1200,
  });
} 