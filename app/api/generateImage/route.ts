import { NextResponse } from 'next/server';
import { generateStartFrame } from '../../lib/generateStartFrame';
import { getOdds } from '../../lib/odds';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const oddsData = getOdds();
    const svgContent = await generateStartFrame(oddsData);
    
    // Add a small delay to ensure headers are set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-store',
        'Vary': '*',
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
} 