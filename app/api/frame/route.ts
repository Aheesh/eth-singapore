import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { getHyperFrame } from '../../hyperframes';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/frame/route.ts : Base Frame endpoint');

  try {
    let accountAddress: string | undefined = '';
    let text: string | undefined = '';

    const body: FrameRequest = await req.json();
    console.log('Received body:', body);

    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    console.log('Frame message validation result:', { isValid, message });

    if (!isValid) {
      console.error('Invalid message');
      return NextResponse.json({ error: 'Message not valid' }, { status: 400 });
    }

    accountAddress = message.interactor.verified_accounts[0];
    text = message.input || '';

    let state = { frame: 'start', amount: '0' };
    console.log('api/frame/route.ts : message.state before parsing =>', message.state);
    
    if (message?.state?.serialized) {
      try {
        const parsedState = JSON.parse(decodeURIComponent(message.state.serialized));
        state = { ...state, ...parsedState };
      } catch (e) {
        console.error('Error parsing state:', e);
      }
    }

    console.log('api/frame/route.ts : after parsing ==> state =>', state);

    const frame = state.frame;

    if (!frame) {
      console.error('Frame not found');
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 });
    }

    if (!message?.button) {
      console.error('Button not found');
      return NextResponse.json({ error: 'Button not found' }, { status: 400 });
    }

    const hyperFrameResponse = getHyperFrame(frame as string, text, message.button, state);
    console.log('HyperFrame response:', hyperFrameResponse);

    return new NextResponse(hyperFrameResponse);
  } catch (error) {
    console.error('Error in getResponse:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
