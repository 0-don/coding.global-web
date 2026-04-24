import { TOCLayout } from "@/components/layout/resources/toc";
import {
  Python,
  pythonTOC,
} from "@/components/pages/resources/languages/python";
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
    title: t("RESOURCES.PYTHON.META.TITLE"),
    description: t("RESOURCES.PYTHON.META.DESCRIPTION"),
    keywords: t("RESOURCES.PYTHON.META.KEYWORDS"),
    href: "/resources/languages/python",
  });
}

export default async function PythonPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return (
    <>
      <ArticleJsonLd
        data={{
          headline: t("RESOURCES.PYTHON.META.TITLE"),
          description: t("RESOURCES.PYTHON.META.DESCRIPTION"),
          pageUrl: `${process.env.NEXT_PUBLIC_URL}/${locale}/resources/languages/python`,
          inLanguage: locale,
        }}
      />
      <TOCLayout toc={pythonTOC}>
        <Python />
      </TOCLayout>
    </>
  );
}
