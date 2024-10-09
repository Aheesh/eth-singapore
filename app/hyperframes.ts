import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, DEGEN_ADDR, BAL_VAULT_ADDR, POOL_ID } from './config';

// Update the HyperFrame type definition
export type HyperFrame = {

  frame: string | ((text: string) => string);
  1: string | ((text: string) => string) | (() => string);
  2?: string | ((text: string) => string) | (() => string);
  3?: string | ((text: string) => string) | (() => string);
  4?: string | ((text: string) => string) | (() => string);

};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}


export function getHyperFrame(
  frame: string,
  text: string,
  buttonNumber?: number
): string {
  console.log('hyperframes.ts : frame =>', frame);
  console.log('hyperframes.ts : frames =>', frames);
  const currentFrame = frames[frame];
  console.log('hyperframes.ts : currentFrame =>', currentFrame);
  const nextFrameIdOrFunction = currentFrame[buttonNumber as keyof HyperFrame];
  console.log('hyperframes.ts : nextFrameIdOrFunction =>', nextFrameIdOrFunction);


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
  frame: getFrameHtmlResponse({
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
    state: { frame: 'selectAmount' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text) => `approve?amount=100`,
  2: (text) => `approve?amount=200`,
  3: (text) => `approve?amount=300`,
  4: 'start',
});

addHyperFrame('Player-B', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        label: '100 DEGEN',
      },
      {
        label: '200 DEGEN',
      },
      {
        label: '500 DEGEN',
      },
      {
        label: 'CANCEL',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-2.png`,
      aspectRatio: '1:1',
    },
    state: { frame: 'Player-B' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'approve',
  2: 'approve',
  3: 'approve',
  4: 'start',
});

addHyperFrame('Draw', {

  frame: getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: 'Approve DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      { label: 'Cancel' },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-3.png`,

      aspectRatio: '1:1',
    },
    state: { frame: 'approve' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'confirmSwap',
  2: 'start',
});

// Add a new frame for 'approve' that accepts a query parameter
addHyperFrame('approve', {
  frame: (text) => {
    const amount = new URL(text, 'http://dummy.com').searchParams.get('amount');
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
        src: `${NEXT_PUBLIC_URL}/park-4.png`,
        aspectRatio: '1:1',
      },
      state: { frame: 'approve', amount },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });
  },
  1: (text) => {
    const amount = new URL(text, 'http://dummy.com').searchParams.get('amount');
    return `txSuccess?amount=${amount}`;
  },

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