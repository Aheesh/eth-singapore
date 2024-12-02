import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, DEGEN_ADDR, BAL_VAULT_ADDR, POOL_ID } from './config';
import { calculateTokenAmount } from '../app/lib/swapUtils';
import { getPoolBalance } from './lib/balancer';

// Add this type definition
type FrameResult = string | { frame: string; [key: string]: any };

// Update the HyperFrame type definition
export type HyperFrame = {
  frame: string | ((text: string, state?: any) => string | Promise<string>);
  1: string | ((text: string, state?: any) => FrameResult) | (() => string);
  2?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  3?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  4?: string | ((text: string, state?: any) => FrameResult) | (() => string);
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}


export async function getHyperFrame(
  frame: string,
  text: string,
  buttonNumber?: number,
  existingState: any = {}
): Promise<string> {
  // Add debug logging
  console.log('getHyperFrame existingState:', existingState);
  
  // Extract base frame name and query params
  const [baseFrame, queryString] = frame.split('?');
  const params = new URLSearchParams(queryString || '');
  const currentFrame = frames[baseFrame];
  if (!currentFrame) {
    throw new Error(`Frame not found: ${baseFrame}`);
  }
  console.log('hyperframes.ts : currentFrame =>', currentFrame);
  console.log('hyperframes.ts : baseFrame =>', baseFrame);
  console.log('hyperframes.ts : frames =>', frames);
  
  const nextFrameIdOrFunction = currentFrame[buttonNumber as keyof HyperFrame];

  let nextFrameId: string;
  let newState: any = { ...existingState };
  if (typeof nextFrameIdOrFunction === 'function') {
    const result = nextFrameIdOrFunction(text, existingState);
    if (typeof result === 'string') {
      nextFrameId = result;
    } else if (typeof result === 'object' && result !== null && 'frame' in result) {
      nextFrameId = result.frame;
      newState = { ...newState, ...result };
    } else {
      throw new Error('Invalid result from nextFrameIdOrFunction');
    }
  } else if (typeof nextFrameIdOrFunction === 'string') {
    nextFrameId = nextFrameIdOrFunction;
  } else {
    throw new Error('Invalid nextFrameIdOrFunction type');
  }


  if (!frames[nextFrameId]) {
    throw new Error(`Frame not found: ${nextFrameId}`);
  }

  console.log('hyperframes.ts : nextFrameId =>', nextFrameId);
  console.log('hyperframes.ts : frames[nextFrameId] =>', frames[nextFrameId]);
  
  const nextFrame = frames[nextFrameId].frame;
  if (typeof nextFrame === 'function') {
    console.log('Calling nextFrame function with text and state:', { text, newState });
    return await nextFrame(text, newState);
  } else {
    return nextFrame;
  }

}

// Define frames
addHyperFrame('start', {
  frame: async () => {
    // Fetch pool balance
    const poolData = await getPoolBalance();
    const degenBalance = parseFloat(poolData.balances[1]) - 1000; // Subtract initial 1000 DEGEN LP

    return getFrameHtmlResponse({
      buttons: [
        { label: 'Ding (28.21%)' },
        { label: 'Gukesh (38.72%)' },
        { label: 'Draw (33.07%)' },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/og?text=Ding vs Gukesh%0A%0AOdds:%0ADing: 28.21%25%0AGukesh: 38.72%25%0ADraw: 33.07%25%0A%0ADEGEN Prize Pool: ${degenBalance.toFixed(2)} DEGEN`,
        aspectRatio: '1:1',
      },
      state: { frame: 'start' },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });
  },
  1: (text) => ({ frame: 'selectAmount', outcome: 'Player-A' }),
  2: (text) => ({ frame: 'selectAmount', outcome: 'Player-B' }),
  3: (text) => ({ frame: 'selectAmount', outcome: 'Draw' }),
});

addHyperFrame('selectAmount', {
  frame: (text, state?: any) => getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: '1 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        action: 'tx',
        label: '2 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        action: 'tx',
        label: '3 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        label: 'CANCEL',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/select-amount.webp`,
      aspectRatio: '1:1',
    },
    state: { 
      frame: 'selectAmount',
      outcome: state?.outcome 
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text, state) => ({ frame: 'approve', amount: '1', outcome: state?.outcome }),
  2: (text, state) => ({ frame: 'approve', amount: '2', outcome: state?.outcome }),
  3: (text, state) => ({ frame: 'approve', amount: '3', outcome: state?.outcome }),
  4: 'start',
});



addHyperFrame('approve', {
  frame: async (text, state?: any) => {
    const amount = state?.amount 
    const outcome = state?.outcome
    
    // Calculate expected tokens
    const providerApiKey = process.env.BASE_PROVIDER_API_KEY ?? '';
    if (!providerApiKey) throw new Error('BASE_PROVIDER_API_KEY is not defined');
    const { absValue } = await calculateTokenAmount(amount, outcome, providerApiKey);
    const absValueNumber = Number(absValue);
    
    // Format the outcome message
    const outcomeLabel = outcome === 'Player-A' ? 'Player A' :
                        outcome === 'Player-B' ? 'Player B' : 
                        'Draw';
    
    return getFrameHtmlResponse({
      buttons: [
        {
          action: 'tx',
          label: 'Swap Approve',
          target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=${amount}`,
        },
        {
          label: 'Cancel',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/og?text=You will receive approximately ${absValueNumber.toFixed(2)} tokens for ${outcomeLabel} as winning outcome`,
        aspectRatio: '1:1',
      },
      state: { frame: 'approve', amount, outcome: state?.outcome },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });
  },
  1: 'txSuccess',
  2: 'start',
});

addHyperFrame('txSuccess', {
  frame: getFrameHtmlResponse({
    buttons: [
      { label: 'Start Again' }
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/tx-success.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'txSuccess' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'start'
});