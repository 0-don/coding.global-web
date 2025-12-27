"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useJobBoardThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineBriefcase } from "react-icons/hi2";

export function JobBoard() {
  const t = useTranslations();
  const jobBoardQuery = useJobBoardThreadsQuery();

  const threads = jobBoardQuery.data || [];

  return (
    <BoardList
      threads={threads}
      title={t("MARKETPLACE.JOB_BOARD.HEADING")}
      icon={HiOutlineBriefcase}
      showBoardBadge={false}
      boardType="job-board"
      getDetailHref={(thread) => ({
        pathname: "/marketplace/job-board/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
