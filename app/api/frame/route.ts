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
        console.log('Parsed state from message:', state);
      } catch (e) {
        console.error('Error parsing state:', e);
        // Instead of failing, continue with empty state
        state = {};
      }
    }

    console.log('frame/route.ts: Parsed state =>', state);
    console.log('frame/route.ts: Message =>', message);

    // Get the current frame from state or default to 'start'
    const currentFrame = state.frame || 'start';
    const buttonNumber = message.button || undefined;
    
    console.log('Current frame:', currentFrame);
    console.log('Button number:', buttonNumber);
    console.log('State:', state);
    
    // Handle special cases for button clicks
    if (buttonNumber === 2 && currentFrame === 'txSuccess') {
      console.log('Handling View Pool button click');
      // Handle "View Pool" button click
      const poolStatsState = {
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
      };
      
      console.log('Pool stats state:', poolStatsState);
      
      // Generate the frame HTML for poolStats
      const poolStatsHtml = await getHyperFrame(
        'poolStats',
        message.input || '',
        undefined,
        poolStatsState
      );
      
      return new NextResponse(poolStatsHtml);
    }

    if (currentFrame === 'poolStats') {
      if (buttonNumber === 1) {
        // Handle "Place Bet" button click
        const startState = {
          ...state,
          frame: 'start',
        };
        
        console.log('Start state:', startState);
        
        // Generate the frame HTML for start
        const startHtml = await getHyperFrame(
          'start',
          message.input || '',
          undefined,
          startState
        );
        
        return new NextResponse(startHtml);
      } else if (buttonNumber === 2) {
        // Handle "Refresh Stats" button click
        const refreshedState = {
          ...state,
          // Fetch updated pool stats from your backend or blockchain
          totalPool: '1200', // Example value, replace with actual data
          playerABets: '500',
          playerBBets: '400',
          drawBets: '300',
          playerAOdds: '0.28',
          playerBOdds: '0.36',
          drawOdds: '0.36',
        };
        
        console.log('Refreshed state:', refreshedState);
        
        // Generate the frame HTML for poolStats
        const refreshedHtml = await getHyperFrame(
          'poolStats',
          message.input || '',
          undefined,
          refreshedState
        );
        
        return new NextResponse(refreshedHtml);
      }
    }
    
    // Generate the frame HTML
    const frameHtml = await getHyperFrame(
      currentFrame,
      message.input || '',
      buttonNumber,
      state
    );

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