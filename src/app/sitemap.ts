import { getPathname } from "@/i18n/navigation";
import { Pathname, pathnames, routing } from "@/i18n/routing";
import {
  getApiByGuildIdThreadByThreadType,
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
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

  // Fetch threads sequentially to avoid overwhelming the API
  const threadTypes = Object.values(
    GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
  );

  const apiUrl = `${process.env.NEXT_PUBLIC_BOT_URL}/api/${process.env.NEXT_PUBLIC_GUILD_ID}/thread`;
  log(`[Sitemap] API base URL: ${apiUrl}`);

  for (const threadType of threadTypes) {
    const fullUrl = `${apiUrl}/${threadType}`;
    log(`[Sitemap] Fetching ${threadType} from: ${fullUrl}`);

    try {
      const response = await getApiByGuildIdThreadByThreadType(
        process.env.NEXT_PUBLIC_GUILD_ID,
        threadType,
      );

      log(`[Sitemap] ${threadType} response status: ${response.status}`);

      if (response.status !== 200) {
        log(
          `[Sitemap] ${threadType} returned non-200 status: ${response.status}`,
        );
        log(
          `[Sitemap] ${threadType} response data:`,
          JSON.stringify(response.data).slice(0, 500),
        );
        continue;
      }

      const threads = response.data;
      log(`[Sitemap] ${threadType}: fetched ${threads.length} threads`);

      threads.forEach((thread) => {
        const pathname = getThreadPathname(threadType, thread.id);
        if (pathname) {
          entries.push(...getEntries(pathname));
        }
      });
    } catch (error) {
      log(`[Sitemap] Failed to fetch threads for ${threadType}`);
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
  threadType: GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
  threadId: string,
): Pathname | null {
  switch (threadType) {
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
      // All other thread types are programming languages
      return {
        pathname: "/community/coding/[language]/[id]",
        params: { language: threadType, id: threadId },
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
