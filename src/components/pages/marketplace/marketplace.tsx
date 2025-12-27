"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import {
  useDevBoardThreadsQuery,
  useJobBoardThreadsQuery,
} from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export function Marketplace() {
  const t = useTranslations();
  const jobBoardQuery = useJobBoardThreadsQuery();
  const devBoardQuery = useDevBoardThreadsQuery();

  const combinedThreads = useMemo(() => {
    const jobThreads = jobBoardQuery.data || [];
    const devThreads = devBoardQuery.data || [];

    // newest first
    return [...jobThreads, ...devThreads].sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    );
  }, [jobBoardQuery.data, devBoardQuery.data]);

  return (
    <BoardList
      threads={combinedThreads}
      title={t("MARKETPLACE.HEADING")}
      icon={HiOutlineShoppingBag}
      showBoardBadge={true}
      boardType="marketplace"
      getDetailHref={(thread) => ({
        pathname: "/marketplace/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
