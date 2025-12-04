"use client";

import { useSection } from "@/src/context/section-context";
import { HomeView } from "./home-view";
import { NewsView } from "./news-view";
import { RulesView } from "./rules-view";
import { TeamView } from "./team-view";

export function Hero() {
  const { section } = useSection();

  return (
    <div className="z-10 flex min-h-screen w-full items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        {section === "home" && <HomeView />}
        {section === "news" && <NewsView />}
        {section === "rules" && <RulesView />}
        {section === "team" && <TeamView />}
      </div>
    </div>
  );
}
