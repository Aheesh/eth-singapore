import { NextResponse } from 'next/server';
import { generateStartFrame } from '../../lib/generateStartFrame';
import { getOdds } from '../../lib/odds';

export const runtime = 'edge';

export async function GET() {
  try {
    const oddsData = getOdds();
    const svgContent = await generateStartFrame(oddsData);
    
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
} 