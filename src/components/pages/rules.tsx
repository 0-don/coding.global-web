"use client";

import { useTranslations } from "next-intl";

export function Rules() {
  const t = useTranslations("RULES");

  const rules = [
    {
      title: t("RULE_1.TITLE"),
      content: t("RULE_1.CONTENT"),
    },
    {
      title: t("RULE_2.TITLE"),
      content: t("RULE_2.CONTENT"),
    },
    {
      title: t("RULE_3.TITLE"),
      content: t("RULE_3.CONTENT"),
    },
    {
      title: t("RULE_4.TITLE"),
      content: t("RULE_4.CONTENT"),
    },
    {
      title: t("RULE_5.TITLE"),
      content: t("RULE_5.CONTENT"),
    },
    {
      title: t("RULE_6.TITLE"),
      content: t("RULE_6.CONTENT"),
    },
    {
      title: t("RULE_7.TITLE"),
      content: t("RULE_7.CONTENT"),
    },
    {
      title: t("RULE_8.TITLE"),
      content: t("RULE_8.CONTENT"),
    },
    {
      title: t("RULE_9.TITLE"),
      content: t("RULE_9.CONTENT"),
    },
    {
      title: t("RULE_10.TITLE"),
      content: t("RULE_10.CONTENT"),
    },
    {
      title: t("RULE_11.TITLE"),
      content: t("RULE_11.CONTENT"),
    },
    {
      title: t("RULE_12.TITLE"),
      content: t("RULE_12.CONTENT"),
    },
  ];

  return (
    <div className="absolute top-30 left-0 z-10 min-h-screen w-full text-white">
      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        {/* <h1 className="text-3xl font-bold text-red-500 text-center py-6">
          📜 Community Guidelines
        </h1> */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-primary p-5 shadow-md backdrop-blur-2xl transition duration-300 hover:shadow-lg"
            >
              <h2 className="mb-2 text-lg font-semibold text-primary">
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
