"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineBriefcase } from "react-icons/hi2";

export function JobBoard() {
  const t = useTranslations();
  const { data: threads } = useThreadsQuery("job-board");

  return (
    <BoardList
      threads={threads ?? []}
      title={t("MARKETPLACE.JOB_BOARD.HEADING")}
      icon={HiOutlineBriefcase}
      showBoardBadge={false}
      threadType="job-board"
      getDetailHref={(thread) => ({
        pathname: "/marketplace/job-board/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
