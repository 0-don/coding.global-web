/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useBoardThreadsQuery } from "@/hook/bot-hook";
import { LanguageChannel } from "@/lib/config/language-channels";
import { BoardType } from "@/lib/types";

interface CodingLanguageProps {
  channel: LanguageChannel;
}

export function CodingLanguage(props: CodingLanguageProps) {
  const { data: threads } = useBoardThreadsQuery(
    props.channel.boardType as BoardType,
  );

  return (
    <BoardList
      threads={threads ?? []}
      title={`${props.channel.displayName}`}
      icon={props.channel.icon}
      showBoardBadge={false}
      boardType={props.channel.boardType as BoardType}
      getDetailHref={(thread) => ({
        // @ts-ignore
        pathname: `/community/coding/${props.channel.slug}/[id]`,
        params: { id: thread.id },
      })}
    />
  );
}
