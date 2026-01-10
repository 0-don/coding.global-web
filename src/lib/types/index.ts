import { getApiByGuildIdBoardByBoardType } from "@/openapi";

// BoardType inferred from API function parameters
export type ApiBoardType = Parameters<
  typeof getApiByGuildIdBoardByBoardType
>[1];

export type BoardType = ApiBoardType | "marketplace";

export type MarketplaceBoardType = Exclude<ApiBoardType, "showcase">;

export type ProgrammingBoardType = Exclude<
  ApiBoardType,
  "showcase" | "job-board" | "dev-board"
>;
