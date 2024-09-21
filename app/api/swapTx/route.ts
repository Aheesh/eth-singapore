//Query Batchswap , display the token that will be swapped for the DEGEN amount selected in previous frame.

import dotenv from 'dotenv';
dotenv.config();
import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { BalancerSDK, Network, SwapType, Swaps } from '@balancer-labs/sdk';
import { BAL_VAULT_ADDR, DEGEN_ADDR, PLAYER_A_ADDR, POOL_ID } from '../../config';
import { ethers, formatEther, BigNumberish, parseUnits, N } from 'ethers'; // Ethers v6 imports

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/swapTx/route.ts : Swap Tx endpoint');

  let accountAddress: string | undefined = '';
  let text: string | undefined = '';
  let walletAddress: string = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    walletAddress = message.address || '';
  } else {
    return new NextResponse('Message not valid', { status: 500 });
  }
  console.log('api/swapTx/route.ts :accountAddress =>', accountAddress);
  console.log('api/swapTx/route.ts :walletAddress =>', walletAddress);
  console.log('api/swapTx/route.ts : message =>', message);
  console.log('api/swapTx/route.ts : button =>', message.interactor);

  let state; // = { frame: 'start' };

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  const frame = state.frame;
  console.log('api/swapTx/route.ts :state =>', message.state);
  console.log('api/swapTx/route.ts :frame =>', frame);

  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }

  // There should always be a button number
  if (!message?.button) {
    return new NextResponse('Button not found', { status: 404 });
  }

  //QueryBatchSwap to get the expected amount of tokens Out for confirmation
  const providerApiKey = process.env.BASE_PROVIDER_API_KEY;

  const sdk = new BalancerSDK({
    network: Network.BASE,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
  });

  console.log('sdk', sdk);
  console.log('network', Network.BASE);
  const { contracts } = sdk;
  console.log('contracts', contracts.vault.address);

  const tokenIn = DEGEN_ADDR;
  const tokenOut = PLAYER_A_ADDR; //TODO should be based on the option selected

  console.log('tokenIn', tokenIn);
  console.log('tokenOut', tokenOut);
  const value = String(1e18); //TODO get the amount from the user on first frame.

  const swaps = [
    {
      poolId: POOL_ID,
      assetInIndex: 0,
      assetOutIndex: 1,
      amount: value, //TODO get the amount from the user
      userData: '0x',
    },
  ];
  const assets = [tokenIn, tokenOut];

  const queryInfo = await sdk.swaps.queryBatchSwap({
    kind: SwapType.SwapExactIn,
    swaps,
    assets,
  });
  console.log('queryInfo', queryInfo);
  const absValue = Math.abs(Number(formatEther(queryInfo[1])));
  console.log(`queryInfo - Swap : You will receive ${absValue} ${tokenOut}`);

  const encodeBatchSwapData = Swaps.encodeBatchSwap({
    kind: SwapType.SwapExactIn,
    swaps: [
      {
        poolId: POOL_ID,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: value,
        userData: '0x',
      },
    ],
    assets: [tokenIn, tokenOut],

    funds: {
      fromInternalBalance: false,
      recipient: walletAddress,
      sender: walletAddress,
      toInternalBalance: false,
    },
    limits: [value, '0'],
    deadline: Math.ceil(Date.now() / 1000) + 300,
  });

  console.log('encodeBatchSwapData', encodeBatchSwapData);
  //convert encodeBatchSwapData to remove the leading 0x characters
  const hexSwapData = encodeBatchSwapData.slice(2);
  console.log('hexSwapData', hexSwapData);

  // Set gas parameters
  const gasLimit = parseUnits('300000', 'wei'); // Adjust as needed
  const maxFeePerGas = parseUnits('1', 'gwei'); // 1 gwei
  const maxPriorityFeePerGas = parseUnits('0.1', 'gwei'); // 0.1 gwei

  //Frame Transaction
  const txData = {
    chainId: `eip155:${Network.BASE}`,
    method: 'eth_sendTransaction',
    params: {
      to: BAL_VAULT_ADDR,
      data: `0x${hexSwapData}`,
      value: '0',
      gasLimit: gasLimit,
      maxFeePerGas: maxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
    },
  };
  console.log('txData', txData);

  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
