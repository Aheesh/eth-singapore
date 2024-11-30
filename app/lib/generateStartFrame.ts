import sharp from 'sharp';

interface OddsData {
  playerA: { odds: number; payout: number };
  playerB: { odds: number; payout: number };
  draw: { odds: number; payout: number };
  poolSize: number;
}

export async function generateStartFrame(data: OddsData) {
  const svg = `
    <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      
      <!-- Title -->
      <text x="200" y="100" font-family="Arial" font-size="48" font-weight="bold" fill="white">Ding vs Gukesh</text>
      
      <!-- Header -->
      <text x="100" y="200" font-family="Arial" font-size="32" font-weight="bold" fill="white">Player</text>
      <text x="300" y="200" font-family="Arial" font-size="32" font-weight="bold" fill="white">ODDs</text>
      <text x="500" y="200" font-family="Arial" font-size="32" font-weight="bold" fill="white">Potential Payout</text>
      
      <!-- Player data -->
      <text x="100" y="250" font-family="Arial" font-size="28" fill="white">Ding</text>
      <text x="300" y="250" font-family="Arial" font-size="28" fill="white">${data.playerA.odds.toFixed(2)}</text>
      <text x="500" y="250" font-family="Arial" font-size="28" fill="white">${data.playerA.payout.toFixed(1)}x</text>
      
      <text x="100" y="300" font-family="Arial" font-size="28" fill="white">Gukesh</text>
      <text x="300" y="300" font-family="Arial" font-size="28" fill="white">${data.playerB.odds.toFixed(2)}</text>
      <text x="500" y="300" font-family="Arial" font-size="28" fill="white">${data.playerB.payout.toFixed(1)}x</text>
      
      <text x="100" y="350" font-family="Arial" font-size="28" fill="white">Draw</text>
      <text x="300" y="350" font-family="Arial" font-size="28" fill="white">${data.draw.odds.toFixed(2)}</text>
      <text x="500" y="350" font-family="Arial" font-size="28" fill="white">${data.draw.payout.toFixed(1)}x</text>
      
      <!-- Pool size -->
      <text x="200" y="450" font-family="Arial" font-size="36" font-weight="bold" fill="white">DEGEN Pool size = ${data.poolSize} DEGEN</text>
    </svg>
  `;

  return await sharp(Buffer.from(svg))
    .png()
    .toBuffer();
} 