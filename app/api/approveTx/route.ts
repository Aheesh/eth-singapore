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
  try {
    console.log('api/approveTx/route.ts : Approve endpoint');

    let accountAddress: string | undefined = '';
    let walletAddress: string = '';

    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    console.log('api/approveTx/route.ts : body =>', body);

    if (!isValid) {
      console.error('Invalid message');
      return new NextResponse('Message not valid', { status: 500 });
    }

    accountAddress = message.interactor.verified_accounts[0];
    walletAddress = message.address || '';
    console.log('api/approveTx/route.ts : walletAddress =>', walletAddress);

    if (!walletAddress) {
      throw new Error('No wallet address provided');
    }

    let amount = 0;
    if (message.button) {
      amount = parseInt(message.button.toString());
    }

    // Parse the existing state
    let state: State = {};
    try {
      const parsedState = JSON.parse(decodeURIComponent(message.state?.serialized || '{}'));
      console.log('api/approveTx/route.ts : parsed state =>', parsedState);
      state = parsedState;
    } catch (e) {
      console.error('Error parsing state:', e);
      state = {};
    }

    // Update the state with the new amount and explicitly set the next frame
    state = {
      ...state,
      frame: 'approve',
      amount: amount.toString(),
      nextFrame: 'swapTx', // Add this to control the flow after approval
      skipCalculation: true, // Add this flag to skip token calculation in the next frame
    };

    console.log('api/approveTx/route.ts : updated state =>', state);

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

    const updatedSerializedState = encodeURIComponent(JSON.stringify(state));

    return NextResponse.json({
      ...txData,
      state: {
        serialized: updatedSerializedState,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });

  } catch (error) {
    console.error('Error in approveTx:', error);
    // Return an error frame response
    return NextResponse.json({
      state: {
        serialized: encodeURIComponent(JSON.stringify({ frame: 'error' })),
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';