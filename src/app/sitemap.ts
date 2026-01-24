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

type SitemapEntryOptions = {
  priority?: number;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date;
};

function getRoutePriority(route: string): SitemapEntryOptions {
  // Homepage gets highest priority
  if (route === "/") {
    return { priority: 1.0, changeFrequency: "daily" };
  }
  // Main category/section pages
  if (
    [
      "/community/showcase",
      "/community/coding",
      "/marketplace",
      "/marketplace/job-board",
      "/marketplace/dev-board",
      "/resources",
    ].includes(route)
  ) {
    return { priority: 0.8, changeFrequency: "daily" };
  }
  // Sub-pages like rules, team, news, guides
  if (route.includes("/community/") || route.includes("/resources/")) {
    return { priority: 0.7, changeFrequency: "weekly" };
  }
  // Default for other static pages
  return { priority: 0.5, changeFrequency: "weekly" };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = Object.keys(pathnames).filter(
    (route) => !route.includes("["),
  ) as (keyof typeof pathnames)[];

  const entries: MetadataRoute.Sitemap = [];

  staticRoutes.forEach((route) => {
    const options = getRoutePriority(route);
    entries.push(...getEntries(route as Pathname, options));
  });

  // Fetch threads sequentially to avoid overwhelming the API
  const threadTypes = Object.values(
    GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
  );

  const results: string[] = [];

  for (const threadType of threadTypes) {
    try {
      const response = await getApiByGuildIdThreadByThreadType(
        process.env.NEXT_PUBLIC_GUILD_ID,
        threadType,
      );

      if (response.status !== 200) {
        results.push(`${threadType}: error (${response.status})`);
        continue;
      }

      const threads = response.data;
      results.push(`${threadType}: ${threads.length}`);

      threads.forEach((thread) => {
        const pathname = getThreadPathname(threadType, thread.id);
        if (pathname) {
          entries.push(
            ...getEntries(pathname, {
              priority: 0.6,
              changeFrequency: "weekly",
              lastModified: thread.lastActivityAt
                ? new Date(thread.lastActivityAt)
                : undefined,
            }),
          );
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      results.push(`${threadType}: failed (${message})`);
    }
  }

  log(
    `[Sitemap] Threads fetched: ${results.join(", ")}. Total entries: ${entries.length}`,
  );
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

function getEntries(
  href: Pathname,
  options?: SitemapEntryOptions,
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    lastModified: options?.lastModified ?? new Date(),
    ...(options?.priority !== undefined && { priority: options.priority }),
    ...(options?.changeFrequency && { changeFrequency: options.changeFrequency }),
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
