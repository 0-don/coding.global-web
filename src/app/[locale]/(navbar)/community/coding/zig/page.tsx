import { CodingLanguage } from "@/components/pages/community/coding/coding-language";
import { ThreadStoreProvider } from "@/components/provider/store/thread-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { ProgrammingThreadType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ThreadState, getThreadStoreKey } from "@/store/thread-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

const BOARD_TYPE: ProgrammingThreadType = "zig";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("CODING.ZIG.META.TITLE"),
    description: t("CODING.ZIG.META.DESCRIPTION"),
    keywords: t("CODING.ZIG.META.KEYWORDS"),
  });
}

export default async function ZigPage() {
  const queryClient = getQueryClient();

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads(BOARD_TYPE),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.thread({ threadType: BOARD_TYPE }).get()),
    }),
    getCookieValue<ThreadState>(getThreadStoreKey(BOARD_TYPE)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadStoreProvider threadType={BOARD_TYPE} data={listItemStore}>
        <CodingLanguage threadType={BOARD_TYPE} />
      </ThreadStoreProvider>
    </HydrationBoundary>
  );
}
