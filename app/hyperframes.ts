import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from './config';

export type HyperFrame = {
  frame: string;
  1: string | ((text: string) => string | { frame: string; amount: string; [key: string]: any });
  2?: string | ((text: string) => string | { frame: string; amount: string; [key: string]: any });
  3?: string | ((text: string) => string | { frame: string; amount: string; [key: string]: any });
  4?: string | ((text: string) => string | { frame: string; amount: string; [key: string]: any });
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}

export function getHyperFrame(frame: string, text: string, button: number, existingState: any = {}) {
  console.log('hyperframes.ts : frame =>', frame);
  console.log('hyperframes.ts : frames =>', frames);
  const currentFrame = frames[frame];
  console.log('hyperframes.ts : currentFrame =>', currentFrame);
  const nextFrameIdOrFunction = currentFrame[button as keyof HyperFrame];
  console.log('hyperframes.ts : nextFrameIdOrFunction =>', nextFrameIdOrFunction);

  let nextFrameId: string;
  let newState: any = {};
  if (typeof nextFrameIdOrFunction === 'function') {
    const result = nextFrameIdOrFunction(text);
    if (typeof result === 'string') {
      nextFrameId = result;
    } else if (typeof result === 'object' && result !== null && 'frame' in result) {
      nextFrameId = result.frame;
      newState = result;
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

  //Merge existing state with new frame state and new state
  const mergedState = { ...existingState, ...newState, frame: nextFrameId };
  console.log('hyperframes.ts : mergedState =>', mergedState);

  //Create a new frame response with the merged state
  const newFrameResponse = frames[nextFrameId].frame.replace(
    /"state":\s*{[^}]*}/,
    `"state": ${JSON.stringify(mergedState)}`
  );
  return newFrameResponse;
}

addHyperFrame('start', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        label: 'Player A',
      },
      {
        label: 'Player B',
      },
      {
        label: 'Draw ',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/game1.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'start' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'Player-A',
  2: 'Player-B',
  3: 'Draw',
});

addHyperFrame('Player-A', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: '100 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx?amount=100`,
      },
      {
        action: 'tx',
        label: '200 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx?amount=200`,
      },
      {
        action: 'tx',
        label: '300 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx?amount=300`,
      },
      {
        label: 'CANCEL',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`,
      aspectRatio: '1:1',
    },
    state: { frame: 'Player-A' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text) => ({ frame: 'approve', amount: '100' }),
  2: (text) => ({ frame: 'approve', amount: '200' }),
  3: (text) => ({ frame: 'approve', amount: '300' }),
  4: 'start',
});

addHyperFrame('Player-B', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: '100 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=100`,
      },
      {
        action: 'tx',
        label: '200 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=200`,
      },
      {
        action: 'tx',
        label: '300 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=300`,
      },
      {
        label: 'CANCEL',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`,
      aspectRatio: '1:1',
    },
    state: { frame: 'Player-B' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text) => ({ frame: 'approve', amount: '100' }),
  2: (text) => ({ frame: 'approve', amount: '200' }),
  3: (text) => ({ frame: 'approve', amount: '300' }),
  4: 'start',
});

addHyperFrame('Draw', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: '100 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=100`,
      },
      {
        action: 'tx',
        label: '200 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=200`,
      },
      {
        action: 'tx',
        label: '300 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/swapTx?amount=300`,
      },
      {
        label: 'CANCEL',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`,
      aspectRatio: '1:1',
    },
    state: { frame: 'Draw' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text) => ({ frame: 'approve', amount: '100' }),
  2: (text) => ({ frame: 'approve', amount: '200' }),
  3: (text) => ({ frame: 'approve', amount: '300' }),
  4: 'start',
});

addHyperFrame('approve', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: 'Swap Approve',
        target: `${NEXT_PUBLIC_URL}/api/swapTx`,
      },
      {
        label: 'Cancel',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/game1.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'approve' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'txSuccess',
  2: 'start',
});

addHyperFrame('txSuccess', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        label: 'SUCCESS',
      },
      {
        label: 'Start Again',
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-2.png`,
      aspectRatio: '1:1',
    },
    state: { frame: 'txSuccess' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'start',
  2: 'start',
});
