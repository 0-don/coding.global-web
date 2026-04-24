import { JobBoard } from "@/components/pages/marketplace/job-board";
import { ThreadStoreProvider } from "@/components/provider/store/thread-store-provider";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ThreadState, getThreadStoreKey } from "@/store/thread-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("MARKETPLACE.JOB_BOARD.META.TITLE"),
    description: t("MARKETPLACE.JOB_BOARD.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.JOB_BOARD.META.KEYWORDS"),
    href: "/marketplace/job-board",
  });
}

export default async function JobBoardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const queryClient = getQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads("job-board"),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot.thread({ threadType: "job-board" }).get(),
        ),
    }),
    getCookieValue<ThreadState>(getThreadStoreKey("job-board")),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${baseUrl}/${locale}` },
          { name: "Marketplace", url: `${baseUrl}/${locale}/marketplace` },
          { name: "Job Board" },
        ]}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ThreadStoreProvider threadType="job-board" data={listItemStore}>
          <JobBoard />
        </ThreadStoreProvider>
      </HydrationBoundary>
    </>
  );
}
