import { getPathname } from "@/i18n/navigation";
import { Pathname, pathnames, routing } from "@/i18n/routing";
import { getThreadPathname } from "@/lib/utils/base";
import {
  getApiByGuildIdThreadByThreadType,
  GetApiByGuildIdThreadByThreadType200Item,
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
} from "@/openapi";
import { log } from "console";
import { MetadataRoute } from "next";
import { Locale } from "next-intl";

export const revalidate = 3600;

const MIN_MESSAGES_FOR_SITEMAP = 3;

const THREAD_TYPES = Object.values(
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
);

type SitemapEntryOptions = {
  priority?: number;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date;
};

function getRoutePriority(route: string): SitemapEntryOptions {
  if (route === "/") {
    return { priority: 1.0, changeFrequency: "daily" };
  }
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
  if (route.includes("/community/") || route.includes("/resources/")) {
    return { priority: 0.7, changeFrequency: "weekly" };
  }
  return { priority: 0.5, changeFrequency: "weekly" };
}

function getUrl(href: Pathname, locale: Locale): string {
  const pathname = getPathname({ locale, href });
  return `${new URL(process.env.NEXT_PUBLIC_URL).origin}${pathname}`;
}

function getEntries(
  href: Pathname,
  options?: SitemapEntryOptions,
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    lastModified: options?.lastModified ?? new Date(),
    ...(options?.priority !== undefined && { priority: options.priority }),
    ...(options?.changeFrequency && {
      changeFrequency: options.changeFrequency,
    }),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)]),
      ),
    },
  }));
}

async function fetchThreads(
  threadType: (typeof THREAD_TYPES)[number],
): Promise<GetApiByGuildIdThreadByThreadType200Item[]> {
  try {
    const response = await getApiByGuildIdThreadByThreadType(
      process.env.NEXT_PUBLIC_GUILD_ID,
      threadType,
    );
    if (response.status !== 200) {
      log(`[Sitemap] ${threadType}: error (${response.status})`);
      return [];
    }
    return response.data as GetApiByGuildIdThreadByThreadType200Item[];
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    log(`[Sitemap] ${threadType}: failed (${message})`);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = Object.keys(pathnames).filter(
    (route) => !route.includes("["),
  ) as (keyof typeof pathnames)[];

  const staticEntries = staticRoutes.flatMap((route) =>
    getEntries(route as Pathname, getRoutePriority(route)),
  );

  const threadsByType = await Promise.all(
    THREAD_TYPES.map(async (threadType) => {
      const threads = await fetchThreads(threadType);
      const kept = threads.filter(
        (thread) => thread.messageCount >= MIN_MESSAGES_FOR_SITEMAP,
      );
      log(
        `[Sitemap] ${threadType}: kept ${kept.length}/${threads.length} (messageCount >= ${MIN_MESSAGES_FOR_SITEMAP})`,
      );
      return kept.flatMap((thread) =>
        getEntries(getThreadPathname(threadType, thread.id), {
          priority: 0.6,
          changeFrequency: "weekly",
          lastModified: thread.lastActivityAt
            ? new Date(thread.lastActivityAt)
            : undefined,
        }),
      );
    }),
  );

  return [...staticEntries, ...threadsByType.flat()];
}
