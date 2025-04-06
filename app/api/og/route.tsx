import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const text = searchParams.get('text') || '';
  const degenBalance = searchParams.get('degenBalance') || '0';

  let content;

  if (type === 'start') {
    const playerAProb = searchParams.get('playerAProb') || '28';
    const playerBProb = searchParams.get('playerBProb') || '36';
    const drawProb = searchParams.get('drawProb') || '36';

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
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 48, 
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            Player A vs Player B
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 24,
            color: '#808080',
          }}>
            Win Probability: {playerAProb}% vs {playerBProb}% (Draw: {drawProb}%)
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 24,
            color: '#4ECDC4',
          }}>
            Total Pool: {parseFloat(degenBalance).toFixed(2)} DEGEN
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginTop: '20px',
          width: '100%',
          maxWidth: '700px',
          padding: '0 20px',
        }}>
          {/* Player A Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '16px',
          }}>
            <div style={{
              width: '100px',
              display: 'flex',
              fontSize: '20px',
              color: '#FF6B6B',
            }}>
              Player A
            </div>
            <div style={{
              flex: 1,
              height: '24px',
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${playerAProb}%`,
                height: '100%',
                background: 'rgba(255, 107, 107, 0.3)',
              }} />
            </div>
            <div style={{
              width: '60px',
              display: 'flex',
              fontSize: '18px',
              color: '#666666',
              justifyContent: 'flex-end',
            }}>
              {playerAProb}%
            </div>
          </div>

          {/* Player B Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '16px',
          }}>
            <div style={{
              width: '100px',
              display: 'flex',
              fontSize: '20px',
              color: '#4ECDC4',
            }}>
              Player B
            </div>
            <div style={{
              flex: 1,
              height: '24px',
              background: 'rgba(78, 205, 196, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${playerBProb}%`,
                height: '100%',
                background: 'rgba(78, 205, 196, 0.3)',
              }} />
            </div>
            <div style={{
              width: '60px',
              display: 'flex',
              fontSize: '18px',
              color: '#666666',
              justifyContent: 'flex-end',
            }}>
              {playerBProb}%
            </div>
          </div>

          {/* Draw Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '16px',
          }}>
            <div style={{
              width: '100px',
              display: 'flex',
              fontSize: '20px',
              color: '#808080',
            }}>
              Draw
            </div>
            <div style={{
              flex: 1,
              height: '24px',
              background: 'rgba(128, 128, 128, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${drawProb}%`,
                height: '100%',
                background: 'rgba(128, 128, 128, 0.3)',
              }} />
            </div>
            <div style={{
              width: '60px',
              display: 'flex',
              fontSize: '18px',
              color: '#666666',
              justifyContent: 'flex-end',
            }}>
              {drawProb}%
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