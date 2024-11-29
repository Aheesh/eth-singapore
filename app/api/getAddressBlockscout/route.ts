import { NextResponse } from 'next/server';
import axios from 'axios';
import { ethers } from 'ethers';

// Constants
const TOKENS = {
    PLAYER_A: '0xaA4eC2d86E61632E88Db93cf6D2a42E5f458DC99',
    PLAYER_B: '0xe96891F2d3838Bfbbce1285e0913b195acc935c5',
    DRAW: '0x62A52757b580e7FD97203bD0408a7445741b5D5f',
};

interface TokenBalance {
    address: string;
    balance: string;
}

async function getTokenHolders(tokenAddress: string): Promise<TokenBalance[]> {
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

export async function GET() {
    try {
        const [playerAHolders, playerBHolders, drawHolders] = await Promise.all([
            getTokenHolders(TOKENS.PLAYER_A),
            getTokenHolders(TOKENS.PLAYER_B),
            getTokenHolders(TOKENS.DRAW)
        ]);

        const data = {
            playerA: playerAHolders,
            playerB: playerBHolders,
            draw: drawHolders,
            uniqueAddresses: Array.from(new Set([
                ...playerAHolders.map(h => h.address),
                ...playerBHolders.map(h => h.address),
                ...drawHolders.map(h => h.address)
            ]))
        };

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch token holders data' },
            { status: 500 }
        );
    }
}
