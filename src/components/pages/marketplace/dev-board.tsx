"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useDevBoardThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineCodeBracket } from "react-icons/hi2";

export function DevBoard() {
  const t = useTranslations();
  const devBoardQuery = useDevBoardThreadsQuery();

  const threads = devBoardQuery.data || [];

  return (
    <BoardList
      threads={threads}
      title={t("MARKETPLACE.DEV_BOARD.HEADING")}
      icon={HiOutlineCodeBracket}
      showBoardBadge={false}
      boardType="dev-board"
      getDetailHref={(thread) => ({
        pathname: "/marketplace/dev-board/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
