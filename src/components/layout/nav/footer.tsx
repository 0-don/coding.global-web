import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { use } from "react";

export function Footer() {
  const t = use(getTranslations());

  return (
    <footer className="flex items-center justify-center gap-5 py-4 text-center">
      <code className="text-muted-foreground text-sm">
        {process.env.NEXT_PUBLIC_APP_NAME} {new Date().getFullYear()} &copy;{" "}
        <Link href="https://github.com/0-don" target="_blank">
          0-don
        </Link>
      </code>
      <p className="text-muted-foreground text-sm">|</p>
      <Link
        href="https://github.com/0-don/coding.global-web"
        className="text-muted-foreground text-sm"
        target="_blank"
      >
        {t("MAIN.FOOTER.GET_REPOSITORY")}
      </Link>
    </footer>
  );
}
