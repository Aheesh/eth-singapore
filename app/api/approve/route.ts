import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server.js';

import { getHyperFrame } from '../../hyperframes.js';

// addHyperFrame('approve', {
//   frame: getFrameHtmlResponse({
//     buttons: [
//       {
//         label: 'Approve',
//       },
//       {
//         label: 'Cancel',
//       },
//     ],
//     image: {
//       src: `${NEXT_PUBLIC_URL}/game1.webp`,
//       aspectRatio: '1:1',
//     },
//     state: { frame: 'approve' },
//     postUrl: `${NEXT_PUBLIC_URL}/api/approveTx`,
//   }),
//   1: 'approveTx',
//   2: 'start',
// });

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/approve/route.ts : Approve endpoint');

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

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }
  console.log('api/approve/route.ts :accountAddress =>', accountAddress);

  const frame = state.frame;
  console.log('api/approve/route.ts :state =>', message.state);
  console.log('api/approve/route.ts :frame =>', frame);

  // TODO: Cleanup this error handling
  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }

  // There should always be a button number
  if (!message?.button) {
    return new NextResponse('Button not found', { status: 404 });
  }
  console.log('api/approve/route.ts : message =>', message);
  console.log('api/approve/route.ts : button =>', message.button);
  console.log('api/approve/route.ts : text =>', text);
  console.log('api/approve/route.ts : frame =>', frame);
  return new NextResponse(getHyperFrame(frame as string, text || '', message?.button));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
