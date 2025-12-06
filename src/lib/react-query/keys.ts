import type { GetUserPayoutsParams } from "@/openapi";

export const queryKeys = {
  // User
  me: () => ["me"],
  currentBalance: () => ["current-balance"],
  walletBalances: () => ["wallet-balances"],
  userPayouts: (params?: GetUserPayoutsParams) => ["user-payouts", params],
};
