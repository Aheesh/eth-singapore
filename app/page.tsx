import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Player A',
    },
    {
      label: 'Player B',
    },
    {
      label: 'Draw',
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/game1.webp`,
    aspectRatio: '1:1',
  },
  // input: {
  //   text: 'Tell me a story',
  // },
  postUrl: `${NEXT_PUBLIC_URL}/api/approve`,
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
      <h1>Let's get up and running - Baller Chess</h1>
    </>
  );
}
