import { getPageMetadata } from "@/lib/config/metadata";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NotFound from "../../components/layout/not-found";

export async function generateMetadata(): Promise<Metadata> {
  // Get locale from cookies or headers as fallback for not-found pages
  const locale = "en" as Locale; // Default locale for 404 pages
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("METADATA.NOT_FOUND.TITLE", {
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    }),
    description: t("METADATA.NOT_FOUND.DESCRIPTION"),
    keywords: t("METADATA.NOT_FOUND.KEYWORDS"),
    robots: false,
  });
}

export default function NotFoundPage() {
  return <NotFound />;
}
