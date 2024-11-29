'use client';
import { useEffect, useState } from 'react';

interface TokenHolder {
  address: string;
  balance: string;
}

interface BlockchainData {
  address: {
    playerA: TokenHolder[];
    playerB: TokenHolder[];
    draw: TokenHolder[];
    uniqueAddresses: string[];
  };
  poolBalance: {
    tokens: string[];
    balances: string[];
    lastChangeBlock: string;
  };
}

export default function Dashboard() {
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/blockchain');
        const data = await response.json();
        setBlockchainData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!blockchainData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6">
        {/* Token Holdings Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Token Holdings</h2>
          
          <div className="grid gap-4">
            {/* Player A */}
            <div>
              <h3 className="font-medium text-blue-600">Player A Holdings</h3>
              <div className="mt-2 space-y-2">
                {blockchainData.address.playerA.map((holder, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span className="text-sm font-mono">{holder.address}</span>
                    <span className="font-medium">{Number(holder.balance).toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Player B */}
            <div>
              <h3 className="font-medium text-green-600">Player B Holdings</h3>
              <div className="mt-2 space-y-2">
                {blockchainData.address.playerB.map((holder, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span className="text-sm font-mono">{holder.address}</span>
                    <span className="font-medium">{Number(holder.balance).toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Draw */}
            <div>
              <h3 className="font-medium text-purple-600">Draw Holdings</h3>
              <div className="mt-2 space-y-2">
                {blockchainData.address.draw.map((holder, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span className="text-sm font-mono">{holder.address}</span>
                    <span className="font-medium">{Number(holder.balance).toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pool Balance Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pool Balance</h2>
          <div className="space-y-2">
            {blockchainData.poolBalance.tokens.map((token, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <span className="text-sm font-mono">{token}</span>
                <span className="font-medium">
                  {Number(blockchainData.poolBalance.balances[index]).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Last Change Block: {blockchainData.poolBalance.lastChangeBlock}
          </div>
        </div>

        {/* Unique Addresses Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Unique Addresses ({blockchainData.address.uniqueAddresses.length})</h2>
          <div className="space-y-2">
            {blockchainData.address.uniqueAddresses.map((address, index) => (
              <div key={index} className="text-sm font-mono border-b pb-2">
                {address}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
