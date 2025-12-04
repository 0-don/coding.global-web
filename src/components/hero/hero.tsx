"use client";

import { useSection } from "@/src/context/section-context";
import HomeView from "./home-view";
import NewsView from "./news-view";
import RulesView from "./rules-view";
import TeamView from "./team-view";

export default function Hero() {
  const { section } = useSection();

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 text-center z-10">
      <div className="w-full max-w-3xl">
        {section === "home" && <HomeView />}
        {section === "news" && <NewsView />}
        {section === "rules" && <RulesView />}
        {section === "team" && <TeamView />}
      </div>
    </div>
  );
}
