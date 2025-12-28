import { Team } from "@/components/pages/team/team";
import { TeamSkeleton } from "@/components/pages/team/team-skeleton";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

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

export default async function TeamPage() {
  const t = await getTranslations();

  return (
    <Suspense fallback={<TeamSkeleton title={t("TEAM.HEADING")} />}>
      <Team />
    </Suspense>
  );
}
