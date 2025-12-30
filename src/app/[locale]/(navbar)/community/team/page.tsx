import { Team } from "@/components/pages/community/team/team";
import { TeamSkeleton } from "@/components/pages/community/team/team-skeleton";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
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
  const queryClient = getQueryClient();

  const [, t] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.team(),
      queryFn: async () => handleElysia(await rpc.api.bot.team.get()),
    }),
    getTranslations(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <Suspense fallback={<TeamSkeleton title={t("TEAM.HEADING")} />}> */}
      <Team />
      {/* </Suspense> */}
    </HydrationBoundary>
  );
}
