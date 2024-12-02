import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import Link from 'next/link';
import { getPoolBalance } from './lib/balancer';

export async function generateMetadata(): Promise<Metadata> {
  let degenBalance = 0;
  try {
    const poolData = await getPoolBalance();
    degenBalance = parseFloat(poolData.balances[1]) - 1000;
    console.log('page.tsx DEGEN Balance 🧢💸🧢💸🧢💸 : degenBalance 💸🧢💸🧢💸', degenBalance);
  } catch (error) {
    console.error('Failed to fetch pool balance:', error);
  }

  const imageUrl = new URL('/api/og', NEXT_PUBLIC_URL);
  imageUrl.searchParams.append('text', 'Ding,Gukesh,Draw');
  imageUrl.searchParams.append('degenBalance', degenBalance.toFixed(2));
  imageUrl.searchParams.append('type', 'start');

  const frameMetadata = getFrameMetadata({
    buttons: [
      {
        label: 'Ding (28.21%)'
      },
      {
        label: 'Gukesh (38.72%)'
      },
      {
        label: 'Draw (33.07%)'
      }
    ],
    image: {
      src: imageUrl.toString(),
      aspectRatio: '1.91:1'
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`
  });

  return {
    title: 'Baller Chess',
    description: 'Lets get a market setup for a game of chess',
    openGraph: {
      title: 'Baller Chess',
      description: 'What are the odds?',
      images: [`${NEXT_PUBLIC_URL}/park-1.png`],
    },
    other: frameMetadata,
  };
}

export default function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Let's get up and running - Baller Chess</h1>
      
      <div className="flex flex-col space-y-4">
        <Link 
          href="/dashboard" 
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-xl text-center w-64"
        >
          View Dashboard
        </Link>
        
        <Link 
          href="/potentialWinnings" 
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-xl text-center w-64"
        >
          Potential Winnings
        </Link>
      </div>
    </>
  );
}
