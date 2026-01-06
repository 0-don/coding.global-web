import { CodingLanguage } from "@/components/pages/community/coding/coding-language";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { ProgrammingBoardType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ListItemState, getListItemStoreKey } from "@/store/list-item-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { SiZig } from "react-icons/si";

const BOARD_TYPE: ProgrammingBoardType = "zig";
const SLUG = "zig";
const DISPLAY_NAME = "Zig";

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
      queryKey: queryKeys.boardThreads(BOARD_TYPE),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: BOARD_TYPE }).get()),
    }),
    getCookieValue<ListItemState>(getListItemStoreKey(BOARD_TYPE)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListItemStoreProvider boardType={BOARD_TYPE} data={listItemStore}>
        <CodingLanguage
          boardType={BOARD_TYPE}
          slug={SLUG}
          displayName={DISPLAY_NAME}
          icon={SiZig}
        />
      </ListItemStoreProvider>
    </HydrationBoundary>
  );
}
