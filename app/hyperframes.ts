import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, DEGEN_ADDR, BAL_VAULT_ADDR, POOL_ID } from './config';

// Add this type definition
type FrameResult = string | { frame: string; [key: string]: any };

// Update the HyperFrame type definition
export type HyperFrame = {
  frame: string | ((text: string) => string);
  1: string | ((text: string, state?: any) => FrameResult) | (() => string);
  2?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  3?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  4?: string | ((text: string, state?: any) => FrameResult) | (() => string);
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}


export function getHyperFrame(
  frame: string,
  text: string,
  buttonNumber?: number,
  existingState: any = {}
): string {
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
    return nextFrame(text);
  } else {
    return nextFrame;
  }

}

// Define frames
addHyperFrame('start', {
  frame: getFrameHtmlResponse({
    buttons: [
      { label: 'Player A' },
      { label: 'Player B' },
      { label: 'Draw' },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/game1.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'start' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text) => ({ frame: 'selectAmount', outcome: 'Player-A' }),
  2: (text) => ({ frame: 'selectAmount', outcome: 'Player-B' }),
  3: (text) => ({ frame: 'selectAmount', outcome: 'Draw' }),
});

addHyperFrame('selectAmount', {
  frame: (text, state?: any) => getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: '100 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        action: 'tx',
        label: '200 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        action: 'tx',
        label: '300 DEGEN',
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
    state: { frame: 'selectAmount', outcome: state?.outcome },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text, state) => ({ frame: 'approve', amount: '1', outcome: state?.outcome }),
  2: (text, state) => ({ frame: 'approve', amount: '2', outcome: state?.outcome }),
  3: (text, state) => ({ frame: 'approve', amount: '3', outcome: state?.outcome }),
  4: 'start',
});


// Add a new frame for 'approve' that accepts a query parameter
addHyperFrame('approve', {
  frame: (text, state?: any) => {
    let amount;
    try {
      amount = new URL(text, 'http://dummy.com').searchParams.get('amount') || '100';
    } catch {
      amount = '100'; // fallback
    }
    
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
        src: `${NEXT_PUBLIC_URL}/confirm-swap.webp`,
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
      { label: 'SUCCESS' },
      { label: 'Start Again' },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/tx-success.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'txSuccess' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'start',
  2: 'start',
});