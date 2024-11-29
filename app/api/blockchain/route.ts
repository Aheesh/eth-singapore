import { NextResponse } from 'next/server';
import { getAddressFromBlockscout } from '../../../../bal-join/script/05getAddressBlockscoutAPI';
import getPoolTokenBalance from '../../../../bal-join/script/06balancerPoolTokenBalance';

export async function GET() {
  try {
    const address = await getAddressFromBlockscout();
    const balance = await getPoolTokenBalance();

    return NextResponse.json({
      address,
      poolBalance: balance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blockchain data' },
      { status: 500 }
    );
  }
}
