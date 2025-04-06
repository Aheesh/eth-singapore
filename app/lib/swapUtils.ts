import { BalancerSDK, Network, SwapType } from '@balancer-labs/sdk';
import { parseUnits, formatEther } from 'ethers';
import { poolId, degenAddr, PLAYER_A_ADDR, PLAYER_B_ADDR, DRAW_ADDR } from '../config';
import { getPoolBalance } from './balancer';

export async function calculateTokenAmount(amount: string, outcome: string) {
  const providerApiKey = process.env.BASE_PROVIDER_API_KEY;
  if (!providerApiKey) throw new Error('BASE_PROVIDER_API_KEY not set');

  const value = parseUnits(amount, 18);

  const tokenIn = degenAddr;
  const tokenOut = outcome === 'Player A' ? PLAYER_A_ADDR :
                   outcome === 'Player B' ? PLAYER_B_ADDR :
                   DRAW_ADDR;

  if (!tokenIn || !tokenOut) throw new Error('Token addresses not set');

  const sdk = new BalancerSDK({
    network: Network.BASE,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
  });

  if (!poolId) throw new Error('poolId not set');

  // Get pool tokens to determine correct indices
  const poolData = await getPoolBalance();
  console.log('Pool tokens:', poolData.tokens);
  
  // Find indices of input and output tokens
  const tokenInIndex = poolData.tokens.findIndex((t: string) => t.toLowerCase() === tokenIn.toLowerCase());
  const tokenOutIndex = poolData.tokens.findIndex((t: string) => t.toLowerCase() === tokenOut.toLowerCase());
  
  if (tokenInIndex === -1 || tokenOutIndex === -1) {
    throw new Error('Token not found in pool');
  }

  console.log('Swap indices:', { tokenInIndex, tokenOutIndex });

  const swaps = [
    {
      poolId: poolId,
      assetInIndex: tokenInIndex,
      assetOutIndex: tokenOutIndex,
      amount: value.toString(),
      userData: '0x',
    },
  ];
  const assets = poolData.tokens;

  const queryInfo = await sdk.swaps.queryBatchSwap({
    kind: SwapType.SwapExactIn,
    swaps,
    assets,
  });

  const absValue = Math.abs(Number(formatEther(queryInfo[tokenOutIndex])));
  return { absValue, tokenOut };
}