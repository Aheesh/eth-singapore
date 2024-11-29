'use client';

import { useState, useEffect } from 'react';
import { getAddressFromBlockscout } from '../../bal-join/script/05getAddressBlockscoutAPI';
import getPoolTokenBalance from '../../bal-join/script/06balancerPoolTokenBalance';
// Import your existing Farcaster Frame components
import { YourExistingFrameComponent } from '../components/YourExistingFrameComponent';

// Define types for your blockchain data
interface TokenBalance {
  // Add properties based on your TokenBalance type
}

interface BlockchainData {
  address: {
    playerA: TokenBalance[];
    playerB: TokenBalance[];
    draw: TokenBalance[];
    uniqueAddresses: string[];
  };
  poolBalance: {
    tokens: any;
    balances: any;
    lastChangeBlock: any;
  };
}

export default function Dashboard() {
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blockchain data
  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch data from your scripts
      const address = await getAddressFromBlockscout();
      const balance = await getPoolTokenBalance();

      setBlockchainData({
        address,
        poolBalance: balance,
      });
    } catch (err) {
      setError('Failed to fetch blockchain data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blockchain Dashboard</h1>
      
      {/* Data Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Use your existing Farcaster Frame components */}
        <YourExistingFrameComponent 
          data={blockchainData ? {
            address: blockchainData.address.uniqueAddresses.join(', '),
            poolBalance: JSON.stringify(blockchainData.poolBalance)
          } : null}
        />
        
        {/* Additional Data Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Blockchain Details</h2>
          {blockchainData && (
            <>
              <div className="mb-4">
                <label className="font-medium">Address:</label>
                <p className="break-all">{JSON.stringify(blockchainData.address)}</p>
              </div>
              <div className="mb-4">
                <label className="font-medium">Pool Balance:</label>
                <p>{JSON.stringify(blockchainData.poolBalance)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <button 
        onClick={fetchBlockchainData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
    </div>
  );
}