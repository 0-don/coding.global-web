import { GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType } from "@/openapi";
import { Locale } from "next-intl";

export const MARKETPLACE_TYPES = ["job-board", "dev-board"] as const;
export const COMMUNITY_TYPES = ["showcase"] as const;
const NON_PROGRAMMING_TYPES = [...MARKETPLACE_TYPES, ...COMMUNITY_TYPES] as const;

export const PROGRAMMING_LANGUAGES = Object.keys(
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
).filter(
  (type) =>
    !NON_PROGRAMMING_TYPES.includes(
      type as (typeof NON_PROGRAMMING_TYPES)[number],
    ),
) as ProgrammingThreadType[];

export type ApiThreadType =
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType;

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
