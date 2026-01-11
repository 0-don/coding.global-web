import { GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType } from "@/openapi";
import { Locale } from "next-intl";

// Re-export the generated const and type
export const ApiBoardTypeValues =
  GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType;
export type ApiBoardType = GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType;

export type BoardType = ApiBoardType | "marketplace";

export type MarketplaceBoardType = Exclude<ApiBoardType, "showcase">;

export type ProgrammingBoardType = Exclude<
  ApiBoardType,
  "showcase" | "job-board" | "dev-board"
>;

export type MetadataParams = {
  locale: Locale | (string & {});
  title: string;
  description: string;
  keywords: string;
  path?: string;
  ogImage?: string;
  robots?: boolean;
};

export type MetadataKeys = {
  title: string;
  description: string;
  keywords: string;
};
