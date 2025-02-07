import { BalancerSDK, Network, SwapType } from '@balancer-labs/sdk';
import { parseUnits, formatEther } from 'ethers';
import { poolId, degenAddr, PLAYER_A_ADDR, PLAYER_B_ADDR, DRAW_ADDR } from '../config';

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

  const swaps = [
    {
      poolId: poolId,
      assetInIndex: 0,
      assetOutIndex: 1,
      amount: value.toString(),
      userData: '0x',
    },
  ];
  const assets = [tokenIn, tokenOut];

  const queryInfo = await sdk.swaps.queryBatchSwap({
    kind: SwapType.SwapExactIn,
    swaps,
    assets,
  });

  const absValue = Math.abs(Number(formatEther(queryInfo[1])));
  return { absValue, tokenOut };
}