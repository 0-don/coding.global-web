import { TOCLayout } from "@/components/layout/resources/toc";
import {
  Javascript,
  javascriptTOC,
} from "@/components/pages/resources/languages/javascript";
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
    title: t("RESOURCES.JAVASCRIPT.META.TITLE"),
    description: t("RESOURCES.JAVASCRIPT.META.DESCRIPTION"),
    keywords: t("RESOURCES.JAVASCRIPT.META.KEYWORDS"),
    href: "/resources/languages/javascript",
  });
}

export default async function JavascriptPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return (
    <>
      <ArticleJsonLd
        data={{
          headline: t("RESOURCES.JAVASCRIPT.META.TITLE"),
          description: t("RESOURCES.JAVASCRIPT.META.DESCRIPTION"),
          pageUrl: `${process.env.NEXT_PUBLIC_URL}/${locale}/resources/languages/javascript`,
          inLanguage: locale,
        }}
      />
      <TOCLayout toc={javascriptTOC}>
        <Javascript />
      </TOCLayout>
    </>
  );
}
