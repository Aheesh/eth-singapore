export const metadata = {
  title: 'Baller Chess Frame',
  description: 'Chess betting frame',
  openGraph: {
    title: 'Baller Chess',
    description: 'What are the odds?',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://eth-singapore-woad.vercel.app/api/generateImage',
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Ding',
    'fc:frame:button:2': 'Gukesh',
    'fc:frame:button:3': 'Draw',
    'fc:frame:post_url': 'https://eth-singapore-woad.vercel.app/api/frame',
  },
};

export default function FramePage() {
  return <h1>Baller Chess Frame</h1>
} 