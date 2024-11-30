import { NextResponse } from 'next/server';
import { generateStartFrame } from '../../lib/generateStartFrame';
import { NEXT_PUBLIC_URL } from '../../config';

export async function GET() {
  try {
    const response = await fetch(`${NEXT_PUBLIC_URL}/api/blockchain`);
    const data = await response.json();
    
    // Calculate odds and payouts using your existing logic
    const oddsData = {
      playerA: { odds: 0.28, payout: 2.1 },
      playerB: { odds: 0.38, payout: 1.4 },
      draw: { odds: 0.34, payout: 1.6 },
      poolSize: 27
    };
    
    const imageBuffer = await generateStartFrame(oddsData);
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
} 