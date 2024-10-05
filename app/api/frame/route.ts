import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { getHyperFrame } from '../../hyperframes';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/frame/route.ts : Base Frame endpoint');

  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  } else {
    return new NextResponse('Message not valid', { status: 500 });
  }

  if (message?.input) {
    text = message.input;
  }

  let state = { frame: 'start', amount: '0' };
  console.log('api/frame/route.ts : message.state before parsing =>', message.state);
  
  try {
    if (message?.state?.serialized) {
      const parsedState = JSON.parse(decodeURIComponent(message.state.serialized));
      state = { ...state, ...parsedState };
    }
  } catch (e) {
    console.error('Error parsing state:', e);
  }

  console.log('api/frame/route.ts : after parsing ==> state =>', state);
  console.log('api/frame/route.ts : after parsing ==> state.frame =>', state.frame);
  console.log('api/frame/route.ts : after parsing ==> state.amount =>', state.amount);

  const frame = state.frame;

  // TODO: Cleanup this error handling
  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }

  // There should always be a button number
  if (!message?.button) {
    return new NextResponse('Button not found', { status: 404 });
  }

  return new NextResponse(getHyperFrame(frame as string,text || '',message?.button));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
