"use client";

import { BoardList } from "@/components/elements/board/board-list";
import { useJobBoardThreadsQuery, useDevBoardThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useMemo } from "react";

export function Marketplace() {
  const t = useTranslations();
  const jobBoardQuery = useJobBoardThreadsQuery();
  const devBoardQuery = useDevBoardThreadsQuery();

  // Combine both boards
  const combinedThreads = useMemo(() => {
    const jobThreads = jobBoardQuery.data || [];
    const devThreads = devBoardQuery.data || [];

    // Sort by createdAt descending (newest first)
    return [...jobThreads, ...devThreads].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
