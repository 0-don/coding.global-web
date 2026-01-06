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
  javascript: "CODING.JAVASCRIPT.HEADING",
  python: "CODING.PYTHON.HEADING",
  rust: "CODING.RUST.HEADING",
  cpp: "CODING.CPP.HEADING",
  csharp: "CODING.CSHARP.HEADING",
  c: "CODING.C.HEADING",
  go: "CODING.GO.HEADING",
  java: "CODING.JAVA.HEADING",
  kotlin: "CODING.KOTLIN.HEADING",
  dart: "CODING.DART.HEADING",
  lua: "CODING.LUA.HEADING",
  php: "CODING.PHP.HEADING",
  "html-css": "CODING.HTML_CSS.HEADING",
  sql: "CODING.SQL.HEADING",
  swift: "CODING.SWIFT.HEADING",
  "bash-powershell": "CODING.BASH_POWERSHELL.HEADING",
  "visual-basic": "CODING.VISUAL_BASIC.HEADING",
  zig: "CODING.ZIG.HEADING",
  other: "CODING.OTHER.HEADING",
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
