"use client";

import { JoinButton } from "../elements/join-button";

export function Home() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-opacity-70 mb-6 rounded-lg border border-primary bg-black p-4 font-mono text-sm text-primary shadow-lg">
          <div className="mb-2 flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-primary"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-1">
            <span className="text-green-400">{">"}</span>
            <span className="ml-1 text-gray-300">Welcome to</span>
            <span className="font-bold text-primary">
              Coding Global Website
            </span>
          </div>

          <div className="mt-2 animate-pulse text-xs text-gray-400">
            Waiting for u to join...
          </div>
        </div>

        {/* Join Button */}
        <JoinButton />
      </div>
    </div>
  );
}
