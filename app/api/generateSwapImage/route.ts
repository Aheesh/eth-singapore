import { NextRequest } from 'next/server';
import { calculateSwapAmount } from '../../lib/calculation';
import { svgResponse } from '../../lib/imageUtils';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const amount = searchParams.get('amount') || '1';
  const outcome = searchParams.get('outcome') || '';

  const { absValue, tokenOut } = await calculateSwapAmount(amount, outcome);

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <text x="600" y="265" font-family="Arial" font-size="48" fill="white" text-anchor="middle">
        Swapping ${amount} DEGEN with ${outcome}
      </text>
      <text x="600" y="365" font-family="Arial" font-size="48" fill="white" text-anchor="middle">
        You will receive approximately ${absValue} ${tokenOut}
      </text>
    </svg>
  `;

  return svgResponse(svg);
}
