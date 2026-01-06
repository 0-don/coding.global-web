"use client";

import { BoardList } from "@/components/elements/boards/board-list";
import { useBoardThreadsQuery } from "@/hook/bot-hook";
import { TranslationKey } from "@/lib/config/constants";
import { ProgrammingBoardType } from "@/lib/types";
import { useTranslations } from "next-intl";
import { IconType } from "react-icons";
import { DiJava } from "react-icons/di";
import { HiOutlineCodeBracket, HiOutlineCommandLine } from "react-icons/hi2";
import {
  SiC,
  SiCplusplus,
  SiDart,
  SiDotnet,
  SiGnubash,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLua,
  SiPhp,
  SiPython,
  SiRust,
  SiSwift,
  SiZig,
} from "react-icons/si";
import { TbSql } from "react-icons/tb";

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

const BOARD_TYPE_ICONS: Record<ProgrammingBoardType, IconType> = {
  javascript: SiJavascript,
  python: SiPython,
  rust: SiRust,
  cpp: SiCplusplus,
  csharp: SiDotnet,
  c: SiC,
  go: SiGo,
  java: DiJava,
  kotlin: SiKotlin,
  dart: SiDart,
  lua: SiLua,
  php: SiPhp,
  "html-css": SiHtml5,
  sql: TbSql,
  swift: SiSwift,
  "bash-powershell": SiGnubash,
  "visual-basic": HiOutlineCommandLine,
  zig: SiZig,
  other: HiOutlineCodeBracket,
};

interface CodingLanguageProps {
  boardType: ProgrammingBoardType;
}

export function CodingLanguage(props: CodingLanguageProps) {
  const t = useTranslations();
  const { data: threads } = useBoardThreadsQuery(props.boardType);

  return (
    <BoardList
      threads={threads ?? []}
      title={t(BOARD_TYPE_TITLE_KEYS[props.boardType])}
      icon={BOARD_TYPE_ICONS[props.boardType]}
      showBoardBadge={false}
      boardType={props.boardType}
      getDetailHref={(thread) => ({
        pathname: `/community/coding/${props.boardType}/[id]`,
        params: { id: thread.id },
      })}
    />
  );
}
