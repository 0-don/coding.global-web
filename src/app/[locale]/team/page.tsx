import { LayoutWrapper } from "@/components/container/layout-wrapper";
import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Team } from "@/components/pages/team";
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
    title: t("TEAM.META.TITLE"),
    description: t("TEAM.META.DESCRIPTION"),
    keywords: t("TEAM.META.KEYWORDS"),
  });
}

export default function TeamPage() {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      <Team />
      <Footer />
    </LayoutWrapper>
  );
}
