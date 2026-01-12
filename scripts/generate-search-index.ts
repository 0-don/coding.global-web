import { create, insert } from "@orama/orama";
import { persist } from "@orama/plugin-data-persistence";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { error, log } from "console";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { NextIntlClientProvider } from "next-intl";
import { join } from "path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import TurndownService from "turndown";
import { LOCALES } from "../src/lib/config/constants";
import { queryKeys } from "../src/lib/react-query/keys";
import { ApiThreadType } from "../src/lib/types";
import {
  getApiByGuildIdThreadByThreadType,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
} from "../src/openapi";

const GUILD_ID = process.env.NEXT_PUBLIC_GUILD_ID!;

if (!process.env.STANDALONE) process.exit(0);

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

type Category = "Community" | "Resources" | "Marketplace" | "Coding";
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
  thread:
    (type: "job-board" | "dev-board" | "showcase"): Prefetcher =>
    async (qc) => {
      const res = await getApiByGuildIdThreadByThreadType(GUILD_ID, type).catch(
        () => null,
      );
      if (res?.status === 200)
        qc.setQueryData(queryKeys.threads(type), res.data);
    },
  codingThread:
    (type: ApiThreadType): Prefetcher =>
    async (qc) => {
      const res = await getApiByGuildIdThreadByThreadType(GUILD_ID, type).catch(
        () => null,
      );
      if (res?.status === 200)
        qc.setQueryData(queryKeys.threads(type), res.data);
    },
  marketplace: async (qc: QueryClient) => {
    await Promise.all([
      prefetch.thread("job-board")(qc),
      prefetch.thread("dev-board")(qc),
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
  "coding-language": () =>
    import("../src/components/pages/community/coding/coding-language"),
};

const pages: {
  url: string;
  category: Category;
  component: string;
  titleKey?: string;
  prefetch?: Prefetcher;
  props?: Record<string, unknown>;
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
    prefetch: prefetch.thread("showcase"),
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
    prefetch: prefetch.thread("job-board"),
  },
  {
    url: "/marketplace/dev-board",
    category: "Marketplace",
    component: "dev-board",
    titleKey: "MARKETPLACE.DEV_BOARD.HEADING",
    prefetch: prefetch.thread("dev-board"),
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
  // Coding language pages
  {
    url: "/community/coding/javascript",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.JAVASCRIPT.HEADING",
    prefetch: prefetch.codingThread("javascript"),
    props: { threadType: "javascript" },
  },
  {
    url: "/community/coding/python",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.PYTHON.HEADING",
    prefetch: prefetch.codingThread("python"),
    props: { threadType: "python" },
  },
  {
    url: "/community/coding/rust",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.RUST.HEADING",
    prefetch: prefetch.codingThread("rust"),
    props: { threadType: "rust" },
  },
  {
    url: "/community/coding/cpp",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.CPP.HEADING",
    prefetch: prefetch.codingThread("cpp"),
    props: { threadType: "cpp" },
  },
  {
    url: "/community/coding/csharp",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.CSHARP.HEADING",
    prefetch: prefetch.codingThread("csharp"),
    props: { threadType: "csharp" },
  },
  {
    url: "/community/coding/c",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.C.HEADING",
    prefetch: prefetch.codingThread("c"),
    props: { threadType: "c" },
  },
  {
    url: "/community/coding/go",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.GO.HEADING",
    prefetch: prefetch.codingThread("go"),
    props: { threadType: "go" },
  },
  {
    url: "/community/coding/java",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.JAVA.HEADING",
    prefetch: prefetch.codingThread("java"),
    props: { threadType: "java" },
  },
  {
    url: "/community/coding/kotlin",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.KOTLIN.HEADING",
    prefetch: prefetch.codingThread("kotlin"),
    props: { threadType: "kotlin" },
  },
  {
    url: "/community/coding/dart",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.DART.HEADING",
    prefetch: prefetch.codingThread("dart"),
    props: { threadType: "dart" },
  },
  {
    url: "/community/coding/lua",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.LUA.HEADING",
    prefetch: prefetch.codingThread("lua"),
    props: { threadType: "lua" },
  },
  {
    url: "/community/coding/php",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.PHP.HEADING",
    prefetch: prefetch.codingThread("php"),
    props: { threadType: "php" },
  },
  {
    url: "/community/coding/html-css",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.HTML_CSS.HEADING",
    prefetch: prefetch.codingThread("html-css"),
    props: { threadType: "html-css" },
  },
  {
    url: "/community/coding/sql",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.SQL.HEADING",
    prefetch: prefetch.codingThread("sql"),
    props: { threadType: "sql" },
  },
  {
    url: "/community/coding/swift",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.SWIFT.HEADING",
    prefetch: prefetch.codingThread("swift"),
    props: { threadType: "swift" },
  },
  {
    url: "/community/coding/bash-powershell",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.BASH_POWERSHELL.HEADING",
    prefetch: prefetch.codingThread("bash-powershell"),
    props: { threadType: "bash-powershell" },
  },
  {
    url: "/community/coding/visual-basic",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.VISUAL_BASIC.HEADING",
    prefetch: prefetch.codingThread("visual-basic"),
    props: { threadType: "visual-basic" },
  },
  {
    url: "/community/coding/zig",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.ZIG.HEADING",
    prefetch: prefetch.codingThread("zig"),
    props: { threadType: "zig" },
  },
  {
    url: "/community/coding/other",
    category: "Coding",
    component: "coding-language",
    titleKey: "CODING.OTHER.HEADING",
    prefetch: prefetch.codingThread("other"),
    props: { threadType: "other" },
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
              NextIntlClientProvider,
              {
                locale,
                messages,
                onError: () => {},
              } as unknown as Parameters<typeof NextIntlClientProvider>[0],
              createElement(Component, page.props),
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
