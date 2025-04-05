import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, FrameRequest } from '@coinbase/onchainkit/frame';
import { getHyperFrame } from '../../hyperframes';

interface FrameState {
  frame?: string;
  amount?: string;
  outcome?: string;
  txHash?: string;
  totalPool?: string;
  playerABets?: string;
  playerBBets?: string;
  drawBets?: string;
  playerAOdds?: string;
  playerBOdds?: string;
  drawOdds?: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Safely parse the request body
    let body: FrameRequest;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new NextResponse('Invalid JSON in request body', { status: 400 });
    }

    // Validate the frame message
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    
    if (!isValid) {
      console.error('Invalid frame message');
      return new NextResponse('Invalid frame message', { status: 400 });
    }

    // Safely parse the state
    let state: FrameState = {};
    if (message.state?.serialized) {
      try {
        state = JSON.parse(decodeURIComponent(message.state.serialized));
      } catch (e) {
        console.error('Error parsing state:', e);
        // Instead of failing, continue with empty state
        state = {};
      }
    }

    console.log('frame/route.ts: Parsed state =>', state);
    console.log('frame/route.ts: Message =>', message);

    // Get the current frame from state or default to 'start'
    const currentFrame = (state as any)?.frame || 'start';
    const buttonNumber = message.button || undefined;
    
    // Generate the frame HTML
    const frameHtml = await getHyperFrame(
      currentFrame,
      message.input || '',
      buttonNumber,
      state
    );

    // Handle special cases for button clicks
    if (buttonNumber === 2 && state.frame === 'txSuccess') {
      // Handle "View Pool" button click
      return NextResponse.json({
        frame: 'poolStats',
        state: {
          ...state,
          frame: 'poolStats',
          // Fetch pool stats from your backend or blockchain
          totalPool: '1000', // Example value, replace with actual data
          playerABets: '400',
          playerBBets: '350',
          drawBets: '250',
          playerAOdds: '0.28',
          playerBOdds: '0.36',
          drawOdds: '0.36',
        },
      });
    }

    if (state.frame === 'poolStats') {
      if (buttonNumber === 1) {
        // Handle "Place Bet" button click
        return NextResponse.json({
          frame: 'start',
          state: {
            ...state,
            frame: 'start',
          },
        });
      } else if (buttonNumber === 2) {
        // Handle "Refresh Stats" button click
        return NextResponse.json({
          frame: 'poolStats',
          state: {
            ...state,
            // Fetch updated pool stats from your backend or blockchain
            totalPool: '1200', // Example value, replace with actual data
            playerABets: '500',
            playerBBets: '400',
            drawBets: '300',
            playerAOdds: '0.28',
            playerBOdds: '0.36',
            drawOdds: '0.36',
          },
        });
      }
    }

    return new NextResponse(frameHtml);

  } catch (error) {
    console.error('Error in frame route:', error);
    // Return a generic error frame
    return new NextResponse(JSON.stringify({
      buttons: [{ label: 'Try Again' }],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/error.webp`,
        aspectRatio: '1:1',
      },
      state: { frame: 'error' },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const dynamic = 'force-dynamic';