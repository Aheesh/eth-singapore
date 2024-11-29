'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [blockchainData, setBlockchainData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/blockchain');
        const data = await response.json();
        
        setBlockchainData({
          address: data.address,
          poolBalance: data.poolBalance
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
            <p>{JSON.stringify(blockchainData.poolBalance)}</p>
          </div>
        </>
      )}
    </div>
  );
}
