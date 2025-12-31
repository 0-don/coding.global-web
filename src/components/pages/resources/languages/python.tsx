"use client";

import { useSetTOC } from "@/components/layout/toc/toc-context";
import type { TOCItemType } from "fumadocs-core/toc";

const toc: TOCItemType[] = [];

export function Python() {
  useSetTOC(toc, "On This Page");

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">Python</h1>

      <section className="mb-12">
        <p className="text-muted-foreground mb-4">
          Python is really only relevant for specific fields like data science,
          machine learning, scientific computing, and automation scripting.
          Outside of these areas, it&apos;s not particularly useful.
        </p>
        <p className="text-muted-foreground mb-4">
          Many people choose Python as their first language because they think
          it&apos;s simple. While the syntax is readable, this simplicity
          doesn&apos;t transfer well to other languages or real-world
          development. If you want to become a full-stack developer, JavaScript
          is a much better choice since it works on both frontend and backend.
        </p>
        <p className="text-muted-foreground">
          But if you really want to learn Python, check out{" "}
          <a
            href="https://www.freecodecamp.org/learn/scientific-computing-with-python/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            FreeCodeCamp&apos;s Scientific Computing with Python
          </a>
          .
        </p>
      </section>
    </div>
  );
}
