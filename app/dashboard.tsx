'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [blockchainData, setBlockchainData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from your new API routes
        const [addressResponse, balanceResponse] = await Promise.all([
          fetch('/api/getAddressBlockscout'),
          fetch('/api/balancerPool')
        ]);

        const addressData = await addressResponse.json();
        const balanceData = await balanceResponse.json();

        setBlockchainData({
          address: addressData.data,
          balance: balanceData.balance
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {blockchainData && (
        <>
          <div className="mb-4">
            <label className="font-medium">Address Data:</label>
            <p>{JSON.stringify(blockchainData.address)}</p>
          </div>
          <div className="mb-4">
            <label className="font-medium">Pool Balance:</label>
            <p>{JSON.stringify(blockchainData.balance)}</p>
          </div>
        </>
      )}
    </div>
  );
}