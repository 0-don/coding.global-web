import { TOCLayout } from "@/components/layout/resources/toc";
import {
  CyberSecurity,
  cyberSecurityTOC,
} from "@/components/pages/resources/guides/cyber-security";
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
    title: t("RESOURCES.CYBER_SECURITY.META.TITLE"),
    description: t("RESOURCES.CYBER_SECURITY.META.DESCRIPTION"),
    keywords: t("RESOURCES.CYBER_SECURITY.META.KEYWORDS"),
  });
}

export default function CyberSecurityPage() {
  return (
    <TOCLayout toc={cyberSecurityTOC}>
      <CyberSecurity />
    </TOCLayout>
  );
}
