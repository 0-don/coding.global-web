import { create, insert } from "@orama/orama";
import { persist } from "@orama/plugin-data-persistence";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { error, log } from "console";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import TurndownService from "turndown";
import { IntlProvider } from "use-intl";
import { LOCALES } from "../src/lib/config/constants";
import { queryKeys } from "../src/lib/react-query/keys";
import {
  getApiByGuildIdBoardByBoardType,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
} from "../src/openapi";

// Turndown setup for HTML to markdown conversion
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});
// Remove non-content elements
turndown.remove(["script", "style", "nav", "footer", "noscript", "button", "form"] as const);
turndown.addRule("removeSvg", {
  filter: (node) => node.nodeName === "SVG",
  replacement: () => "",
});

// Types
type PageConfig = {
  url: string;
  category: "Community" | "Resources" | "Marketplace";
  componentPath: string;
  titleKey?: string;
  prefetch?: (queryClient: QueryClient) => Promise<void>;
};

type ComponentModule = {
  default?: React.ComponentType;
  [key: string]: unknown;
};

// API Prefetch functions
const GUILD_ID = process.env.NEXT_PUBLIC_GUILD_ID!;

async function prefetchNews(queryClient: QueryClient) {
  try {
    const response = await getApiByGuildIdNews(GUILD_ID);
    if (response.status === 200) {
      queryClient.setQueryData(queryKeys.news(), response.data);
    }
  } catch (e) {
    log("  Warning: Failed to fetch news data");
  }
}

async function prefetchTeam(queryClient: QueryClient) {
  try {
    const response = await getApiByGuildIdStaff(GUILD_ID);
    if (response.status === 200) {
      queryClient.setQueryData(queryKeys.team(), response.data);
    }
  } catch (e) {
    log("  Warning: Failed to fetch team data");
  }
}

async function prefetchShowcase(queryClient: QueryClient) {
  try {
    const response = await getApiByGuildIdBoardByBoardType(GUILD_ID, "showcase");
    if (response.status === 200) {
      queryClient.setQueryData(queryKeys.boardThreads("showcase"), response.data);
    }
  } catch (e) {
    log("  Warning: Failed to fetch showcase data");
  }
}

async function prefetchMarketplace(queryClient: QueryClient) {
  // Marketplace needs both job-board and dev-board
  try {
    const [jobResponse, devResponse] = await Promise.all([
      getApiByGuildIdBoardByBoardType(GUILD_ID, "job-board"),
      getApiByGuildIdBoardByBoardType(GUILD_ID, "dev-board"),
    ]);
    if (jobResponse.status === 200) {
      queryClient.setQueryData(queryKeys.boardThreads("job-board"), jobResponse.data);
    }
    if (devResponse.status === 200) {
      queryClient.setQueryData(queryKeys.boardThreads("dev-board"), devResponse.data);
    }
  } catch (e) {
    log("  Warning: Failed to fetch marketplace data");
  }
}

async function prefetchJobBoard(queryClient: QueryClient) {
  try {
    const response = await getApiByGuildIdBoardByBoardType(GUILD_ID, "job-board");
    if (response.status === 200) {
      queryClient.setQueryData(queryKeys.boardThreads("job-board"), response.data);
    }
  } catch (e) {
    log("  Warning: Failed to fetch job board data");
  }
}

async function prefetchDevBoard(queryClient: QueryClient) {
  try {
    const response = await getApiByGuildIdBoardByBoardType(GUILD_ID, "dev-board");
    if (response.status === 200) {
      queryClient.setQueryData(queryKeys.boardThreads("dev-board"), response.data);
    }
  } catch (e) {
    log("  Warning: Failed to fetch dev board data");
  }
}

// Page configurations
const pages: PageConfig[] = [
  // Community
  {
    url: "/community/news",
    category: "Community",
    componentPath: "news",
    titleKey: "NEWS.TITLE",
    prefetch: prefetchNews,
  },
  {
    url: "/community/rules",
    category: "Community",
    componentPath: "rules",
    titleKey: "RULES.HEADING",
  },
  {
    url: "/community/showcase",
    category: "Community",
    componentPath: "showcase",
    titleKey: "SHOWCASE.HEADING",
    prefetch: prefetchShowcase,
  },
  {
    url: "/community/team",
    category: "Community",
    componentPath: "team",
    titleKey: "TEAM.HEADING",
    prefetch: prefetchTeam,
  },

  // Marketplace
  {
    url: "/marketplace",
    category: "Marketplace",
    componentPath: "marketplace",
    titleKey: "MARKETPLACE.HEADING",
    prefetch: prefetchMarketplace,
  },
  {
    url: "/marketplace/job-board",
    category: "Marketplace",
    componentPath: "job-board",
    titleKey: "MARKETPLACE.JOB_BOARD.HEADING",
    prefetch: prefetchJobBoard,
  },
  {
    url: "/marketplace/dev-board",
    category: "Marketplace",
    componentPath: "dev-board",
    titleKey: "MARKETPLACE.DEV_BOARD.HEADING",
    prefetch: prefetchDevBoard,
  },

  // Resources (no API prefetch needed - static content)
  {
    url: "/resources",
    category: "Resources",
    componentPath: "resources",
  },
  {
    url: "/resources/languages/javascript",
    category: "Resources",
    componentPath: "javascript",
  },
  {
    url: "/resources/languages/python",
    category: "Resources",
    componentPath: "python",
  },
  {
    url: "/resources/guides/vibe-coding",
    category: "Resources",
    componentPath: "vibe-coding",
  },
  {
    url: "/resources/guides/cyber-security",
    category: "Resources",
    componentPath: "cyber-security",
  },
];

// Component loader
async function loadComponent(
  componentPath: string
): Promise<React.ComponentType> {
  const components: Record<string, () => Promise<ComponentModule>> = {
    news: () =>
      import("../src/components/pages/community/news/news") as Promise<ComponentModule>,
    rules: () =>
      import("../src/components/pages/community/rules/rules") as Promise<ComponentModule>,
    showcase: () =>
      import("../src/components/pages/community/showcase/showcase") as Promise<ComponentModule>,
    team: () =>
      import("../src/components/pages/community/team/team") as Promise<ComponentModule>,
    marketplace: () =>
      import("../src/components/pages/marketplace/marketplace") as Promise<ComponentModule>,
    "job-board": () =>
      import("../src/components/pages/marketplace/job-board") as Promise<ComponentModule>,
    "dev-board": () =>
      import("../src/components/pages/marketplace/dev-board") as Promise<ComponentModule>,
    resources: () =>
      import("../src/components/pages/resources/resources") as Promise<ComponentModule>,
    javascript: () =>
      import("../src/components/pages/resources/languages/javascript") as Promise<ComponentModule>,
    python: () =>
      import("../src/components/pages/resources/languages/python") as Promise<ComponentModule>,
    "vibe-coding": () =>
      import("../src/components/pages/resources/guides/vibe-coding") as Promise<ComponentModule>,
    "cyber-security": () =>
      import("../src/components/pages/resources/guides/cyber-security") as Promise<ComponentModule>,
  };

  const mod = await components[componentPath]();
  // Get the named export (e.g., News, Rules, Team) or default
  return (
    mod.default ??
    (Object.values(mod).find(
      (v) => typeof v === "function"
    ) as React.ComponentType)
  );
}

// Create render wrapper with IntlProvider and QueryClientProvider
function createRenderWrapper(
  locale: (typeof LOCALES)[number],
  messages: Record<string, unknown>,
  queryClient: QueryClient
) {
  return function RenderWrapper({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactElement {
    // Using nested createElement with children as third argument
    const intlElement = createElement(
      IntlProvider,
      { locale, messages } as Parameters<typeof IntlProvider>[0],
      children
    );
    return createElement(QueryClientProvider, { client: queryClient }, intlElement);
  };
}

// Helper to get translation value from messages object
function getTranslation(
  messages: Record<string, unknown>,
  key: string
): string {
  const keys = key.split(".");
  let value: unknown = messages;
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  return typeof value === "string" ? value : key;
}

// Main generator function
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

    // Load translations
    const messages = (await import(`../public/i18n/${locale}.json`)).default;

    for (const page of pages) {
      log(`  Rendering: ${page.url}`);

      try {
        const queryClient = new QueryClient({
          defaultOptions: { queries: { retry: false } },
        });

        // Prefetch API data if needed
        if (page.prefetch) {
          await page.prefetch(queryClient);
        }

        // Load and render component
        const Component = await loadComponent(page.componentPath);
        const Wrapper = createRenderWrapper(locale, messages, queryClient);

        const html = renderToString(
          createElement(Wrapper, null, createElement(Component))
        );

        // Parse HTML and extract content
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Extract title from translation key or h1
        const title = page.titleKey
          ? getTranslation(messages, page.titleKey)
          : doc.querySelector("h1")?.textContent?.trim() ?? "";

        // Get body content
        const body = doc.body;

        // Remove interactive/navigation elements
        body
          .querySelectorAll("nav, footer, button, form, .sidebar")
          .forEach((el) => el.remove());

        // Convert translated HTML to markdown
        const content = turndown.turndown(body.innerHTML);

        // Extract description from first paragraph
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

  const serialized = await persist(db, "json");
  const outputPath = join(process.cwd(), "public", "search-index.json");
  writeFileSync(outputPath, JSON.stringify(serialized));

  log(`Search index generated at ${outputPath}`);
  log(`Indexed ${totalIndexed} pages across ${LOCALES.length} locales`);
}

generateSearchIndex().catch(error);
