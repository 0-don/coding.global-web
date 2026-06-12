import { Privacy } from "@/components/pages/privacy/privacy";
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
    title: t("PRIVACY.META.TITLE"),
    description: t("PRIVACY.META.DESCRIPTION"),
    keywords: t("PRIVACY.META.KEYWORDS"),
    href: "/privacy",
  });
}

export default function PrivacyPage() {
  return <Privacy />;
}
