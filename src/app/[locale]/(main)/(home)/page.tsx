import { Home } from "@/components/pages/home";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("HOME.META.TITLE"),
    description: t("HOME.META.DESCRIPTION"),
    keywords: t("HOME.META.KEYWORDS"),
  });
}

export default function Main() {
  return <Home />;
}
