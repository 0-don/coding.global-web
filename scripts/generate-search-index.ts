import { create, insert } from "@orama/orama";
import { persist } from "@orama/plugin-data-persistence";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { error, log } from "console";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { IntlProvider } from "use-intl";
import { join } from "path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import TurndownService from "turndown";
import { LOCALES } from "../src/lib/config/constants";
import { queryKeys } from "../src/lib/react-query/keys";
import {
  getApiByGuildIdBoardByBoardType,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
} from "../src/openapi";

const GUILD_ID = process.env.NEXT_PUBLIC_GUILD_ID!;

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});
turndown.remove([
  "script",
  "style",
  "nav",
  "footer",
  "noscript",
  "button",
  "form",
] as const);
turndown.addRule("removeSvg", {
  filter: (node) => node.nodeName === "SVG",
  replacement: () => "",
});

type Category = "Community" | "Resources" | "Marketplace";
type Prefetcher = (qc: QueryClient) => Promise<void>;

const prefetch = {
  news: async (qc: QueryClient) => {
    const res = await getApiByGuildIdNews(GUILD_ID).catch(() => null);
    if (res?.status === 200) qc.setQueryData(queryKeys.news(), res.data);
  },
  team: async (qc: QueryClient) => {
    const res = await getApiByGuildIdStaff(GUILD_ID).catch(() => null);
    if (res?.status === 200) qc.setQueryData(queryKeys.team(), res.data);
  },
  board:
    (type: "job-board" | "dev-board" | "showcase"): Prefetcher =>
    async (qc) => {
      const res = await getApiByGuildIdBoardByBoardType(GUILD_ID, type).catch(
        () => null,
      );
      if (res?.status === 200)
        qc.setQueryData(queryKeys.boardThreads(type), res.data);
    },
  marketplace: async (qc: QueryClient) => {
    await Promise.all([
      prefetch.board("job-board")(qc),
      prefetch.board("dev-board")(qc),
    ]);
  },
};

const components: Record<
  string,
  () => Promise<{ default?: React.ComponentType; [key: string]: unknown }>
> = {
  news: () => import("../src/components/pages/community/news/news"),
  rules: () => import("../src/components/pages/community/rules/rules"),
  showcase: () => import("../src/components/pages/community/showcase/showcase"),
  team: () => import("../src/components/pages/community/team/team"),
  marketplace: () => import("../src/components/pages/marketplace/marketplace"),
  "job-board": () => import("../src/components/pages/marketplace/job-board"),
  "dev-board": () => import("../src/components/pages/marketplace/dev-board"),
  resources: () => import("../src/components/pages/resources/resources"),
  javascript: () =>
    import("../src/components/pages/resources/languages/javascript"),
  python: () => import("../src/components/pages/resources/languages/python"),
  "vibe-coding": () =>
    import("../src/components/pages/resources/guides/vibe-coding"),
  "cyber-security": () =>
    import("../src/components/pages/resources/guides/cyber-security"),
};

const pages: {
  url: string;
  category: Category;
  component: string;
  titleKey?: string;
  prefetch?: Prefetcher;
}[] = [
  {
    url: "/community/news",
    category: "Community",
    component: "news",
    titleKey: "NEWS.TITLE",
    prefetch: prefetch.news,
  },
  {
    url: "/community/rules",
    category: "Community",
    component: "rules",
    titleKey: "RULES.HEADING",
  },
  {
    url: "/community/showcase",
    category: "Community",
    component: "showcase",
    titleKey: "SHOWCASE.HEADING",
    prefetch: prefetch.board("showcase"),
  },
  {
    url: "/community/team",
    category: "Community",
    component: "team",
    titleKey: "TEAM.HEADING",
    prefetch: prefetch.team,
  },
  {
    url: "/marketplace",
    category: "Marketplace",
    component: "marketplace",
    titleKey: "MARKETPLACE.HEADING",
    prefetch: prefetch.marketplace,
  },
  {
    url: "/marketplace/job-board",
    category: "Marketplace",
    component: "job-board",
    titleKey: "MARKETPLACE.JOB_BOARD.HEADING",
    prefetch: prefetch.board("job-board"),
  },
  {
    url: "/marketplace/dev-board",
    category: "Marketplace",
    component: "dev-board",
    titleKey: "MARKETPLACE.DEV_BOARD.HEADING",
    prefetch: prefetch.board("dev-board"),
  },
  { url: "/resources", category: "Resources", component: "resources" },
  {
    url: "/resources/languages/javascript",
    category: "Resources",
    component: "javascript",
  },
  {
    url: "/resources/languages/python",
    category: "Resources",
    component: "python",
  },
  {
    url: "/resources/guides/vibe-coding",
    category: "Resources",
    component: "vibe-coding",
  },
  {
    url: "/resources/guides/cyber-security",
    category: "Resources",
    component: "cyber-security",
  },
];

function getTranslation(
  messages: Record<string, unknown>,
  key: string,
): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, k) => (acc as Record<string, unknown>)?.[k],
      messages,
    );
  return typeof value === "string" ? value : key;
}

async function generateSearchIndex() {
  log("Generating search index...");

  const db = create({
    schema: {
      title: "string",
      content: "string",
      description: "string",
      url: "string",
      category: "enum",
      locale: "enum",
    } as const,
  });

  let totalIndexed = 0;

  for (const locale of LOCALES) {
    log(`Processing locale: ${locale}`);
    const messages = (await import(`../public/i18n/${locale}.json`)).default;

    for (const page of pages) {
      log(`  Rendering: ${page.url}`);
      try {
        const qc = new QueryClient({
          defaultOptions: { queries: { retry: false } },
        });
        if (page.prefetch) await page.prefetch(qc);

        const mod = await components[page.component]();
        const Component =
          mod.default ??
          (Object.values(mod).find(
            (v) => typeof v === "function",
          ) as React.ComponentType);

        const html = renderToString(
          createElement(
            QueryClientProvider,
            { client: qc },
            createElement(
              IntlProvider,
              {
                locale,
                messages,
                onError: () => {},
              } as unknown as Parameters<typeof IntlProvider>[0],
              createElement(Component),
            ),
          ),
        );

        const doc = new JSDOM(html).window.document;
        const title = page.titleKey
          ? getTranslation(messages, page.titleKey)
          : (doc.querySelector("h1")?.textContent?.trim() ?? "");

        doc.body
          .querySelectorAll("nav, footer, button, form, .sidebar")
          .forEach((el) => el.remove());
        const content = turndown.turndown(doc.body.innerHTML);

        const firstP = doc.querySelector("p")?.textContent?.trim() ?? "";
        const description =
          firstP.slice(0, 200) + (firstP.length > 200 ? "..." : "");

        await insert(db, {
          title,
          content,
          description,
          url: page.url,
          category: page.category,
          locale,
        });
        totalIndexed++;
      } catch (e) {
        error(`  Error rendering ${page.url}:`, e);
      }
    }
  }

  const outputPath = join(process.cwd(), "public", "search-index.json");
  writeFileSync(outputPath, JSON.stringify(await persist(db, "json")));
  log(`Indexed ${totalIndexed} pages across ${LOCALES.length} locales`);
}

generateSearchIndex().catch(error);
