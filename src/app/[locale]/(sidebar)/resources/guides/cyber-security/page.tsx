import { TOCLayout } from "@/components/layout/resources/toc";
import {
  CyberSecurity,
  cyberSecurityTOC,
} from "@/components/pages/resources/guides/cyber-security";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
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
    href: "/resources/guides/cyber-security",
  });
}

export default async function CyberSecurityPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return (
    <>
      <ArticleJsonLd
        data={{
          headline: t("RESOURCES.CYBER_SECURITY.META.TITLE"),
          description: t("RESOURCES.CYBER_SECURITY.META.DESCRIPTION"),
          pageUrl: `${process.env.NEXT_PUBLIC_URL}/${locale}/resources/guides/cyber-security`,
          inLanguage: locale,
        }}
      />
      <TOCLayout toc={cyberSecurityTOC}>
        <CyberSecurity />
      </TOCLayout>
    </>
  );
}
