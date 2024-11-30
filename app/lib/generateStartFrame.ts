import { createCanvas, loadImage } from '@napi-rs/canvas';

interface OddsData {
  playerA: { odds: number; payout: number };
  playerB: { odds: number; payout: number };
  draw: { odds: number; payout: number };
  poolSize: number;
}

export async function generateStartFrame(data: OddsData) {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 800, 800);

  // Set text styles
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';

  // Title
  ctx.font = 'bold 48px Arial';
  ctx.fillText('Ding vs Gukesh', 200, 100);

  // Header
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Player', 100, 200);
  ctx.fillText('ODDs', 300, 200);
  ctx.fillText('Potential Payout', 500, 200);

  // Player data
  ctx.font = '28px Arial';
  // Ding
  ctx.fillText('Ding', 100, 250);
  ctx.fillText(data.playerA.odds.toFixed(2), 300, 250);
  ctx.fillText(`${data.playerA.payout.toFixed(1)}x`, 500, 250);
  // Gukesh
  ctx.fillText('Gukesh', 100, 300);
  ctx.fillText(data.playerB.odds.toFixed(2), 300, 300);
  ctx.fillText(`${data.playerB.payout.toFixed(1)}x`, 500, 300);
  // Draw
  ctx.fillText('Draw', 100, 350);
  ctx.fillText(data.draw.odds.toFixed(2), 300, 350);
  ctx.fillText(`${data.draw.payout.toFixed(1)}x`, 500, 350);

  // Pool size
  ctx.font = 'bold 36px Arial';
  ctx.fillText(`DEGEN Pool size = ${data.poolSize} DEGEN`, 200, 450);

  return canvas.toBuffer('image/png');
} 