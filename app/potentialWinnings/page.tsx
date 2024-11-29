'use client';
import { useEffect, useState } from 'react';

interface WinningsData {
  totalPrizePool: number;
  payouts: {
    playerA: number;
    playerB: number;
    draw: number;
  };
}

const BAL_VAULT_ADDR = '0xba12222222228d8ba445958a75a0704d566bf2c8';
const DEGEN_TOKEN_ADDR = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed';

export default function PotentialWinnings() {
  const [winningsData, setWinningsData] = useState<WinningsData | null>(null);

  useEffect(() => {
    const calculateWinnings = async () => {
      try {
        const response = await fetch('/api/blockchain');
        const data = await response.json();

        // Get total prize pool (DEGEN token balance)
        const degenTokenIndex = data.poolBalance.tokens.findIndex(
          (token: string) => token.toLowerCase() === DEGEN_TOKEN_ADDR.toLowerCase()
        );
        const totalPrizePool = Number(data.poolBalance.balances[degenTokenIndex]);

        // Calculate sum of tokens excluding BAL_VAULT_ADDR
        const playerASum = data.address.playerA
          .filter((holder: any) => holder.address.toLowerCase() !== BAL_VAULT_ADDR.toLowerCase())
          .reduce((sum: number, holder: any) => sum + Number(holder.balance), 0);

        const playerBSum = data.address.playerB
          .filter((holder: any) => holder.address.toLowerCase() !== BAL_VAULT_ADDR.toLowerCase())
          .reduce((sum: number, holder: any) => sum + Number(holder.balance), 0);

        const drawSum = data.address.draw
          .filter((holder: any) => holder.address.toLowerCase() !== BAL_VAULT_ADDR.toLowerCase())
          .reduce((sum: number, holder: any) => sum + Number(holder.balance), 0);

        // Calculate potential payouts
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

    calculateWinnings();
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