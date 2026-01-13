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
import { ApiThreadType, PROGRAMMING_LANGUAGES } from "../src/lib/types";
import {
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdThreadByThreadType,
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
]);
turndown.addRule("removeSvg", {
  filter: (n) => n.nodeName === "SVG",
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
  { load: () => Promise<Record<string, unknown>>; name: string }
> = {
  news: {
    load: () => import("../src/components/pages/community/news/news"),
    name: "News",
  },
  rules: {
    load: () => import("../src/components/pages/community/rules/rules"),
    name: "Rules",
  },
  showcase: {
    load: () => import("../src/components/pages/community/showcase/showcase"),
    name: "Showcase",
  },
  team: {
    load: () => import("../src/components/pages/community/team/team"),
    name: "Team",
  },
  marketplace: {
    load: () => import("../src/components/pages/marketplace/marketplace"),
    name: "Marketplace",
  },
  "job-board": {
    load: () => import("../src/components/pages/marketplace/job-board"),
    name: "JobBoard",
  },
  "dev-board": {
    load: () => import("../src/components/pages/marketplace/dev-board"),
    name: "DevBoard",
  },
  resources: {
    load: () => import("../src/components/pages/resources/resources"),
    name: "Resources",
  },
  javascript: {
    load: () =>
      import("../src/components/pages/resources/languages/javascript"),
    name: "Javascript",
  },
  python: {
    load: () => import("../src/components/pages/resources/languages/python"),
    name: "Python",
  },
  "vibe-coding": {
    load: () => import("../src/components/pages/resources/guides/vibe-coding"),
    name: "VibeCoding",
  },
  "cyber-security": {
    load: () =>
      import("../src/components/pages/resources/guides/cyber-security"),
    name: "CyberSecurity",
  },
  "ai-assistants": {
    load: () => import("../src/components/pages/resources/ai-assistants"),
    name: "AiAssistants",
  },
  "coding-language": {
    load: () =>
      import("../src/components/pages/community/coding/coding-language"),
    name: "CodingLanguage",
  },
  "coding-index": {
    load: () => import("../src/components/pages/community/coding/coding-index"),
    name: "CodingIndex",
  },
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
  {
    url: "/resources/ai-assistants",
    category: "Resources",
    component: "ai-assistants",
  },
  {
    url: "/community/coding",
    category: "Coding",
    component: "coding-index",
    titleKey: "CODING.HEADING",
  },
  ...PROGRAMMING_LANGUAGES.map((lang) => ({
    url: `/community/coding/${lang}`,
    category: "Coding" as Category,
    component: "coding-language",
    titleKey: `CODING.${lang.toUpperCase()}.HEADING`,
    prefetch: prefetch.codingThread(lang),
    props: { threadType: lang },
  })),
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

        const { load, name } = components[page.component];
        const Component = (await load())[name] as React.ComponentType;
        if (typeof Component !== "function") continue;

        const html = renderToString(
          createElement(
            QueryClientProvider,
            { client: qc },
            createElement(
              NextIntlClientProvider,
              { locale, messages, onError: () => {} } as unknown as Parameters<
                typeof NextIntlClientProvider
              >[0],
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

  writeFileSync(
    join(process.cwd(), "public", "search-index.json"),
    JSON.stringify(await persist(db, "json")),
  );
  log(`Indexed ${totalIndexed} pages across ${LOCALES.length} locales`);
}

generateSearchIndex().catch(error);
