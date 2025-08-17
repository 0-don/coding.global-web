"use client";

import { useSection } from "@/context/SectionContext";
import HomeView from "./HomeView";
import NewsView from "./NewsView";
import RulesView from "./RulesView";
import TeamView from "./TeamView";

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
