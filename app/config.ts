// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL ='https://eth-singapore-woad.vercel.app';

export const balVaultAddr = process.env.BAL_VAULT_ADDR;
export const degenAddr = process.env.DEGEN_ADDR;

export const PLAYER_A_ADDR = '0xA68E10f668e735Da87f48DA78B14c5466EEF91C9';
export const PLAYER_B_ADDR = '0xB40173EeadBA7479CBeFc320d982eEa29858CD9D';
export const DRAW_ADDR = '0x0b1DEE686830dcA27979ae7c76C0040a67208E07';
export const poolId = process.env.POOL_ID;

export const TOKENS = {
    PLAYER_A: PLAYER_A_ADDR,
    PLAYER_B: PLAYER_B_ADDR,
    DRAW: DRAW_ADDR
} as const;
