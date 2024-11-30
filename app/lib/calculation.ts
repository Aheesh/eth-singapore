import { BalancerSDK, Network, SwapType } from '@balancer-labs/sdk';
import { DEGEN_ADDR, PLAYER_A_ADDR, PLAYER_B_ADDR, DRAW_ADDR, POOL_ID } from '../config';
import { formatEther, parseUnits } from 'ethers';

export async function calculateSwapAmount(amount: string, outcome: string) {
    const value = parseUnits(amount, 18);
    
    const tokenIn = DEGEN_ADDR;
    const tokenOut = outcome === 'Ding' ? PLAYER_A_ADDR :
                    outcome === 'Gukesh' ? PLAYER_B_ADDR :
                    DRAW_ADDR;

    const providerApiKey = process.env.BASE_PROVIDER_API_KEY;
    
    const sdk = new BalancerSDK({
        network: Network.BASE,
        rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
    });

    const swaps = [{
        poolId: POOL_ID,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: value.toString(),
        userData: '0x',
    }];
    
    const assets = [tokenIn, tokenOut];

    const queryInfo = await sdk.swaps.queryBatchSwap({
        kind: SwapType.SwapExactIn,
        swaps,
        assets,
    });

    const absValue = Math.abs(Number(formatEther(queryInfo[1])));

    return {
        absValue: absValue.toString(),
        tokenOut
    };
}
