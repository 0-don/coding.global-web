"use client";

import { useTranslations } from "next-intl";
import { FaQuestionCircle } from "react-icons/fa";

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
    <div className="absolute top-30 left-0 z-10 min-h-screen w-full">
      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <div className="flex items-center justify-center gap-2 py-6">
          <FaQuestionCircle className="text-3xl" />
          <h1 className="text-3xl font-bold">{t("RULES.HEADING")}</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="border-primary rounded-xl border p-5 shadow-md backdrop-blur-2xl transition duration-300 hover:shadow-lg"
            >
              <h2 className="text-primary mb-2 text-lg font-semibold">
                {rule.title}
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-300">
                {rule.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
