"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoginButton } from "@/components/auth/login-button";
import { UserDisplay } from "@/components/auth/user-display";

export function Navbar() {
  const t = useTranslations();

  return (
    <div className="fixed top-3 left-0 right-0 flex items-center justify-center z-20">
      <div className="flex items-center justify-between w-fit gap-7 max-w-6xl px-6 py-3 bg-black bg-opacity-70 backdrop-blur-sm rounded-full border border-red-500 shadow-lg">
        <button
          onClick={() =>
            window.open(
              "https://disboard.org/server/693908458986143824",
              "_blank",
            )
          }
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          {t("MAIN.BUTTON.DISBOARD")}
        </button>

        <Link
          href="/team"
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          {t("MAIN.NAVIGATION.TEAM")}
        </Link>

        <Link href="/" className="relative hidden md:block cursor-pointer">
          <Image
            src={"/cgLogo.gif"}
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full border-2 border-red-500"
            unoptimized
          />
        </Link>

        <Link
          href="/news"
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          {t("MAIN.NAVIGATION.NEWS")}
        </Link>
        <Link
          href="/rules"
          className="text-white font-semibold hover:bg-red-500 hover:text-black py-2 px-4 rounded-full transition-all duration-200"
        >
          {t("MAIN.NAVIGATION.RULES")}
        </Link>

        {/* Auth components */}
        <div className="flex items-center gap-3">
          <UserDisplay />
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
