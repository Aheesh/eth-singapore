import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL, degenAddr, balVaultAddr, poolId } from './config';
import { calculateTokenAmount } from '../app/lib/swapUtils';
import { getPoolBalance } from './lib/balancer';

// Add this type definition
type FrameResult = string | { frame: string; [key: string]: any };
type FrameResponse = {
  image: string;
  buttons: { label: string }[];
  postUrl: string;
};

// Update the HyperFrame type definition
export type HyperFrame = {
  frame: string | ((text: string, state?: any) => string | Promise<string>);
  1: string | ((text: string, state?: any) => FrameResult) | (() => string);
  2?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  3?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  4?: string | ((text: string, state?: any) => FrameResult) | (() => string);
  poolStats?: (state: any) => FrameResponse;
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
  
  // If this is a direct frame call (no button number), use the frame directly
  if (!buttonNumber) {
    const nextFrame = currentFrame.frame;
    if (typeof nextFrame === 'function') {
      console.log('Calling nextFrame function with text and state:', { text, existingState });
      return await nextFrame(text, existingState);
    } else {
      return nextFrame;
    }
  }
  
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
      src: `${NEXT_PUBLIC_URL}/api/og?type=selectAmount`,
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
        text: `${amount} DEGEN will be swapped for ${absValue} ${outcome} tokens. Confirm swap?`,
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
  frame: (text, state?: any) => {
    console.log('txSuccess frame state:', state);
    
    const params = new URLSearchParams();
    params.append('type', 'txSuccess');
    params.append('amount', state?.amount || '0');
    params.append('outcome', state?.outcome || '');
    
    // Format tokens received with more decimal places
    const tokensReceived = state?.tokensReceived || '0';
    const formattedTokens = parseFloat(tokensReceived).toFixed(10);
    console.log('Formatted tokens in txSuccess:', formattedTokens);
    params.append('tokensReceived', formattedTokens);
    
    params.append('txHash', state?.txHash || '');

    return getFrameHtmlResponse({
      image: `${NEXT_PUBLIC_URL}/api/og?${params.toString()}`,
      buttons: [
        { label: 'Bet Again' },
        { label: 'View Pool' }
      ],
      state: { 
        frame: 'txSuccess',
        amount: state?.amount,
        outcome: state?.outcome,
        tokensReceived: formattedTokens,
        txHash: state?.txHash
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });
  },
  1: 'start',
  2: (text, state) => ({ 
    frame: 'poolStats',
    totalPool: '1000', // Example value, replace with actual data
    playerABets: '400',
    playerBBets: '350',
    drawBets: '250',
    playerAOdds: '0.28',
    playerBOdds: '0.36',
    drawOdds: '0.36'
  }),
});

// Add the poolStats frame
addHyperFrame('poolStats', {
  frame: (text, state?: any) => {
    console.log('poolStats frame state:', state);
    
    const params = new URLSearchParams();
    params.append('type', 'poolStats');
    params.append('totalPool', state?.totalPool || '0');
    params.append('playerABets', state?.playerABets || '0');
    params.append('playerBBets', state?.playerBBets || '0');
    params.append('drawBets', state?.drawBets || '0');
    params.append('playerAOdds', state?.playerAOdds || '0.28');
    params.append('playerBOdds', state?.playerBOdds || '0.36');
    params.append('drawOdds', state?.drawOdds || '0.36');

    return getFrameHtmlResponse({
      image: `${NEXT_PUBLIC_URL}/api/og?${params.toString()}`,
      buttons: [
        { label: 'Place Bet' },
        { label: 'Refresh Stats' }
      ],
      state: {
        frame: 'poolStats',
        totalPool: state?.totalPool,
        playerABets: state?.playerABets,
        playerBBets: state?.playerBBets,
        drawBets: state?.drawBets,
        playerAOdds: state?.playerAOdds,
        playerBOdds: state?.playerBOdds,
        drawOdds: state?.drawOdds
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    });
  },
  1: 'start',
  2: (text, state) => ({ 
    frame: 'poolStats',
    totalPool: state?.totalPool,
    playerABets: state?.playerABets,
    playerBBets: state?.playerBBets,
    drawBets: state?.drawBets,
    playerAOdds: state?.playerAOdds,
    playerBOdds: state?.playerBOdds,
    drawOdds: state?.drawOdds
  }),
});