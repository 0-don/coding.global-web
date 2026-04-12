"use client";

import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardContent,
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
    url: "#welcome",
    title: msg("RESOURCES.CYBER_SECURITY.WELCOME.TITLE"),
    depth: 2,
  },
  {
    url: "#roadmap",
    title: msg("RESOURCES.CYBER_SECURITY.ROADMAP.TITLE"),
    depth: 2,
  },
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
  {
    url: "#tools",
    title: msg("RESOURCES.CYBER_SECURITY.TOOLS.TITLE"),
    depth: 2
  },
  {
    url: "#ethics-deep-dive",
    title: msg("RESOURCES.CYBER_SECURITY.ETHICS_DEEP_DIVE.TITLE"),
    depth: 2
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
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.PHRACK.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.PHRACK.DESCRIPTION",
    ),
    url: "https://phrack.org/",
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.TMPOUT.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.TMPOUT.DESCRIPTION",
    ),
    url: "https://tmpout.sh/",
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.PAGEDOUT.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CYBER_SECURITY.LEARNING_PLATFORMS.PAGEDOUT.DESCRIPTION",
    ),
    url: "https://pagedout.institute/",
  },
];

const roadmapSteps = [
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.ETHICS.TITLE"),
    descriptionKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.ETHICS.DESC"),
    url: "https://www.nacdl.org/Landing/ComputerFraudandAbuseAct",
    step: 1,
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.BOUNTY.TITLE"),
    descriptionKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.BOUNTY.DESC"),
    url: "https://www.hackerone.com/vulnerability-management/what-are-bug-bounties-how-do-they-work-examples",
    step: 2,
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.LEARNING.TITLE"),
    descriptionKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.LEARNING.DESC"),
    url: "https://overthewire.org/wargames/",
    step: 3,
  },
  {
    titleKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.GOOGLING.TITLE"),
    descriptionKey: msg("RESOURCES.CYBER_SECURITY.ROADMAP.GOOGLING.DESC"),
    url: "https://www.google.com",
    step: 4,
  },
];

const tools = [
  {
    name: "Burp Suite",
    desc: "Intercepting Proxy",
    url: "https://portswigger.net/burp"
  },
  {
    name: "Nuclei",
    desc: "Template-based scanner",
    url: "https://github.com/projectdiscovery/nuclei"
  },
  {
    name: "Amass",
    desc: "Attack surface mapping",
    url: "https://github.com/owasp-amass/amass"
  },
  {
    name: "httpx",
    desc: "HTTP toolkit",
    url: "https://github.com/projectdiscovery/httpx"
  },
  {
    name: "Katana",
    desc: "Next-gen crawler",
    url: "https://github.com/projectdiscovery/katana"
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

    <section id="welcome" className="mb-12 scroll-mt-20">
      <h2 className="mb-4 text-2xl font-semibold">
        {t("RESOURCES.CYBER_SECURITY.WELCOME.TITLE")}
      </h2>
      <p className="text-muted-foreground mb-4 italic">
        {t("RESOURCES.CYBER_SECURITY.WELCOME.INTRO_TEXT")}
      </p>
    </section>

    <section id="roadmap" className="mb-12 scroll-mt-20">
      <h2 className="mb-4 text-2xl font-semibold">
        {t("RESOURCES.CYBER_SECURITY.ROADMAP.TITLE")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {roadmapSteps.map((step) => (
          <a
            key={step.url}
            href={step.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="hover:bg-muted/50 h-full transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                    {step.step}
                  </span>
                  {t(step.titleKey)}
                  <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>
                  {t(step.descriptionKey)}
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </section>

    <section id="introduction" className="mb-12 scroll-mt-20">
      <h2 className="mb-4 text-2xl font-semibold border-t pt-12">
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

    <section id="tools" className="mb-12 scroll-mt-20">
      <h2 className="mb-4 text-2xl font-semibold">
        {t("RESOURCES.CYBER_SECURITY.TOOLS.TITLE")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("RESOURCES.CYBER_SECURITY.TOOLS.DESCRIPTION")}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <a
            key={tool.url}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card size="sm" className="hover:bg-muted/50 h-full transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tool.name}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {tool.desc}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>

    <section id="ethics-deep-dive" className="mb-12 scroll-mt-20 border-t pt-12">
      <h2 className="mb-4 text-2xl font-semibold text-primary">
        {t("RESOURCES.CYBER_SECURITY.ETHICS_DEEP_DIVE.TITLE")}
      </h2>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
        <p>
          {t("RESOURCES.CYBER_SECURITY.ETHICS_DEEP_DIVE.CONTENT_1")}
        </p>
        <p className="mt-4 font-medium text-foreground">
          {t("RESOURCES.CYBER_SECURITY.ETHICS_DEEP_DIVE.CONTENT_2")}
        </p>
      </div>
    </section>

    <ResourceFooter />
  </div>
);
}
