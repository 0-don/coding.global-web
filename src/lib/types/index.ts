import {
  GetApiByGuildIdThreadByThreadTypeByThreadId200ResolvedUsersItem,
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
} from "@/openapi";
import { Locale } from "next-intl";

const NON_PROGRAMMING_TYPES = ["job-board", "dev-board", "showcase"] as const;

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

export type ResolvedUser = GetApiByGuildIdThreadByThreadTypeByThreadId200ResolvedUsersItem;

export function mergeResolvedUsers(
  thread: { resolvedUsers?: ResolvedUser[] } | null | undefined,
  pages: Array<{ resolvedUsers?: ResolvedUser[] } | null | undefined> | undefined,
): ResolvedUser[] {
  const map = new Map<string, ResolvedUser>();
  thread?.resolvedUsers?.forEach((u) => map.set(u.id, u));
  pages?.forEach((page) => page?.resolvedUsers?.forEach((u) => map.set(u.id, u)));
  return [...map.values()];
}
