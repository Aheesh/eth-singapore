import { NextResponse } from 'next/server';
import { getTokenHolders } from '../../lib/blockscout';
import { getPoolBalance } from '../../lib/balancer';
import { TOKENS } from '../../config';

async function getAddressFromBlockscout() {
    const [playerAHolders, playerBHolders, drawHolders] = await Promise.all([
        getTokenHolders(TOKENS.PLAYER_A),
        getTokenHolders(TOKENS.PLAYER_B),
        getTokenHolders(TOKENS.DRAW)
    ]);

    return {
        playerA: playerAHolders,
        playerB: playerBHolders,
        draw: drawHolders,
        uniqueAddresses: Array.from(new Set([
            ...playerAHolders.map(h => h.address),
            ...playerBHolders.map(h => h.address),
            ...drawHolders.map(h => h.address)
        ]))
    };
}

export async function GET() {
    try {
        const [address, poolBalance] = await Promise.all([
            getAddressFromBlockscout(),
            getPoolBalance()
        ]);

        return NextResponse.json({
            address,
            poolBalance,
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch blockchain data' },
            { status: 500 }
        );
    }
}
