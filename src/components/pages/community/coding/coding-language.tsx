/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useBoardThreadsQuery } from "@/hook/bot-hook";
import { ProgrammingBoardType } from "@/lib/types";
import { IconType } from "react-icons";

interface CodingLanguageProps {
  boardType: ProgrammingBoardType;
  displayName: string;
  slug: string;
  icon: IconType;
}

export function CodingLanguage(props: CodingLanguageProps) {
  const { data: threads } = useBoardThreadsQuery(props.boardType);

  return (
    <BoardList
      threads={threads ?? []}
      title={props.displayName}
      icon={props.icon}
      showBoardBadge={false}
      boardType={props.boardType}
      getDetailHref={(thread) => ({
        // @ts-ignore
        pathname: `/community/coding/${props.slug}/[id]`,
        params: { id: thread.id },
      })}
    />
  );
}
