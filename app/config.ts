// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL ='https://eth-singapore-woad.vercel.app';

export const BAL_VAULT_ADDR = '0xba12222222228d8ba445958a75a0704d566bf2c8';
export const DEGEN_ADDR = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed';

export const PLAYER_A_ADDR = '0xA68E10f668e735Da87f48DA78B14c5466EEF91C9';
export const PLAYER_B_ADDR = '0xB40173EeadBA7479CBeFc320d982eEa29858CD9D';
export const DRAW_ADDR = '0x0b1DEE686830dcA27979ae7c76C0040a67208E07';
export const POOL_ID = '0xa657788fc4d4fd69e3e29e10efee19613c2e9e300001000000000000000001b8';

export const TOKENS = {
    PLAYER_A: PLAYER_A_ADDR,
    PLAYER_B: PLAYER_B_ADDR,
    DRAW: DRAW_ADDR
} as const;
