import { NextResponse } from 'next/server';

export async function GET() {
  // Add your odds calculation logic here
  const odds = {
    'Player-A': 0.28,
    'Player-B': 0.38,
    'Draw': 0.34
  };

  return NextResponse.json(odds);
} 