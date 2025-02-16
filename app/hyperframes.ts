import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, degenAddr, balVaultAddr, poolId } from './config';
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
    const degenBalance = parseFloat(poolData.balances[1]) - 50; // TODO Subtract initial 50 DEGEN LP
    console.log('DEGEN Balance 🧢🧢🧢 : degenBalance 🧢🧢🧢', degenBalance);

    // Construct the text with all parameters included
    const params = new URLSearchParams({
      text: 'Player-A,Player-B,Draw', // Include all outcomes to show all cards
      degenBalance: degenBalance.toFixed(2),
      type: 'start'
    });

    return getFrameHtmlResponse({
      buttons: [
        { label: 'Player-A (0.28)' },
        { label: 'Player-B (0.36)' },
        { label: 'Draw (0.36)' },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/og?${params.toString()}`,
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
    try {
      const amount = state?.amount;
      const outcome = state?.outcome;
      
      // Calculate expected tokens even after approval
      const { absValue } = await calculateTokenAmount(amount, outcome);
      
      const params = new URLSearchParams({
        text: `Swap ${amount} DEGEN for ${absValue} ${outcome} tokens?`,
        type: 'approve'
      });

      return getFrameHtmlResponse({
        buttons: [
          {
            action: 'tx',
            label: 'Confirm Swap',
            target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=${amount}`,
          },
          {
            label: 'Cancel',
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/api/og?${params.toString()}`,
          aspectRatio: '1:1',
        },
        state: { 
          frame: 'approve', 
          amount, 
          outcome,
          expectedTokens: absValue
        },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      });
    } catch (error) {
      console.error('Error in approve frame:', error);
      return getFrameHtmlResponse({
        buttons: [{ label: 'Try Again' }],
        image: {
          src: `${NEXT_PUBLIC_URL}/error.webp`,
          aspectRatio: '1:1',
        },
        state: { frame: 'start' },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      });
    }
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