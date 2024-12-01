export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata = {
  openGraph: {
    images: [{
      url: 'https://eth-singapore-woad.vercel.app/api/generateImage',
    }],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://eth-singapore-woad.vercel.app/api/generateImage',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://eth-singapore-woad.vercel.app/api/generateImage" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Ding" />
        <meta property="fc:frame:button:2" content="Gukesh" />
        <meta property="fc:frame:button:3" content="Draw" />
        <meta property="fc:frame:post_url" content="https://eth-singapore-woad.vercel.app/api/frame" />
      </head>
      <body>{children}</body>
    </html>
  );
}
