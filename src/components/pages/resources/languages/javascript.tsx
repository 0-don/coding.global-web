"use client";

import { useSetTOC } from "@/components/layout/toc/toc-context";
import type { TOCItemType } from "fumadocs-core/toc";

const toc: TOCItemType[] = [
  { url: "#overview", title: "Overview", depth: 2 },
  { url: "#getting-started", title: "Getting Started", depth: 2 },
  { url: "#examples", title: "Examples", depth: 2 },
  { url: "#resources", title: "Resources", depth: 2 },
];

export function Javascript() {
  useSetTOC(toc, "On This Page");

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">JavaScript Resources</h1>

      <section id="overview" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          JavaScript is a versatile programming language that powers the modern
          web. It runs in browsers and on servers (Node.js), making it essential
          for full-stack development.
        </p>
      </section>

      <section id="getting-started" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Getting Started</h2>
        <p className="text-muted-foreground">
          Start your JavaScript journey with the fundamentals: variables,
          functions, and control flow. Then move on to modern ES6+ features like
          arrow functions, destructuring, and async/await.
        </p>
      </section>

      <section id="examples" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Examples</h2>
        <p className="text-muted-foreground">
          Explore practical examples including DOM manipulation, API requests,
          and building interactive web applications.
        </p>
      </section>

      <section id="resources" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Resources</h2>
        <p className="text-muted-foreground">
          Curated links to documentation, tutorials, and community resources for
          continuing your JavaScript learning.
        </p>
      </section>
    </div>
  );
}
