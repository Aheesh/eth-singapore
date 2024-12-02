import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { getHyperFrame } from '../../hyperframes';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/frame/route.ts :  START ');

  let accountAddress: string | undefined = '';
  let text: string | undefined = '';
  let message: any;

  try {
    const body: FrameRequest = await req.json();
    console.log('Received body:', body);

    const { isValid, message: frameMessage } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    message = frameMessage;
    console.log('Frame message validation result:', { isValid, message });

    if (!isValid) {
      console.error('Invalid message');
      return NextResponse.json({ error: 'Message not valid' }, { status: 400 });
    }

    accountAddress = message.interactor.verified_accounts[0];
  } catch (error) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  if (message?.input) {
    text = message.input;
  }

  let state = { frame: 'start' };

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  console.log('Raw state:', message?.state?.serialized);
  const frame = state.frame;
  console.log('api/frame/route.ts : state =>', state);
  console.log('api/frame/route.ts : frame =>', frame);

  const hyperFrameResponse = await getHyperFrame(frame as string, text ?? '', message.button, state);
  console.log('HyperFrame response:', hyperFrameResponse);

  return new NextResponse(hyperFrameResponse);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';