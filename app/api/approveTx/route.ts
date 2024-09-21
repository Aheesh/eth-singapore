//Approve DEGEN token from wallet , amount based on previous frame button and player / draw outcome from 1st frame.
// fetch accountAddress
// fetch button # for amount *10**2 * 10**18
// Player A / B / Draw from message.state
// tx to approve DEGEN token transfer and spend

import { NextRequest, NextResponse } from 'next/server';
import('@coinbase/onchainkit/frame');
import { NEXT_PUBLIC_URL } from '../../config';
import { addHyperFrame, getHyperFrame } from '../../hyperframes';
import { encodeFunctionData, parseUnits } from 'viem';
import abi from '../../_contracts/degen';
import { BAL_VAULT_ADDR, DEGEN_ADDR } from '../../config';
import { base } from 'viem/chains';
import {
  FrameRequest,
  getFrameMessage,
  FrameTransactionResponse,
} from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/approvetx/route.ts : Approve endpoint');

  let accountAddress: string | undefined = '';
  let text: string | undefined = '';
  let walletAddress: string = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  console.log('api/approveTx/route.ts : body =>', body);

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    walletAddress = message.address || '';
  } else {
    return new NextResponse('Message not valid', { status: 500 });
  }
  console.log('api/approveTx/route.ts : walletAddress =>', walletAddress);

  let state; // = { frame: 'start' };

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }
  console.log('api/approveTx/route.ts :State =>', state);
  console.log('api/approveTx/route.ts :accountAddress =>', accountAddress);
  console.log('api/approveTx/route.ts :walletAddress =>', walletAddress);

  console.log('api/approveTx/route.ts : message =>', message);
  console.log('api/approveTx/route.ts : button =>', message.button);

  let amount = 0;
  //TODO : amount based on previous frame button and player / draw outcome from 1st frame.
  if (message.button) {
    amount = message.button * 1;
  } else amount = 100; //TODO : default amount set to 100.

  console.log('api/approveTx/route.ts :amount =>', amount);

  const value = parseUnits(amount.toString(), 18);
  console.log('api/approveTx/route.ts :value =>', value);

  const data = encodeFunctionData({
    abi: abi,
    functionName: 'approve',
    args: [BAL_VAULT_ADDR, value],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: abi,
      data: data,
      to: DEGEN_ADDR,
      value: '0x0',
    },
  };

  const frame = state.frame;
  console.log('api/approveTx/route.ts :state =>', message.state);
  console.log('api/approveTx/route.ts :frame =>', frame);

  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }

  // There should always be a button number
  if (!message?.button) {
    return new NextResponse('Button not found', { status: 404 });
  }

  //return new NextResponse('Approve', { status: 200 }); // TODO
  console.log('api/approveTx/route.ts : txData =>', txData);
  //console.log('api/approveTx/route.ts : text =>', text);
  return NextResponse.json(txData);
  //return new NextResponse(getHyperFrame(frame as string, text || '', message?.button));
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
