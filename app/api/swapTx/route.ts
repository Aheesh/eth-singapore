import dotenv from 'dotenv';
dotenv.config();
import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { BalancerSDK, Network, SwapType, Swaps } from '@balancer-labs/sdk';
import { balVaultAddr, degenAddr, poolId } from '../../config';
import { formatEther, parseUnits } from 'ethers';
import { calculateTokenAmount } from '../../lib/swapUtils';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  console.log('api/swapTx/route.ts : Swap Tx endpoint');

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  console.log('Raw state:', message?.state?.serialized);

  let state: { frame?: string; amount?: string; outcome?: string; txHash?: string } = {
    frame: 'start'
  };
  if (message?.state?.serialized) {
    try {
      const parsedState = JSON.parse(decodeURIComponent(message.state.serialized));
      state = { ...state, ...parsedState };
    } catch (e) {
      console.error('Error parsing state:', e);
    }
  }
  console.log('api/swapTx/route.ts :state =>', state);

  const amount = state.amount;
  const outcome = state.outcome ;
  console.log('api/swapTx/route.ts :amount =>', amount);
  console.log('api/swapTx/route.ts :outcome =>', outcome);

  if (!amount) {
    return new NextResponse('Amount is required', { status: 400 });
  }

  if (!outcome) {
    return new NextResponse('Outcome is required', { status: 400 });
  }

  const providerApiKey = process.env.BASE_PROVIDER_API_KEY;
  if (!providerApiKey) {
    return new NextResponse('Provider API key is required', { status: 400 });
  }
  const { absValue, tokenOut } = await calculateTokenAmount(amount, outcome);

  console.log(`queryInfo - Swap : You will receive ${absValue} ${tokenOut}`);

  const value = parseUnits(amount, 18);

  console.log('tokenIn', degenAddr);
  console.log('tokenOut', tokenOut);

  if (!poolId) throw new Error('poolId not set');
  if (!degenAddr) throw new Error('degenAddr not set');
  if (!tokenOut) throw new Error('tokenOut not set');

  // QueryBatchSwap to get the expected amount of tokens Out for confirmation
  const sdk = new BalancerSDK({
    network: Network.BASE,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
  });

  console.log('sdk', sdk);
  console.log('network', Network.BASE);
  const { contracts } = sdk;
  console.log('contracts', contracts.vault.address);

  const encodeBatchSwapData = Swaps.encodeBatchSwap({
    kind: SwapType.SwapExactIn,
    swaps: [
      {
        poolId: poolId,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: value.toString(),
        userData: '0x',
      },
    ],
    assets: [degenAddr, tokenOut],

    funds: {
      fromInternalBalance: false,
      recipient: message.address || '',
      sender: message.address || '',
      toInternalBalance: false,
    },
    limits: [value, '0'],
    deadline: Math.ceil(Date.now() / 1000) + 300,
  });

  console.log('encodeBatchSwapData', encodeBatchSwapData);
  // Convert encodeBatchSwapData to remove the leading 0x characters
  const hexSwapData = encodeBatchSwapData.slice(2);
  console.log('hexSwapData', hexSwapData);

  // Set gas parameters
  const gasLimit = parseUnits('300000', 'wei'); // Adjust as needed
  const maxFeePerGas = parseUnits('1', 'gwei'); // 1 gwei
  const maxPriorityFeePerGas = parseUnits('0.1', 'gwei'); // 0.1 gwei

  console.log('gasLimit', gasLimit);
  console.log('maxFeePerGas', maxFeePerGas);
  console.log('maxPriorityFeePerGas', maxPriorityFeePerGas);

  // Frame Transaction
  const txData = {
    chainId: `eip155:${Network.BASE}`,
    method: 'eth_sendTransaction',
    params: {
      to: balVaultAddr,
      data: `0x${hexSwapData}`,
      value: '0',
      gasLimit: gasLimit.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    },
  };
  console.log('txData', txData);

  // At the end of the function, update the state and return the response
  state = {
    ...state,
    frame: 'txSuccess',
    txHash: message.transaction?.hash || '',
  };
  const updatedSerializedState = encodeURIComponent(JSON.stringify(state));

  return NextResponse.json({
    ...txData,
    state: {
      serialized: updatedSerializedState,
    },
    postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';