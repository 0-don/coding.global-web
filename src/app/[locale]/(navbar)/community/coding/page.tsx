import { CodingIndex } from "@/components/pages/community/coding/coding-index";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
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
    title: t("CODING.META.TITLE"),
    description: t("CODING.META.DESCRIPTION"),
    keywords: t("CODING.META.KEYWORDS"),
    href: "/community/coding",
  });
}

export default async function CodingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${baseUrl}/${locale}` },
          { name: "Community", url: `${baseUrl}/${locale}/community/coding` },
          { name: "Coding" },
        ]}
      />
      <CodingIndex />
    </>
  );
}
