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

  let state; // = { frame: 'start' };
  //Set state to default start frame if it doesn't exist
  console.log('api/frame/route.ts : message.state before check for value =>', message.state);
  if (!message?.state?.serialized) {
    state = { frame: 'start' };
  }
  console.log('api/frame/route.ts : message.state after check for value =>', message.state);
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  console.log('api/frame/route.ts : after try catch ==> state =>', state);
  console.log('api/frame/route.ts : after try catch ==> state.frame =>', state.frame);
  const frame = state.frame;
  console.log('api/frame/route.ts : state =>', message.state);
  console.log('api/frame/route.ts : frame =>', frame);

  // TODO: Cleanup this error handling
  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }

  // There should always be a button number
  if (!message?.button) {
    return new NextResponse('Button not found', { status: 404 });
  }

  console.log('api/frame/route.ts : Calling getHyperFrame =>');
  return new NextResponse(getHyperFrame(frame as string, text || '', message?.button));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
