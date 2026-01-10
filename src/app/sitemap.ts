import { getPathname } from "@/i18n/navigation";
import { Pathname, pathnames, routing } from "@/i18n/routing";
import {
  getApiByGuildIdBoardByBoardType,
  GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType,
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

  // Fetch boards sequentially to avoid overwhelming the API
  const boardTypes = Object.values(
    GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType,
  );

  const apiUrl = `${process.env.NEXT_PUBLIC_BOT_URL}/api/${process.env.NEXT_PUBLIC_GUILD_ID}/board`;
  log(`[Sitemap] API base URL: ${apiUrl}`);

  for (const boardType of boardTypes) {
    const fullUrl = `${apiUrl}/${boardType}`;
    log(`[Sitemap] Fetching ${boardType} from: ${fullUrl}`);

    try {
      const response = await getApiByGuildIdBoardByBoardType(
        process.env.NEXT_PUBLIC_GUILD_ID,
        boardType,
      );

      log(`[Sitemap] ${boardType} response status: ${response.status}`);

      if (response.status !== 200) {
        log(
          `[Sitemap] ${boardType} returned non-200 status: ${response.status}`,
        );
        log(
          `[Sitemap] ${boardType} response data:`,
          JSON.stringify(response.data).slice(0, 500),
        );
        continue;
      }

      const threads = response.data;
      log(`[Sitemap] ${boardType}: fetched ${threads.length} threads`);

      threads.forEach((thread) => {
        const pathname = getThreadPathname(boardType, thread.id);
        if (pathname) {
          entries.push(...getEntries(pathname));
        }
      });
    } catch (error) {
      log(`[Sitemap] Failed to fetch threads for ${boardType}`);
      log(`[Sitemap] URL attempted: ${fullUrl}`);
      if (error instanceof Error) {
        log(`[Sitemap] Error name: ${error.name}`);
        log(`[Sitemap] Error message: ${error.message}`);
        log(`[Sitemap] Error stack: ${error.stack}`);
      } else {
        log(`[Sitemap] Error (raw):`, error);
      }
    }
  }

  log("[Sitemap] Total entries:", entries.length);
  return entries;
}

function getThreadPathname(
  boardType: GetApiByGuildIdBoardByBoardTypeByThreadIdBoardType,
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
