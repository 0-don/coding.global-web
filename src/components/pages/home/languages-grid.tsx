"use client";

import { motion, useInView } from "motion/react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Link from "next/link";
import {
  SiJavascript,
  SiPython,
  SiRust,
  SiCplusplus,
  SiC,
  SiGo,
  SiKotlin,
  SiDart,
  SiLua,
  SiPhp,
  SiHtml5,
  SiSwift,
  SiZig,
  SiGnubash,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { TbBrandCSharp, TbSql } from "react-icons/tb";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import type { IconType } from "react-icons";

const LANGUAGES: Array<{
  name: string;
  icon: IconType;
  href: string;
  color: string;
}> = [
  { name: "JavaScript", icon: SiJavascript, href: "/community/coding/javascript", color: "#F7DF1E" },
  { name: "Python", icon: SiPython, href: "/community/coding/python", color: "#3776AB" },
  { name: "Rust", icon: SiRust, href: "/community/coding/rust", color: "#CE422B" },
  { name: "C++", icon: SiCplusplus, href: "/community/coding/cpp", color: "#00599C" },
  { name: "C#", icon: TbBrandCSharp, href: "/community/coding/csharp", color: "#239120" },
  { name: "C", icon: SiC, href: "/community/coding/c", color: "#A8B9CC" },
  { name: "Go", icon: SiGo, href: "/community/coding/go", color: "#00ADD8" },
  { name: "Java", icon: DiJava, href: "/community/coding/java", color: "#007396" },
  { name: "Kotlin", icon: SiKotlin, href: "/community/coding/kotlin", color: "#7F52FF" },
  { name: "Dart", icon: SiDart, href: "/community/coding/dart", color: "#0175C2" },
  { name: "Lua", icon: SiLua, href: "/community/coding/lua", color: "#2C2D72" },
  { name: "PHP", icon: SiPhp, href: "/community/coding/php", color: "#777BB4" },
  { name: "HTML/CSS", icon: SiHtml5, href: "/community/coding/html-css", color: "#E34F26" },
  { name: "SQL", icon: TbSql, href: "/community/coding/sql", color: "#4479A1" },
  { name: "Swift", icon: SiSwift, href: "/community/coding/swift", color: "#FA7343" },
  { name: "Bash", icon: SiGnubash, href: "/community/coding/bash-powershell", color: "#4EAA25" },
  { name: "VB", icon: HiOutlineCodeBracket, href: "/community/coding/visual-basic", color: "#945DB7" },
  { name: "Zig", icon: SiZig, href: "/community/coding/zig", color: "#F7A41D" },
];

interface LanguageCardProps {
  language: (typeof LANGUAGES)[0];
  index: number;
  inView: boolean;
}

function LanguageCard(props: LanguageCardProps) {
  const Icon = props.language.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={props.inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.4,
        delay: props.index * 0.05,
        ease: "easeOut",
      }}
    >
      <Link href={props.language.href}>
        <motion.div
          whileHover={{
            scale: 1.1,
            rotate: [0, -3, 3, 0],
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Card className="hover:border-primary flex h-24 cursor-pointer flex-col items-center justify-center gap-2 p-4 transition-colors md:h-28">
            <Icon
              className="h-8 w-8 md:h-10 md:w-10"
              style={{ color: props.language.color }}
            />
            <span className="text-center text-xs font-medium md:text-sm">
              {props.language.name}
            </span>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function LanguagesGrid() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          {t("HOME.LANGUAGES_TITLE")}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t("HOME.LANGUAGES_SUBTITLE")}
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {LANGUAGES.map((lang, index) => (
          <LanguageCard
            key={lang.name}
            language={lang}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
