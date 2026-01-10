import {
  GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType,
} from "@/openapi";

// Re-export the generated const and type
export const ApiBoardTypeValues = GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType;
export type ApiBoardType = GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType;

export type BoardType = ApiBoardType | "marketplace";

export type MarketplaceBoardType = Exclude<ApiBoardType, "showcase">;

export type ProgrammingBoardType = Exclude<
  ApiBoardType,
  "showcase" | "job-board" | "dev-board"
>;
