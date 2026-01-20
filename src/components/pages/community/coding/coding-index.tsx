"use client";

import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { PROGRAMMING_LANGUAGES, ProgrammingThreadType } from "@/lib/types";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { DiJava } from "react-icons/di";
import { HiOutlineCodeBracket, HiOutlineCommandLine } from "react-icons/hi2";
import { IconType } from "react-icons/lib";
import {
  SiC,
  SiCplusplus,
  SiDart,
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
import { TbBrandCSharp, TbSql } from "react-icons/tb";
import { TranslationKey } from "@/lib/config/constants";

const LANGUAGE_CONFIG: Record<
  ProgrammingThreadType,
  { icon: IconType; color: string }
> = {
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  python: { icon: SiPython, color: "#3776AB" },
  rust: { icon: SiRust, color: "#CE422B" },
  cpp: { icon: SiCplusplus, color: "#00599C" },
  csharp: { icon: TbBrandCSharp, color: "#239120" },
  c: { icon: SiC, color: "#A8B9CC" },
  go: { icon: SiGo, color: "#00ADD8" },
  java: { icon: DiJava, color: "#007396" },
  kotlin: { icon: SiKotlin, color: "#7F52FF" },
  dart: { icon: SiDart, color: "#0175C2" },
  lua: { icon: SiLua, color: "#2C2D72" },
  php: { icon: SiPhp, color: "#777BB4" },
  "html-css": { icon: SiHtml5, color: "#E34F26" },
  sql: { icon: TbSql, color: "#4479A1" },
  swift: { icon: SiSwift, color: "#FA7343" },
  "bash-powershell": { icon: SiGnubash, color: "#4EAA25" },
  "visual-basic": { icon: HiOutlineCommandLine, color: "#945DB7" },
  zig: { icon: SiZig, color: "#F7A41D" },
  other: { icon: HiOutlineCodeBracket, color: "#6B7280" },
};

function getTranslationKey(language: ProgrammingThreadType): Uppercase<string> {
  return language.toUpperCase().replace(/-/g, "-") as Uppercase<string>;
}

interface LanguageCardProps {
  language: ProgrammingThreadType;
  index: number;
  inView: boolean;
}

function LanguageCard(props: LanguageCardProps) {
  const t = useTranslations();
  const config = LANGUAGE_CONFIG[props.language];
  const translationKey = getTranslationKey(props.language);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={props.inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: props.index * 0.05,
        ease: "easeOut",
      }}
    >
      <Link
        href={{
          pathname: "/community/coding/[language]",
          params: { language: props.language },
        }}
      >
        <Card className="hover:border-primary group flex h-full cursor-pointer flex-col gap-3 p-6 transition-colors">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <Icon className="h-6 w-6" style={{ color: config.color }} />
            </div>
            <h3 className="text-lg font-semibold">
              {t(`CODING.${translationKey}.HEADING` as TranslationKey)}
            </h3>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {t(`CODING.${translationKey}.META.DESCRIPTION` as TranslationKey)}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}

export function CodingIndex() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">{t("CODING.HEADING")}</h1>
        <p className="text-muted-foreground text-lg">{t("CODING.SUBTITLE")}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAMMING_LANGUAGES.map((language, index) => (
          <LanguageCard
            key={language}
            language={language}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
