import NotFound from "@/components/layout/not-found";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("METADATA.NOT_FOUND.TITLE"),
    description: t("METADATA.NOT_FOUND.DESCRIPTION"),
    keywords: t("METADATA.NOT_FOUND.KEYWORDS"),
    robots: false,
  });
}

export default function NotFoundPage() {
  return <NotFound />;
}
