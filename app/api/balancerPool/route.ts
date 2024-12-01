import { NextResponse } from 'next/server';
import { getPoolBalance } from '../../lib/balancer';

export async function GET() {
    try {
        const poolData = await getPoolBalance();
        return NextResponse.json(poolData);
    } catch (error) {
        console.error("Error fetching pool tokens:", error);
        return NextResponse.json(
            { error: 'Failed to fetch pool balance' },
            { status: 500 }
        );
    }
}
