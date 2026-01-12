"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export function Marketplace() {
  const t = useTranslations();
  const { data: jobThreads } = useThreadsQuery("job-board");
  const { data: devThreads } = useThreadsQuery("dev-board");

  const jobs = jobThreads ?? [];
  const devs = devThreads ?? [];

  // newest first
  const combinedThreads = [...jobs, ...devs].sort(
    (a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
  );

  return (
    <BoardList
      threads={combinedThreads}
      title={t("MARKETPLACE.HEADING")}
      icon={HiOutlineShoppingBag}
      showBoardBadge={true}
      threadType="marketplace"
      getDetailHref={(thread) => ({
        pathname: "/marketplace/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
