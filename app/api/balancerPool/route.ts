import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import controllerABI from '../../_contracts/Controller.json';  // Make sure to copy the ABI file to this location

const CONTROLLER_ADDRESS = "0x835309AED8B04C52Fe0dAF35D90F7e5f9A7472Bd";

async function getPoolTokenBalance() {
    // Use environment variable from Vercel
    const providerApiKey = process.env.BASE_PROVIDER_API_KEY;
    if (!providerApiKey) {
        throw new Error("BASE_PROVIDER_API_KEY environment variable is not set");
    }

    const provider = new ethers.JsonRpcProvider(
        `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`
    );
    
    const controllerContract = new ethers.Contract(
        CONTROLLER_ADDRESS, 
        controllerABI.abi, 
        provider
    );

    const [tokens, balances, lastChangeBlock] = await controllerContract.getPoolTokens();
    
    return {
        tokens,
        balances: balances.map((b: bigint) => ethers.formatEther(b)),
        lastChangeBlock: lastChangeBlock.toString()
    };
}

export async function GET() {
    try {
        const poolData = await getPoolTokenBalance();
        return NextResponse.json(poolData);
    } catch (error) {
        console.error("Error fetching pool tokens:", error);
        return NextResponse.json(
            { error: 'Failed to fetch pool balance' },
            { status: 500 }
        );
    }
}
