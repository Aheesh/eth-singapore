'use client';
import { useEffect, useState } from 'react';
import { publicBalVaultAddr as balVaultAddr, publicDegenAddr as degenAddr } from '../config';

interface WinningsData {
  totalPrizePool: number;
  payouts: {
    playerA: number;
    playerB: number;
    draw: number;
  };
}

const REFRESH_INTERVAL = 1000; // Refresh every 10 seconds

export default function PotentialWinnings() {
  if (!balVaultAddr) throw new Error('balVaultAddr not set');
  if (!degenAddr) throw new Error('degenAddr not set');
  const [winningsData, setWinningsData] = useState<WinningsData | null>(null);

  const calculateWinnings = async () => {
    if (!balVaultAddr) throw new Error('balVaultAddr not set');
    if (!degenAddr) throw new Error('degenAddr not set');
    
    try {
      // Add timestamp to URL to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/blockchain?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await response.json();
      const vaultAddr = balVaultAddr.toLowerCase();  // Store lowercase once

      // Get total prize pool (DEGEN token balance)
      const degenTokenIndex = data.poolBalance.tokens.findIndex(
        (token: string) => token.toLowerCase() === (degenAddr as string).toLowerCase()
      );
      const totalDegenInPool = Number(data.poolBalance.balances[degenTokenIndex]);
      const LP_DEGEN_AMOUNT = 50;
      const totalPrizePool = totalDegenInPool - LP_DEGEN_AMOUNT;

      // Calculate sums using stored vaultAddr
      const playerASum = data.address.playerA
        .filter((holder: any) => holder.address.toLowerCase() !== vaultAddr)
        .reduce((sum: number, holder: any) => sum + Number(holder.balance), 0);

      const playerBSum = data.address.playerB
        .filter((holder: any) => holder.address.toLowerCase() !== vaultAddr)
        .reduce((sum: number, holder: any) => sum + Number(holder.balance), 0);

      const drawSum = data.address.draw
        .filter((holder: any) => holder.address.toLowerCase() !== vaultAddr)
        .reduce((sum: number, holder: any) => sum + Number(holder.balance), 0);

      setWinningsData({
        totalPrizePool,
        payouts: {
          playerA: totalPrizePool / playerASum,
          playerB: totalPrizePool / playerBSum,
          draw: totalPrizePool / drawSum,
        }
      });
    } catch (error) {
      console.error('Error calculating winnings:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    calculateWinnings();

    // Set up interval for periodic refresh
    const intervalId = setInterval(calculateWinnings, REFRESH_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (!winningsData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Potential Winnings</h1>

      {/* Total Prize Pool */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Total Prize Pool</h2>
        <p className="text-3xl font-bold text-green-600">
          {winningsData.totalPrizePool.toFixed(2)} DEGEN
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Auto-refreshes every {REFRESH_INTERVAL / 1000} seconds
        </p>
      </div>

      {/* Payouts Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Potential Payouts</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Outcome</th>
              <th className="border-b py-2">Player A</th>
              <th className="border-b py-2">Player B</th>
              <th className="border-b py-2">Draw</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b py-2 font-medium">Payout Ratio</td>
              <td className="border-b py-2">{winningsData.payouts.playerA.toFixed(2)}x</td>
              <td className="border-b py-2">{winningsData.payouts.playerB.toFixed(2)}x</td>
              <td className="border-b py-2">{winningsData.payouts.draw.toFixed(2)}x</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 