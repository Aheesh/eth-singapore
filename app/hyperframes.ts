import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from './config';

export type HyperFrame = {
  frame: string;
  1: string | ((text: string) => string) | (() => string);
  2?: string | ((text: string) => string) | (() => string);
  3?: string | ((text: string) => string) | (() => string);
  4?: string | ((text: string) => string) | (() => string);
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}

export function getHyperFrame(frame: string, text: string, button: number) {
  console.log('hyperframes.ts : frame =>', frame);
  console.log('hyperframes.ts : frames =>', frames);
  const currentFrame = frames[frame];
  console.log('hyperframes.ts : currentFrame =>', currentFrame);
  const nextFrameIdOrFunction = currentFrame[button as keyof HyperFrame];
  console.log('hyperframes.ts : nextFrameIdOrFunction =>', nextFrameIdOrFunction);

  let nextFrameId: string;
  if (typeof nextFrameIdOrFunction === 'function') {
    nextFrameId = nextFrameIdOrFunction(text);
  } else {
    nextFrameId = nextFrameIdOrFunction as string;
  }

  if (!frames[nextFrameId]) {
    throw new Error(`Frame not found: ${nextFrameId}`);
  }

  console.log('hyperframes.ts : nextFrameId =>', nextFrameId);
  console.log('hyperframes.ts : frames[nextFrameId] =>', frames[nextFrameId]);
  return frames[nextFrameId].frame;
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
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        action: 'tx',
        label: '200 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
      },
      {
        action: 'tx',
        label: '500 DEGEN',
        target: `${NEXT_PUBLIC_URL}/api/approveTx`,
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
  1: 'approve',
  2: 'approve',
  3: 'approve',
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
      src: `${NEXT_PUBLIC_URL}/cave-1.png`,
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
      src: `${NEXT_PUBLIC_URL}/cave-2.png`,
      aspectRatio: '1:1',
    },
    state: { frame: 'Draw' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'approve',
  2: 'approve',
  3: 'approve',
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
      src: `${NEXT_PUBLIC_URL}/desert-lost.webp`,
      aspectRatio: '1:1',
    },
    state: { frame: 'txSuccess' },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }),
  1: 'start',
  2: 'start',
});
