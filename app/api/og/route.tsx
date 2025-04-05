import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const text = searchParams.get('text') || '';
  const degenBalance = searchParams.get('degenBalance') || '0';

  let content;

  if (type === 'start') {
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
          Place Your Bet
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
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '800px',
            gap: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              background: 'rgba(255, 107, 107, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FF6B6B',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#FF6B6B',
                marginBottom: '8px',
              }}>
                Player A
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#808080',
              }}>
                Odds: 2.5x
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              background: 'rgba(78, 205, 196, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #4ECDC4',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#4ECDC4',
                marginBottom: '8px',
              }}>
                Player B
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#808080',
              }}>
                Odds: 1.8x
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '800px',
            marginTop: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #808080',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#808080',
                marginBottom: '8px',
              }}>
                Draw
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#808080',
              }}>
                Odds: 3.2x
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (type === 'selectAmount') {
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
          fontSize: 48, 
          fontWeight: 'bold',
          marginBottom: '40px',
          background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          Select Betting Amount
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginTop: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '32px',
            textAlign: 'center',
            color: '#4ECDC4',
            maxWidth: '800px',
          }}>
            Select the amount of DEGEN to place your bet
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#808080',
            textAlign: 'center',
            maxWidth: '800px',
            marginTop: '20px',
          }}>
            This will require a one-time permission to deduct DEGEN from your wallet
          </div>
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
          Confirm Swap
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
            {text}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#808080',
            textAlign: 'center',
            maxWidth: '800px',
          }}>
            Please confirm the transaction to proceed with the swap
          </div>
        </div>
      </div>
    );
  } else if (type === 'txSuccess') {
    const [outcome, amount, tokensReceived] = text.split(',');
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
          Bet Placed Successfully!
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
            color: '#4ECDC4',
          }}>
            {outcome}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '800px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '24px',
              color: '#808080',
            }}>
              <span style={{ display: 'flex' }}>Amount Spent:</span>
              <span style={{ display: 'flex' }}>{amount} DEGEN</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '24px',
              color: '#808080',
            }}>
              <span style={{ display: 'flex' }}>Estimated Tokens:</span>
              <span style={{ display: 'flex' }}>{tokensReceived || '0.0000000000'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (type === 'poolStats') {
    const [totalPool, playerABets, playerBBets, drawBets] = text.split(',');
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
          Pool Statistics
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
            color: '#4ECDC4',
          }}>
            Total Pool: {totalPool} DEGEN
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '800px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '24px',
              color: '#808080',
            }}>
              <span style={{ display: 'flex' }}>Player A Bets:</span>
              <span style={{ display: 'flex' }}>{playerABets} DEGEN</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '24px',
              color: '#808080',
            }}>
              <span style={{ display: 'flex' }}>Player B Bets:</span>
              <span style={{ display: 'flex' }}>{playerBBets} DEGEN</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '24px',
              color: '#808080',
            }}>
              <span style={{ display: 'flex' }}>Draw Bets:</span>
              <span style={{ display: 'flex' }}>{drawBets} DEGEN</span>
            </div>
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