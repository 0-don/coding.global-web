"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoginButton } from "@/components/auth/login-button";
import { UserDisplay } from "@/components/auth/user-display";

export function Navbar() {
  const t = useTranslations();

  return (
    <div className="fixed top-3 right-0 left-0 z-20 flex items-center justify-center">
      <div className="bg-opacity-70 flex w-fit max-w-6xl items-center justify-between gap-7 rounded-full border border-red-500 bg-black px-6 py-3 shadow-lg backdrop-blur-sm">
        <button
          onClick={() =>
            window.open(
              "https://disboard.org/server/693908458986143824",
              "_blank",
            )
          }
          className="rounded-full px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black"
        >
          {t("MAIN.BUTTON.DISBOARD")}
        </button>

        <Link
          href="/team"
          className="rounded-full px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black"
        >
          {t("MAIN.NAVIGATION.TEAM")}
        </Link>

        <Link href="/" className="relative hidden cursor-pointer md:block">
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
          className="rounded-full px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black"
        >
          {t("MAIN.NAVIGATION.NEWS")}
        </Link>
        <Link
          href="/rules"
          className="rounded-full px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black"
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
