// Define a type for the odds data structure
export type OddsData = {
  playerA: { odds: number; payout: number };
  playerB: { odds: number; payout: number };
  draw: { odds: number; payout: number };
  poolSize: number;
};

export const getOdds = (): OddsData => ({
  playerA: { odds: 0.28, payout: 2.1 },
  playerB: { odds: 0.38, payout: 1.4 },
  draw: { odds: 0.34, payout: 1.6 },
  poolSize: 27
}); 