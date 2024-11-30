import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { NextRequest } from 'next/server';
import { calculateSwapAmount } from '../../lib/calculation'; // Import your existing swap calculation logic

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const amount = searchParams.get('amount') || '1';
  const outcome = searchParams.get('outcome') || '';

  // Get swap calculations (implement based on your existing logic)
  const { absValue, tokenOut } = await calculateSwapAmount(amount, outcome);

  // Create canvas
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Configure text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '48px Arial';

  // Draw text
  ctx.fillText(`Swapping ${amount} DEGEN with ${outcome}`, width / 2, height / 2 - 50);
  ctx.fillText(`You will receive approximately ${absValue} ${tokenOut}`, width / 2, height / 2 + 50);

  // Convert canvas to buffer
  const image = canvas.toBuffer('image/png');

  // Return the image
  return new Response(image, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'max-age=10',
    },
  });
}
