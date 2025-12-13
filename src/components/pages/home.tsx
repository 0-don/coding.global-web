import { DiscordWidget } from "@/components/elements/discord-widget";
import Link from "next/link";

export function Home() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center gap-8 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-opacity-70 border-primary text-primary mb-6 rounded-lg border bg-black p-4 font-mono text-sm shadow-lg">
          <div className="mb-2 flex items-center space-x-2">
            <span className="bg-primary h-3 w-3 rounded-full"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-1">
            <span className="text-green-400">{">"}</span>
            <span className="ml-1 text-gray-300">Welcome to</span>
            <span className="text-primary font-bold">
              Coding Global Website
            </span>
          </div>

          <div className="mt-2 animate-pulse text-xs text-gray-400">
            Waiting for u to join...
          </div>
        </div>
        {/* Join Button */}

        <div className="z-10 flex items-center justify-center">
          <Link
            href="https://discord.com/invite/coding"
            className="focus:ring-opacity-50 border-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary transform rounded-full border-2 bg-transparent px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:outline-none"
          >
            Join
          </Link>
        </div>
      </div>

      {/* Discord Widget */}
      <div className="hidden w-full max-w-sm lg:block">
        <DiscordWidget className="w-full" />
      </div>
    </div>
  );
}
