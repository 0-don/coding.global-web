"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineTrophy } from "react-icons/hi2";

export function Showcase() {
  const t = useTranslations();
  const { data: threads } = useThreadsQuery("showcase");

  return (
    <BoardList
      threads={threads ?? []}
      title={t("SHOWCASE.HEADING")}
      icon={HiOutlineTrophy}
      showBoardBadge={false}
      threadType="showcase"
      getDetailHref={(thread) => ({
        pathname: "/community/showcase/[id]",
        params: { id: thread.id },
      })}
    />
  );
}
