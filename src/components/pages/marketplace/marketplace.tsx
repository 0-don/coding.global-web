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
  const { data: jobThreads } = useJobBoardThreadsQuery();
  const { data: devThreads } = useDevBoardThreadsQuery();

  const combinedThreads = useMemo(() => {
    const jobs = jobThreads ?? [];
    const devs = devThreads ?? [];

    // newest first
    return [...jobs, ...devs].sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    );
  }, [jobThreads, devThreads]);

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
