// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3000'
    : 'https://eth-singapore-woad.vercel.app';
//export const BUY_MY_COFFEE_CONTRACT_ADDR = '0xcD3D5E4E498BAb2e0832257569c3Fd4AE439dD6f';
export const BAL_VAULT_ADDR = '0xba12222222228d8ba445958a75a0704d566bf2c8';
export const DEGEN_ADDR = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed';
