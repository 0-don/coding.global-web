import { CodingLanguage } from "@/components/pages/community/coding/coding-language";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { LANGUAGE_CHANNELS } from "@/lib/config/language-channels";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { BoardType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ListItemState, getListItemStoreKey } from "@/store/list-item-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

const CHANNEL = LANGUAGE_CHANNELS.find((c) => c.slug === "rust")!;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("CODING.RUST.META.TITLE"),
    description: t("CODING.RUST.META.DESCRIPTION"),
    keywords: t("CODING.RUST.META.KEYWORDS"),
  });
}

export default async function RustPage() {
  const queryClient = getQueryClient();

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads(CHANNEL.boardType as BoardType),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot.board({ boardType: CHANNEL.boardType }).get(),
        ),
    }),
    getCookieValue<ListItemState>(
      getListItemStoreKey(CHANNEL.boardType as BoardType),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListItemStoreProvider
        boardType={CHANNEL.boardType as BoardType}
        data={listItemStore}
      >
        <CodingLanguage channel={CHANNEL} />
      </ListItemStoreProvider>
    </HydrationBoundary>
  );
}
