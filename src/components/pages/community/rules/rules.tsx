"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FaQuestionCircle } from "react-icons/fa";

type CategoryKey = "GENERAL" | "BEHAVIOR" | "AUTHORITY" | "CONTENT";

interface RuleCategory {
  key: CategoryKey;
  borderColor: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

function getRuleCategory(index: number): RuleCategory {
  // Rules 1-3: General (primary)
  if (index <= 3) {
    return {
      key: "GENERAL",
      borderColor: "border-l-primary",
      badgeVariant: "default",
    };
  }
  // Rules 4, 5, 7, 8: Behavior (yellow)
  if ([4, 5, 7, 8].includes(index)) {
    return {
      key: "BEHAVIOR",
      borderColor: "border-l-yellow-500",
      badgeVariant: "secondary",
    };
  }
  // Rules 6, 9: Authority (red)
  if ([6, 9].includes(index)) {
    return {
      key: "AUTHORITY",
      borderColor: "border-l-red-500",
      badgeVariant: "destructive",
    };
  }
  // Rules 10, 11, 12: Content (green)
  return {
    key: "CONTENT",
    borderColor: "border-l-green-500",
    badgeVariant: "outline",
  };
}

interface RulesTerminalHeaderProps {
  ruleCount: number;
}

function RulesTerminalHeader(props: RulesTerminalHeaderProps) {
  const t = useTranslations();

  return (
    <Card className="border-primary mb-6 font-mono text-sm">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-red-500 h-3 w-3 rounded-full"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </div>

        <div className="flex flex-wrap items-center justify-center space-x-1">
          <span className="text-green-400">{">"}</span>
          <span className="ml-1">{t("RULES.TERMINAL.COMMAND")}</span>
          <span className="text-primary font-bold">
            {t("RULES.TERMINAL.FILENAME")}
          </span>
        </div>

        <div className="animate-pulse text-center text-xs text-muted-foreground">
          {t("RULES.TERMINAL.LOADED", { count: props.ruleCount })}
        </div>
      </CardContent>
    </Card>
  );
}

interface RuleCardProps {
  rule: { title: string; content: string };
  index: number;
}

function RuleCard(props: RuleCardProps) {
  const t = useTranslations();
  const category = getRuleCategory(props.index);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Card
          className={cn(
            "group h-full cursor-pointer overflow-hidden border-l-4 transition-all hover:shadow-lg",
            category.borderColor
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <Badge variant="default" className="font-mono shrink-0">
                #{props.index}
              </Badge>
              <Badge variant={category.badgeVariant} className="text-xs shrink-0">
                {t(`RULES.CATEGORIES.${category.key}`)}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold mt-3 group-hover:underline">
              {props.rule.title}
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
              {props.rule.content}
            </p>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="w-80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="font-mono">
              #{props.index}
            </Badge>
            <span className="font-semibold">{props.rule.title}</span>
          </div>
          <p className="text-sm whitespace-pre-line">{props.rule.content}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function Rules() {
  const t = useTranslations();

  const rules = [
    {
      title: t("RULES.RULE_1.TITLE"),
      content: t("RULES.RULE_1.CONTENT"),
    },
    {
      title: t("RULES.RULE_2.TITLE"),
      content: t("RULES.RULE_2.CONTENT"),
    },
    {
      title: t("RULES.RULE_3.TITLE"),
      content: t("RULES.RULE_3.CONTENT"),
    },
    {
      title: t("RULES.RULE_4.TITLE"),
      content: t("RULES.RULE_4.CONTENT"),
    },
    {
      title: t("RULES.RULE_5.TITLE"),
      content: t("RULES.RULE_5.CONTENT"),
    },
    {
      title: t("RULES.RULE_6.TITLE"),
      content: t("RULES.RULE_6.CONTENT"),
    },
    {
      title: t("RULES.RULE_7.TITLE"),
      content: t("RULES.RULE_7.CONTENT"),
    },
    {
      title: t("RULES.RULE_8.TITLE"),
      content: t("RULES.RULE_8.CONTENT"),
    },
    {
      title: t("RULES.RULE_9.TITLE"),
      content: t("RULES.RULE_9.CONTENT"),
    },
    {
      title: t("RULES.RULE_10.TITLE"),
      content: t("RULES.RULE_10.CONTENT"),
    },
    {
      title: t("RULES.RULE_11.TITLE"),
      content: t("RULES.RULE_11.CONTENT"),
    },
    {
      title: t("RULES.RULE_12.TITLE"),
      content: t("RULES.RULE_12.CONTENT"),
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <FaQuestionCircle className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("RULES.HEADING")}</h1>
      </div>

      <RulesTerminalHeader ruleCount={rules.length} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule, index) => (
          <RuleCard key={rule.title} rule={rule} index={index + 1} />
        ))}
      </div>
    </div>
  );
}
