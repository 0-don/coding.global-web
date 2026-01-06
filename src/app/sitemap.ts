import { getPathname } from "@/i18n/navigation";
import { Pathname, pathnames, routing } from "@/i18n/routing";
import {
  getApiByGuildIdBoardByBoardType,
  GetApiByGuildIdBoardByBoardType200ItemBoardType,
} from "@/openapi";
import { log } from "console";
import { MetadataRoute } from "next";
import { Locale } from "next-intl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = Object.keys(pathnames).filter(
    (route) => !route.includes("["),
  ) as (keyof typeof pathnames)[];

  const entries: MetadataRoute.Sitemap = [];

  staticRoutes.forEach((route) => {
    entries.push(...getEntries(route as Pathname));
  });

  const boardPromises = Object.values(
    GetApiByGuildIdBoardByBoardType200ItemBoardType,
  ).map(async (boardType) => {
    try {
      const response = await getApiByGuildIdBoardByBoardType(
        process.env.NEXT_PUBLIC_GUILD_ID,
        boardType,
      );

      if (response.status !== 200) {
        return [];
      }

      const threads = response.data;
      const threadEntries: MetadataRoute.Sitemap = [];

      threads.forEach((thread) => {
        const pathname = getThreadPathname(boardType, thread.id);
        if (pathname) {
          threadEntries.push(...getEntries(pathname));
        }
      });

      return threadEntries;
    } catch (error) {
      log(`Failed to fetch threads for ${boardType}:`, error);
      return [];
    }
  });

  const boardEntries = await Promise.all(boardPromises);
  boardEntries.forEach((boardThreadEntries) => {
    entries.push(...boardThreadEntries);
  });

  log("Generating sitemap with entries:", entries.length);
  return entries;
}

function getThreadPathname(
  boardType: GetApiByGuildIdBoardByBoardType200ItemBoardType,
  threadId: string,
): Pathname | null {
  switch (boardType) {
    case "showcase":
      return { pathname: "/community/showcase/[id]", params: { id: threadId } };
    case "job-board":
      return {
        pathname: "/marketplace/job-board/[id]",
        params: { id: threadId },
      };
    case "dev-board":
      return {
        pathname: "/marketplace/dev-board/[id]",
        params: { id: threadId },
      };
    default:
      // All other board types are programming languages
      return {
        pathname: `/community/coding/${boardType}/[id]`,
        params: { id: threadId },
      } as Pathname;
  }
}

function getEntries(href: Pathname): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)]),
      ),
    },
  }));
}

function getUrl(href: Pathname, locale: Locale): string {
  const pathname = getPathname({ locale, href });

  return `${new URL(process.env.NEXT_PUBLIC_URL).origin}${pathname}`;
}
