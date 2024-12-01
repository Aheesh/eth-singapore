import { NextResponse } from 'next/server';
import { generateStartFrame } from '../../lib/generateStartFrame';
import { getOdds } from '../../lib/odds';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Handle OPTIONS preflight request
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://warpcast.com',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}

export async function GET(request: Request) {
    try {
        const svgContent = await generateStartFrame(oddsData);
        
        return new NextResponse(svgContent, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Access-Control-Allow-Origin': 'https://warpcast.com',
                'Access-Control-Allow-Methods': 'GET',
                'Cache-Control': 'no-store, must-revalidate',
                'Vary': 'Origin',
            },
        });
    } catch (error) {
        console.error('Image generation error:', error);
        return new NextResponse('Error generating image', { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': 'https://warpcast.com'
            }
        });
    }
} 