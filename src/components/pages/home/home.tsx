"use client";

import { DiscordWidget } from "@/components/pages/home/discord-widget";
import { DiscordWidgetSkeleton } from "@/components/pages/home/discord-widget-skeleton";
import { Suspense } from "react";
import { WelcomeWidget } from "./welcome-widget";

export function Home() {
  return (
    <div className="container mx-auto mt-10 flex h-full flex-col items-center gap-10 px-4 md:flex-row md:px-6">
      <WelcomeWidget className="flex-1" />

      <Suspense fallback={<DiscordWidgetSkeleton className="flex-1" />}>
        <DiscordWidget className="flex-1" />
      </Suspense>
    </div>
  );
}
