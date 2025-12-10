"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-center gap-5 py-4 text-center">
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
