import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, DEGEN_ADDR, BAL_VAULT_ADDR, POOL_ID } from './config';

// Update the HyperFrame type definition
export type HyperFrame = {
  frame: string;
  1: string | ((text: string, state: any) => string | { frame: string; amount?: string; outcome?: string });
  2?: string | ((text: string, state: any) => string | { frame: string; amount?: string; outcome?: string });
  3?: string | ((text: string, state: any) => string | { frame: string; amount?: string; outcome?: string });
  4?: string | ((text: string, state: any) => string | { frame: string; amount?: string; outcome?: string });
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}

export function getHyperFrame(frame: string, text: string, button: number, existingState: any = {}) {
  const currentFrame = frames[frame];
  const nextFrameIdOrFunction = currentFrame[button as keyof HyperFrame];

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

  newState.frame = nextFrameId;
  const serializedState = encodeURIComponent(JSON.stringify(newState));
  const newFrameResponse = frames[nextFrameId].frame.replace(
    /"state":\s*{[^}]*}/,
    `"state": {"serialized": "${serializedState}"}`
  );
  return newFrameResponse;
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
      { label: '100 DEGEN' },
      { label: '200 DEGEN' },
      { label: '300 DEGEN' },
      { label: 'Cancel' },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/select-amount.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'selectAmount' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text, state) => ({ ...state, frame: 'approve', amount: '100' }),
  2: (text, state) => ({ ...state, frame: 'approve', amount: '200' }),
  3: (text, state) => ({ ...state, frame: 'approve', amount: '300' }),
  4: (text, state) => ({ ...state, frame: 'start' }),
});

addHyperFrame('approve', {
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
      src: `${NEXT_PUBLIC_URL}/approve.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'approve' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'confirmSwap',
  2: 'start',
});

addHyperFrame('confirmSwap', {
  frame: getFrameHtmlResponse({
    buttons: [
      {
        action: 'tx',
        label: 'Confirm Swap',
        target: `${NEXT_PUBLIC_URL}/api/swapTx`,
      },
      { label: 'Cancel' },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/confirm-swap.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'confirmSwap' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: (text: string, state: any) => ({ ...state, frame: 'txSuccess' }),
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