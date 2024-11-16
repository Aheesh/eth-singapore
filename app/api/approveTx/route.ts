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

export type State = {
  frame?: string;
  amount?: string;
  outcome?: string;
  [key: string]: any;
};

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/approveTx/route.ts : Approve endpoint');

  let accountAddress: string | undefined = '';
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

  let amount = 0;
  if (message.button) {
    amount = parseInt(message.button.toString());
  }

  console.log('api/approveTx/route.ts :amount =>', amount);

  // Parse the existing state
  let state: State = {};
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized || '{}'));
  } catch (e) {
    console.error('Error parsing state:', e);
  }

  // Update the state with the new amount while preserving existing state
  state = {
    ...state,
    amount: amount.toString(),
    frame: 'approve',
    outcome: state.outcome
  };

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

  console.log('api/approveTx/route.ts : txData =>', txData);

  const updatedSerializedState = encodeURIComponent(JSON.stringify(state));
  console.log('api/approveTx/route.ts : serialized: updatedSerializedState with return txdata =>', updatedSerializedState);

  return NextResponse.json({
    ...txData,
    state: {
      serialized: updatedSerializedState,
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';