import { LayoutWrapper } from "@/components/container/layout-wrapper";
import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { News } from "@/components/pages/news";
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
    title: t("NEWS.META.TITLE"),
    description: t("NEWS.META.DESCRIPTION"),
    keywords: t("NEWS.META.KEYWORDS"),
  });
}

export default function NewsPage() {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      <News />
      <Footer />
    </LayoutWrapper>
  );
}
