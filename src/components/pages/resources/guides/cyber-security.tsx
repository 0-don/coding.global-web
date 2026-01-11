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
import { ResourceFooter } from "../../../layout/resources/resource-footer";

const toc: TOCItemType[] = [
  {
    url: "#introduction",
    title: msg("RESOURCES.CYBER_SECURITY.INTRODUCTION.TITLE"),
    depth: 2,
  },
  {
    url: "#learning-platforms",
    title: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.TITLE"),
    depth: 2,
  },
];

const learningPlatforms = [
  {
    titleKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.TRYHACKME.TITLE",
    ),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.TRYHACKME.DESCRIPTION",
    ),
    url: "https://tryhackme.com/",
  },
  {
    titleKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.HACKTHEBOX.TITLE",
    ),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.HACKTHEBOX.DESCRIPTION",
    ),
    url: "https://hackthebox.com/",
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.PICOCTF.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.PICOCTF.DESCRIPTION",
    ),
    url: "https://www.picoctf.org/",
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.ROOTME.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.ROOTME.DESCRIPTION",
    ),
    url: "https://www.root-me.org/",
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.CISCO.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.CISCO.DESCRIPTION",
    ),
    url: "https://netacad.com/",
  },
];

export const cyberSecurityTOC = createTOC(toc);

export function CyberSecurity() {
  const t = useTranslations();

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        {t("RESOURCES.CYBER_SECURITY.TITLE")}
      </h1>

      <section id="introduction" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.CYBER_SECURITY.INTRODUCTION.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.CYBER_SECURITY.INTRODUCTION.CONTENT_1")}
        </p>
        <p className="text-muted-foreground">
          {t("RESOURCES.CYBER_SECURITY.INTRODUCTION.CONTENT_2")}
        </p>
      </section>

      <section id="learning-platforms" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learningPlatforms.map((platform) => (
            <a
              key={platform.url}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(platform.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    {t(platform.descriptionKey)}
                  </CardDescription>
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
