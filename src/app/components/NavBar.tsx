"use client";

import { useSection } from "../context/SectionContext";
import logo from "@/media/cgLogo.gif";
import Image from "next/image";

export default function Navbar() {
  const { section, setSection } = useSection();

  return (
    <div className="absolute top-8 left-0 right-0 flex items-center justify-center z-10">
      <div className="flex items-center justify-between w-fit gap-7 max-w-6xl px-6 py-3 bg-black bg-opacity-70 backdrop-blur-sm rounded-full border border-red-500 shadow-lg">
        <button
          onClick={() => window.open('https://disboard.org/server/693908458986143824', "_blank")}
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          Disboard
        </button>
        <button
          onClick={() => setSection("team")}
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          Team
        </button>

        <div className="relative">
          <Image
            src={logo}
            alt="Logo"
            width={60}
            height={60}
            onClick={() => setSection("home")}
            className="rounded-full border-2 border-red-500 cursor-pointer"
          />
        </div>

        <button
          onClick={() => setSection("news")}
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          News
        </button>
        <button
          onClick={() => setSection("rules")}
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          Rules
        </button>
      </div>
    </div>
  );
}