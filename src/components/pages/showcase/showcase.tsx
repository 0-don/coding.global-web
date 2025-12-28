"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useShowcaseThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineTrophy } from "react-icons/hi2";

export function Showcase() {
  const t = useTranslations();
  const { data: threads } = useShowcaseThreadsQuery();

  return (
    <BoardList
      threads={threads ?? []}
      title={t("SHOWCASE.HEADING")}
      icon={HiOutlineTrophy}
      showBoardBadge={false}
      boardType="showcase"
      getDetailHref={(thread) => ({
        pathname: "/showcase/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
