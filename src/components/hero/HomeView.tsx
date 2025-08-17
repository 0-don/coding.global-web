"use client";

import JoinButton from "../JoinButton";

export default function HomeView() {
  return (
    <div className="text-center">
      <div className="bg-black bg-opacity-70 border border-red-500 p-4 rounded-lg mb-6 text-sm font-mono text-red-400 overflow-hidden">
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-green-400">{'>'}</span>
          <span className="text-gray-300 ml-1">Welcome to</span>
          <span className="text-red-400 font-bold">Coding Global</span>
        </div>
        <div className="text-xs mt-2 text-gray-400 animate-pulse">
          Waiting for u to join...
        </div>
      </div>
    
      <JoinButton />
    </div>
  );
}