"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useBoardThreadsQuery } from "@/hook/bot-hook";
import { TranslationKey } from "@/lib/config/constants";
import { ProgrammingBoardType } from "@/lib/types";
import { useTranslations } from "next-intl";
import { IconType } from "react-icons";

const BOARD_TYPE_TITLE_KEYS: Record<ProgrammingBoardType, TranslationKey> = {
  javascript: "CODING.JAVASCRIPT.META.TITLE",
  python: "CODING.PYTHON.META.TITLE",
  rust: "CODING.RUST.META.TITLE",
  cpp: "CODING.CPP.META.TITLE",
  csharp: "CODING.CSHARP.META.TITLE",
  c: "CODING.C.META.TITLE",
  go: "CODING.GO.META.TITLE",
  java: "CODING.JAVA.META.TITLE",
  kotlin: "CODING.KOTLIN.META.TITLE",
  dart: "CODING.DART.META.TITLE",
  lua: "CODING.LUA.META.TITLE",
  php: "CODING.PHP.META.TITLE",
  "html-css": "CODING.HTML_CSS.META.TITLE",
  sql: "CODING.SQL.META.TITLE",
  swift: "CODING.SWIFT.META.TITLE",
  "bash-powershell": "CODING.BASH_POWERSHELL.META.TITLE",
  "visual-basic": "CODING.VISUAL_BASIC.META.TITLE",
  zig: "CODING.ZIG.META.TITLE",
  other: "CODING.OTHER.META.TITLE",
};

interface CodingLanguageProps {
  boardType: ProgrammingBoardType;
  icon: IconType;
}

export function CodingLanguage(props: CodingLanguageProps) {
  const t = useTranslations();
  const { data: threads } = useBoardThreadsQuery(props.boardType);

  return (
    <BoardList
      threads={threads ?? []}
      title={t(BOARD_TYPE_TITLE_KEYS[props.boardType])}
      icon={props.icon}
      showBoardBadge={false}
      boardType={props.boardType}
      getDetailHref={(thread) => ({
        pathname: `/community/coding/${props.boardType}/[id]`,
        params: { id: thread.id },
      })}
    />
  );
}
