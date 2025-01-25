import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { getHyperFrame } from '../../hyperframes';

export async function getResponse(req: NextRequest): Promise<NextResponse> {
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
    let state = {};
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

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';