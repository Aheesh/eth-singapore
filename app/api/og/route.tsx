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
          display: 'flex',
          justifyContent: 'center',
          fontSize: 72, 
          fontWeight: 'bold',
          marginBottom: '40px',
          background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          Player A vs Player B
        </div>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: 24,
          color: '#4ECDC4',
          marginBottom: '20px',
        }}>
          <span style={{ display: 'flex' }}>
            Odds
            <span style={{ 
              display: 'flex',
              fontSize: '16px',
              verticalAlign: 'super',
            }}>*</span>
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: 20,
          color: '#808080',
          marginBottom: '20px',
        }}>
          *Odds are based on FIDE Elo ratings, showing each player's win probability.
        </div>

        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '40px',
          fontSize: 36,
          color: 'white',
        }}>
          {outcomes.includes('Player-A') && (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Player A
              </div>
              <div style={{
                display: 'flex',
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Player B
              </div>
              <div style={{
                display: 'flex',
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Draw
              </div>
              <div style={{
                display: 'flex',
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
          display: 'flex',
          justifyContent: 'center',
          fontSize: 42,
          color: '#FF6B6B',
          fontWeight: 'bold',
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
        }}
      >
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          fontSize: 48, 
          fontWeight: 'bold',
          marginBottom: '40px',
          background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          One-time DEGEN Approval
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginTop: '20px',
          width: '100%',
          padding: '0 20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '36px',
            textAlign: 'center',
            color: '#4ECDC4',
          }}>
            Approve DEGEN to place your bet
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#808080',
            textAlign: 'center',
            maxWidth: '800px',
          }}>
            This is a one-time approval that allows the smart contract to use your DEGEN tokens for betting. You'll only need to do this once.
          </div>
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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          Invalid type
        </div>
      </div>
    );
  }

  return new ImageResponse(content, {
    width: 1200,
    height: 1200,
  });
} 