import { IconType } from "react-icons";
import { DiJava } from "react-icons/di";
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
import { HiOutlineCode, HiOutlineTerminal } from "react-icons/hi";

export interface LanguageChannel {
  slug: string;
  boardType: string;
  displayName: string;
  icon: IconType;
}

export const LANGUAGE_CHANNELS: LanguageChannel[] = [
  { slug: "cpp", boardType: "c++", displayName: "C++", icon: SiCplusplus },
  { slug: "csharp", boardType: "c#", displayName: "C#", icon: SiDotnet },
  { slug: "c", boardType: "c", displayName: "C", icon: SiC },
  { slug: "dart", boardType: "dart", displayName: "Dart", icon: SiDart },
  { slug: "lua", boardType: "lua", displayName: "Lua", icon: SiLua },
  { slug: "go", boardType: "go", displayName: "Go", icon: SiGo },
  { slug: "html-css", boardType: "html／css", displayName: "HTML/CSS", icon: SiHtml5 },
  { slug: "java", boardType: "java", displayName: "Java", icon: DiJava },
  { slug: "javascript", boardType: "javascript", displayName: "JavaScript", icon: SiJavascript },
  { slug: "kotlin", boardType: "kotlin", displayName: "Kotlin", icon: SiKotlin },
  { slug: "python", boardType: "python", displayName: "Python", icon: SiPython },
  { slug: "rust", boardType: "rust", displayName: "Rust", icon: SiRust },
  { slug: "php", boardType: "php", displayName: "PHP", icon: SiPhp },
  { slug: "bash-powershell", boardType: "bash-powershell", displayName: "Bash/PowerShell", icon: SiGnubash },
  { slug: "sql", boardType: "sql", displayName: "SQL", icon: TbSql },
  { slug: "swift", boardType: "swift", displayName: "Swift", icon: SiSwift },
  { slug: "visual-basic", boardType: "visual-basic", displayName: "Visual Basic", icon: HiOutlineTerminal },
  { slug: "zig", boardType: "zig", displayName: "Zig", icon: SiZig },
  { slug: "other", boardType: "other", displayName: "Other", icon: HiOutlineCode },
];

export function getLanguageChannelBySlug(slug: string): LanguageChannel | undefined {
  return LANGUAGE_CHANNELS.find((c) => c.slug === slug);
}

export function getLanguageChannelByBoardType(boardType: string): LanguageChannel | undefined {
  return LANGUAGE_CHANNELS.find((c) => c.boardType === boardType);
}
