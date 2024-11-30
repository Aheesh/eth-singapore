import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import Link from 'next/link';
import { getOdds } from '../app/lib/odds';

const odds = getOdds();

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: `Ding`,
    },
    {
      label: `Gukesh`,
    },
    {
      label: `Draw`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/game1.webp`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Baller Chess',
  description: 'Lets get a market setup for a game of chess',
  openGraph: {
    title: 'Baller Chess',
    description: 'What are the odds?',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

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
