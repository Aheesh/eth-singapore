import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chess Prediction App',
  description: 'Predict the game winner using DEGEN tokens',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
