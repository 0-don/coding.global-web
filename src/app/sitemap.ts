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

// Threads with fewer than this many messages are excluded from the sitemap.
// One-message threads are the main driver of "Crawled - currently not indexed"
// since Google sees thousands of near-identical shell pages.
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

function getUrl(href: Pathname, locale: Locale): string {
  const pathname = getPathname({ locale, href });
  return `${new URL(process.env.NEXT_PUBLIC_URL).origin}${pathname}`;
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

function threadEntries(
  threadType: (typeof THREAD_TYPES)[number],
  threads: GetApiByGuildIdThreadByThreadType200Item[],
): MetadataRoute.Sitemap {
  return threads
    .filter((thread) => thread.messageCount >= MIN_MESSAGES_FOR_SITEMAP)
    .flatMap((thread) =>
      getEntries(getThreadPathname(threadType, thread.id), {
        priority: 0.6,
        changeFrequency: "weekly",
        lastModified: thread.lastActivityAt
          ? new Date(thread.lastActivityAt)
          : undefined,
      }),
    );
}

// Generate one sitemap per section. Next.js produces:
//   /sitemap.xml            -> index of /sitemap/<id>.xml
//   /sitemap/static.xml     -> localized static routes
//   /sitemap/threads-<t>.xml -> threads for type <t>
export async function generateSitemaps() {
  return [{ id: "static" }, ...THREAD_TYPES.map((t) => ({ id: `threads-${t}` }))];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  if (id === "static") {
    const staticRoutes = Object.keys(pathnames).filter(
      (route) => !route.includes("["),
    ) as (keyof typeof pathnames)[];
    return staticRoutes.flatMap((route) =>
      getEntries(route as Pathname, getRoutePriority(route)),
    );
  }

  const threadsPrefix = "threads-";
  if (id.startsWith(threadsPrefix)) {
    const threadType = id.slice(threadsPrefix.length) as
      (typeof THREAD_TYPES)[number];
    if (!THREAD_TYPES.includes(threadType)) return [];
    const threads = await fetchThreads(threadType);
    const entries = threadEntries(threadType, threads);
    log(
      `[Sitemap] ${threadType}: kept ${entries.length / routing.locales.length}/${threads.length} (messageCount >= ${MIN_MESSAGES_FOR_SITEMAP})`,
    );
    return entries;
  }

  return [];
}
