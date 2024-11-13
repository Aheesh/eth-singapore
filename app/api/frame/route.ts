import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { getHyperFrame } from '../../hyperframes';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/frame/route.ts : Base Frame endpoint');

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

  console.log('api/frame/route.ts : after try catch ==> state =>', state.frame);
  const frame = state.frame;
  console.log('api/frame/route.ts : state =>', message.state);
  console.log('api/frame/route.ts : frame =>', frame);

  const baseFrame = frame.split('?')[0];

  if (!baseFrame) {
    console.error('Frame not found');
    return NextResponse.json({ error: 'Frame not found' }, { status: 404 });
  }

  if (!message?.button) {
    console.error('Button not found');
    return NextResponse.json({ error: 'Button not found' }, { status: 400 });
  }

  const hyperFrameResponse = getHyperFrame(baseFrame as string, text ?? '', message.button);
  console.log('HyperFrame response:', hyperFrameResponse);

  return new NextResponse(hyperFrameResponse);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';