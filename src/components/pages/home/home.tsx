import { DiscordWidget } from "@/components/pages/home/discord-widget";
import { WelcomeWidget } from "./welcome-widget";

export function Home() {
  return (
    <div className="container mx-auto mt-10 flex h-full flex-col items-center gap-10 px-4 md:flex-row md:px-6">
      <WelcomeWidget className="flex-1" />
      asd
      <DiscordWidget className="flex-1" />
    </div>
  );
}
