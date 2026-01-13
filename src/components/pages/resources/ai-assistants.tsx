"use client";

import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { msg } from "@/lib/config/constants";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { ResourceFooter } from "../../layout/resources/resource-footer";

const toc: TOCItemType[] = [
  {
    url: "#chatbots",
    title: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.TITLE"),
    depth: 2,
  },
  {
    url: "#coding-assistants",
    title: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.TITLE"),
    depth: 2,
  },
  {
    url: "#image-generation",
    title: msg("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.TITLE"),
    depth: 2,
  },
  {
    url: "#search-engines",
    title: msg("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.TITLE"),
    depth: 2,
  },
];

export const aiAssistantsTOC = createTOC(toc);

const chatbots = [
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.CHATGPT.TITLE"),
    descriptionKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.CHATGPT.DESCRIPTION"),
    url: "https://chat.openai.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.CLAUDE.TITLE"),
    descriptionKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.CLAUDE.DESCRIPTION"),
    url: "https://claude.ai/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.GEMINI.TITLE"),
    descriptionKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.GEMINI.DESCRIPTION"),
    url: "https://gemini.google.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.COPILOT.TITLE"),
    descriptionKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.COPILOT.DESCRIPTION"),
    url: "https://copilot.microsoft.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.GROK.TITLE"),
    descriptionKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.GROK.DESCRIPTION"),
    url: "https://grok.x.ai/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.DEEPSEEK.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CHATBOTS.DEEPSEEK.DESCRIPTION"
    ),
    url: "https://chat.deepseek.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.LLAMA.TITLE"),
    descriptionKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.LLAMA.DESCRIPTION"),
    url: "https://www.meta.ai/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CHATBOTS.HUGGINGCHAT.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CHATBOTS.HUGGINGCHAT.DESCRIPTION"
    ),
    url: "https://huggingface.co/chat/",
  },
];

const codingAssistants = [
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.GITHUB_COPILOT.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.GITHUB_COPILOT.DESCRIPTION"
    ),
    url: "https://github.com/features/copilot",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.CURSOR.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.CURSOR.DESCRIPTION"
    ),
    url: "https://cursor.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.CODEIUM.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.CODEIUM.DESCRIPTION"
    ),
    url: "https://codeium.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.TABNINE.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.TABNINE.DESCRIPTION"
    ),
    url: "https://www.tabnine.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.REPLIT.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.REPLIT.DESCRIPTION"
    ),
    url: "https://replit.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.BLACKBOX.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.BLACKBOX.DESCRIPTION"
    ),
    url: "https://www.blackbox.ai/",
  },
];

const imageGeneration = [
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.DALL_E.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.DALL_E.DESCRIPTION"
    ),
    url: "https://openai.com/dall-e-3",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.MIDJOURNEY.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.MIDJOURNEY.DESCRIPTION"
    ),
    url: "https://www.midjourney.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.LEONARDO.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.LEONARDO.DESCRIPTION"
    ),
    url: "https://leonardo.ai/",
  },
  {
    titleKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.STABLE_DIFFUSION.TITLE"
    ),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.STABLE_DIFFUSION.DESCRIPTION"
    ),
    url: "https://stability.ai/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.IDEOGRAM.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.IDEOGRAM.DESCRIPTION"
    ),
    url: "https://ideogram.ai/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.BING_IMAGE.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.BING_IMAGE.DESCRIPTION"
    ),
    url: "https://www.bing.com/images/create",
  },
];

const searchEngines = [
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.PERPLEXITY.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.PERPLEXITY.DESCRIPTION"
    ),
    url: "https://www.perplexity.ai/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.YOU.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.YOU.DESCRIPTION"
    ),
    url: "https://you.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.PHIND.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.PHIND.DESCRIPTION"
    ),
    url: "https://www.phind.com/",
  },
  {
    titleKey: msg("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.KAGI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.KAGI.DESCRIPTION"
    ),
    url: "https://kagi.com/",
  },
];

export function AiAssistants() {
  const t = useTranslations();

  return (
    <div className="px-8 py-8">
      <h1 className="mb-4 text-3xl font-bold">
        {t("RESOURCES.AI_ASSISTANTS.TITLE")}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t("RESOURCES.AI_ASSISTANTS.DESCRIPTION")}
      </p>

      <section id="chatbots" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.AI_ASSISTANTS.CHATBOTS.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.AI_ASSISTANTS.CHATBOTS.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(item.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{t(item.descriptionKey)}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="coding-assistants" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.AI_ASSISTANTS.CODING_ASSISTANTS.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {codingAssistants.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(item.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{t(item.descriptionKey)}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="image-generation" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.AI_ASSISTANTS.IMAGE_GENERATION.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {imageGeneration.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(item.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{t(item.descriptionKey)}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="search-engines" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.AI_ASSISTANTS.SEARCH_ENGINES.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchEngines.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(item.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{t(item.descriptionKey)}</CardDescription>
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
