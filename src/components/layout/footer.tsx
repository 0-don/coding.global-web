"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="left-0 z-10 flex items-center justify-center gap-5 py-4 text-center">
      <code className="text-sm text-gray-400">
        {process.env.NEXT_PUBLIC_APP_NAME} {new Date().getFullYear()} &copy;{" "}
        <Link
          href="https://github.com/0-don"
          target="_blank"
          rel="noopener noreferrer"
        >
          0-don
        </Link>
      </code>
      <p className="text-sm text-gray-400">|</p>
      <Link
        href="https://github.com/0-don/coding.global-web"
        className="text-sm text-gray-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("MAIN.FOOTER.GET_REPOSITORY")}
      </Link>
    </footer>
  );
}
