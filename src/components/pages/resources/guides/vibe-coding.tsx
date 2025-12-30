"use client";

import { useSetTOC } from "@/components/layout/toc/toc-context";
import type { TOCItemType } from "fumadocs-core/toc";

const toc: TOCItemType[] = [
  { url: "#what-is-vibe-coding", title: "What is Vibe Coding", depth: 2 },
  { url: "#flow-state", title: "Flow State", depth: 2 },
  { url: "#environment", title: "Environment", depth: 2 },
  { url: "#time-management", title: "Time Management", depth: 2 },
  { url: "#tips", title: "Tips & Tricks", depth: 2 },
];

export function VibeCoding() {
  useSetTOC(toc, "On This Page");

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">Vibe Coding</h1>

      <section id="what-is-vibe-coding" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">What is Vibe Coding?</h2>
        <p className="text-muted-foreground">
          Vibe coding is about creating the perfect atmosphere and mindset for
          productive programming sessions. It combines environment design,
          music, and mental techniques to help you enter and maintain a flow
          state while coding.
        </p>
      </section>

      <section id="flow-state" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Achieving Flow State</h2>
        <p className="text-muted-foreground">
          The flow state is when you&apos;re fully immersed in your work, losing
          track of time while producing your best code. Learn techniques to
          trigger this state more consistently and maintain it longer.
        </p>
      </section>

      <section id="environment" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          Optimizing Your Environment
        </h2>
        <p className="text-muted-foreground">
          Your physical and digital environment plays a crucial role in
          productivity. Explore recommendations for lighting, music playlists,
          desk setups, and editor themes that enhance your coding sessions.
        </p>
      </section>

      <section id="time-management" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Time Management</h2>
        <p className="text-muted-foreground">
          Learn about techniques like Pomodoro, time blocking, and deep work
          sessions. Discover how to balance focused coding time with breaks for
          optimal long-term productivity.
        </p>
      </section>

      <section id="tips" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Tips & Tricks</h2>
        <p className="text-muted-foreground">
          Community-curated tips for maintaining motivation, dealing with
          burnout, and making coding sessions more enjoyable and sustainable.
        </p>
      </section>
    </div>
  );
}
