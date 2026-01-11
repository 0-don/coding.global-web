"use client";

import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TweetCard } from "@/components/ui/tweet-card";
import { msg } from "@/lib/config/constants";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Tweet } from "react-tweet/api";
import { ResourceFooter } from "../../../layout/resources/resource-footer";

const toc: TOCItemType[] = [
  {
    url: "#what-is-vibe-coding",
    title: msg("RESOURCES.VIBE_CODING.WHAT_IS_VIBE_CODING.TITLE"),
    depth: 2,
  },
  {
    url: "#choosing-the-best-model",
    title: msg("RESOURCES.VIBE_CODING.CHOOSING_THE_BEST_MODEL.TITLE"),
    depth: 2,
  },
  {
    url: "#my-setup",
    title: msg("RESOURCES.VIBE_CODING.MY_SETUP.TITLE"),
    depth: 2,
  },
  {
    url: "#ai-editors",
    title: msg("RESOURCES.VIBE_CODING.AI_EDITORS.TITLE"),
    depth: 2,
  },
  {
    url: "#ai-clis",
    title: msg("RESOURCES.VIBE_CODING.AI_CLIS.TITLE"),
    depth: 2,
  },
];

export const vibeCodingTOC = createTOC(toc);

const aiEditors = [
  {
    titleKey: msg("RESOURCES.VIBE_CODING.AI_EDITORS.CURSOR.TITLE"),
    descriptionKey: msg("RESOURCES.VIBE_CODING.AI_EDITORS.CURSOR.DESCRIPTION"),
    url: "https://cursor.com/",
  },
  {
    titleKey: msg("RESOURCES.VIBE_CODING.AI_EDITORS.WINDSURF.TITLE"),
    descriptionKey: msg(
      "RESOURCES.VIBE_CODING.AI_EDITORS.WINDSURF.DESCRIPTION",
    ),
    url: "https://codeium.com/windsurf",
  },
  {
    titleKey: msg("RESOURCES.VIBE_CODING.AI_EDITORS.ANTIGRAVITY.TITLE"),
    descriptionKey: msg(
      "RESOURCES.VIBE_CODING.AI_EDITORS.ANTIGRAVITY.DESCRIPTION",
    ),
    url: "https://antigravity.google/",
  },
];

const aiCLIs = [
  {
    titleKey: msg("RESOURCES.VIBE_CODING.AI_CLIS.CLAUDE_CODE.TITLE"),
    descriptionKey: msg(
      "RESOURCES.VIBE_CODING.AI_CLIS.CLAUDE_CODE.DESCRIPTION",
    ),
    url: "https://github.com/anthropics/claude-code",
  },
  {
    titleKey: msg("RESOURCES.VIBE_CODING.AI_CLIS.OPENAI_CODEX.TITLE"),
    descriptionKey: msg(
      "RESOURCES.VIBE_CODING.AI_CLIS.OPENAI_CODEX.DESCRIPTION",
    ),
    url: "https://github.com/openai/codex",
  },
  {
    titleKey: msg("RESOURCES.VIBE_CODING.AI_CLIS.GEMINI_CLI.TITLE"),
    descriptionKey: msg("RESOURCES.VIBE_CODING.AI_CLIS.GEMINI_CLI.DESCRIPTION"),
    url: "https://github.com/google-gemini/gemini-cli",
  },
];

interface VibeCodingProps {
  tweet: Tweet | undefined;
}

export function VibeCoding(props: VibeCodingProps) {
  const t = useTranslations();

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        {t("RESOURCES.VIBE_CODING.TITLE")}
      </h1>

      <section id="what-is-vibe-coding" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.VIBE_CODING.WHAT_IS_VIBE_CODING.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.VIBE_CODING.WHAT_IS_VIBE_CODING.CONTENT_1")}
        </p>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.VIBE_CODING.WHAT_IS_VIBE_CODING.CONTENT_2")}
        </p>
        <div className="mb-4 flex justify-center">
          {props.tweet && <TweetCard tweet={props.tweet} />}
        </div>
        <p className="text-muted-foreground">
          {t("RESOURCES.VIBE_CODING.WHAT_IS_VIBE_CODING.CONTENT_3")}
        </p>
      </section>

      <section id="choosing-the-best-model" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.VIBE_CODING.CHOOSING_THE_BEST_MODEL.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.VIBE_CODING.CHOOSING_THE_BEST_MODEL.CONTENT_1")}{" "}
          <a
            href="https://lmarena.ai/leaderboard/webdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            {t(
              "RESOURCES.VIBE_CODING.CHOOSING_THE_BEST_MODEL.LEADERBOARD_LINK",
            )}
          </a>
          .
        </p>
        <p className="text-muted-foreground">
          {t("RESOURCES.VIBE_CODING.CHOOSING_THE_BEST_MODEL.CONTENT_2")}
        </p>
      </section>

      <section id="my-setup" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.VIBE_CODING.MY_SETUP.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.VIBE_CODING.MY_SETUP.CONTENT_1")}{" "}
          <a
            href="https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            {t("RESOURCES.VIBE_CODING.MY_SETUP.CLAUDE_CODE_LINK")}
          </a>{" "}
          {t("RESOURCES.VIBE_CODING.MY_SETUP.CONTENT_2")}
        </p>
        <p className="text-muted-foreground">
          {t("RESOURCES.VIBE_CODING.MY_SETUP.CONTENT_3")}{" "}
          <a
            href="https://marketplace.visualstudio.com/items?itemName=0-don.code-collector"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            {t("RESOURCES.VIBE_CODING.MY_SETUP.CODE_COLLECTOR_LINK")}
          </a>{" "}
          {t("RESOURCES.VIBE_CODING.MY_SETUP.CONTENT_4")}
        </p>
      </section>

      <section id="ai-editors" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.VIBE_CODING.AI_EDITORS.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.VIBE_CODING.AI_EDITORS.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {aiEditors.map((editor) => (
            <a
              key={editor.url}
              href={editor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(editor.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{t(editor.descriptionKey)}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="ai-clis" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.VIBE_CODING.AI_CLIS.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.VIBE_CODING.AI_CLIS.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {aiCLIs.map((cli) => (
            <a
              key={cli.url}
              href={cli.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(cli.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{t(cli.descriptionKey)}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <ResourceFooter />
    </div>
  );
}
