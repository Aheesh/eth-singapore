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
    const txHash = searchParams.get('txHash') || '';
    const amount = searchParams.get('amount') || '';
    const outcome = searchParams.get('outcome') || '';
    const tokensReceived = searchParams.get('tokensReceived') || '';
    
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
          Bet Placed! Good luck ♟️
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          fontSize: '24px',
          color: '#4ECDC4',
        }}>
          <div style={{ 
            display: 'flex',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#FF6B6B',
          }}>
            Summary!
          </div>
          <div style={{ display: 'flex' }}>
            Bet on: {outcome}
          </div>
          <div style={{ display: 'flex' }}>
            DEGEN spent: {amount}
          </div>
          <div style={{ display: 'flex' }}>
            Estimated {outcome} tokens received: {tokensReceived}
          </div>
          <div style={{ 
            display: 'flex',
            fontSize: '20px',
            color: '#808080',
          }}>
            <a 
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              style={{
                color: '#4ECDC4',
                textDecoration: 'underline',
              }}
            >
              View on Basescan
            </a>
          </div>
        </div>
      </div>
    );
  } else if (type === 'poolStats') {
    const totalPool = searchParams.get('totalPool') || '0';
    const playerABets = searchParams.get('playerABets') || '0';
    const playerBBets = searchParams.get('playerBBets') || '0';
    const drawBets = searchParams.get('drawBets') || '0';
    const playerAOdds = searchParams.get('playerAOdds') || '0.28';
    const playerBOdds = searchParams.get('playerBOdds') || '0.36';
    const drawOdds = searchParams.get('drawOdds') || '0.36';
    
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
          Pool Statistics 🏊‍♂️
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          fontSize: '24px',
          color: '#4ECDC4',
        }}>
          <div style={{ 
            display: 'flex',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#FF6B6B',
          }}>
            Total Pool: {totalPool} DEGEN
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '100%',
            maxWidth: '800px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '8px',
            }}>
              <div>Player A</div>
              <div>{playerABets} DEGEN</div>
              <div>Odds: {playerAOdds}</div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: 'rgba(78, 205, 196, 0.1)',
              borderRadius: '8px',
            }}>
              <div>Player B</div>
              <div>{playerBBets} DEGEN</div>
              <div>Odds: {playerBOdds}</div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}>
              <div>Draw</div>
              <div>{drawBets} DEGEN</div>
              <div>Odds: {drawOdds}</div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex',
            fontSize: '20px',
            color: '#808080',
            marginTop: '20px',
            textAlign: 'center',
          }}>
            Potential winnings are calculated based on the total pool and your bet amount
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