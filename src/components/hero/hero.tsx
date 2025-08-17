"use client";

import { useSection } from "@/context/section-context";
import HomeView from "./home-view";
import NewsView from "./news-view";
import RulesView from "./rules-view";
import TeamView from "./team-view";

export default function Hero() {
  const { section } = useSection();

  return (
    <div className="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 z-10 text-center px-6 max-w-3xl">
      {section === "home" && <HomeView />}
      {section === "news" && <NewsView />}
      {section === "rules" && <RulesView />}
      {section === "team" && <TeamView />}
    </div>
  );
}
