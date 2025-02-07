import { ethers } from 'ethers';
import controllerABI from '../_contracts/Controller.json';

const controllerAddress = process.env.CONTROLLER_ADDRESS;

export async function getPoolBalance() {
    const providerApiKey = process.env.BASE_PROVIDER_API_KEY;
    if (!providerApiKey) {
        throw new Error("BASE_PROVIDER_API_KEY environment variable is not set");
    }

    const provider = new ethers.JsonRpcProvider(
        `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`
    );
    
    if (!controllerAddress) {
        throw new Error("CONTROLLER_ADDRESS environment variable is not set");
    }

    const controllerContract = new ethers.Contract(
        controllerAddress, 
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