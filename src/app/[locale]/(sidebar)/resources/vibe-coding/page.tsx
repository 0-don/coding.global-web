"use client";

import { useSetSidebarAnchors } from "@/components/layout/sidebar/sidebar-anchor-context";
import type { AnchorItem } from "@/components/layout/sidebar/sidebar-anchor-navigation";
import {
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineLightBulb,
  HiOutlineMusicalNote,
  HiOutlineSparkles,
} from "react-icons/hi2";

const anchors: AnchorItem[] = [
  {
    id: "what-is-vibe-coding",
    label: "What is Vibe Coding",
    icon: HiOutlineBookOpen,
  },
  { id: "flow-state", label: "Flow State", icon: HiOutlineSparkles },
  { id: "environment", label: "Environment", icon: HiOutlineMusicalNote },
  { id: "time-management", label: "Time Management", icon: HiOutlineClock },
  { id: "tips", label: "Tips & Tricks", icon: HiOutlineLightBulb },
];

export default function VibeCodingPage() {
  useSetSidebarAnchors(anchors, "On This Page");

  return (
    <div className="container mx-auto px-4 py-8">
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
