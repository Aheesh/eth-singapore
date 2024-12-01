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
      <body>{children}</body>
    </html>
  );
}
