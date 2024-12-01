import axios from 'axios';
import { ethers } from 'ethers';

export interface TokenBalance {
    address: string;
    balance: string;
}

export async function getTokenHolders(tokenAddress: string): Promise<TokenBalance[]> {
    try {
        const url = `https://base.blockscout.com/api/v2/tokens/${tokenAddress}/holders`;
        const response = await axios.get(url);
        
        if (!response.data?.items) {
            return [];
        }
        
        return response.data.items.map((holder: any) => ({
            address: holder.address.hash,
            balance: ethers.formatUnits(holder.value, 18)
        }));
    } catch (error) {
        console.error(`Error fetching holders for token ${tokenAddress}:`, error);
        return [];
    }
} 