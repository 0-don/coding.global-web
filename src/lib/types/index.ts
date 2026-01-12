import { GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType } from "@/openapi";
import { Locale } from "next-intl";

// Re-export the generated const and type
export const ApiThreadTypeValues =
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType;
export type ApiThreadType = GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType;

export type ThreadType = ApiThreadType | "marketplace";

export type MarketplaceThreadType = Exclude<ApiThreadType, "showcase">;

export type ProgrammingThreadType = Exclude<
  ApiThreadType,
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
