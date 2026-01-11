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
    url: "#why-javascript",
    title: msg("RESOURCES.JAVASCRIPT.WHY_JAVASCRIPT.TITLE"),
    depth: 2,
  },
  {
    url: "#web-dev-speedrun",
    title: msg("RESOURCES.JAVASCRIPT.WEB_DEV_SPEEDRUN.TITLE"),
    depth: 2,
  },
  { url: "#nodejs", title: msg("RESOURCES.JAVASCRIPT.NODEJS.TITLE"), depth: 2 },
  { url: "#react", title: msg("RESOURCES.JAVASCRIPT.REACT.TITLE"), depth: 2 },
  {
    url: "#shadcn-ui",
    title: msg("RESOURCES.JAVASCRIPT.SHADCN.TITLE"),
    depth: 2,
  },
  {
    url: "#shadcn-blocks",
    title: msg("RESOURCES.JAVASCRIPT.SHADCN.BLOCKS_TITLE"),
    depth: 3,
  },
  {
    url: "#shadcn-utils",
    title: msg("RESOURCES.JAVASCRIPT.SHADCN.UTILS_TITLE"),
    depth: 3,
  },
];

export const javascriptTOC = createTOC(toc);

const speedrunResources = [
  {
    titleKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.RESPONSIVE_WEB_DESIGN.TITLE",
    ),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.RESPONSIVE_WEB_DESIGN.DESCRIPTION",
    ),
    url: "https://www.freecodecamp.org/learn/responsive-web-design/",
    step: 1,
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.LEARN_HTML.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.LEARN_HTML.DESCRIPTION",
    ),
    url: "https://www.codecademy.com/learn/learn-html",
    step: 2,
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.LEARN_CSS.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.LEARN_CSS.DESCRIPTION",
    ),
    url: "https://www.codecademy.com/learn/learn-css",
    step: 3,
  },
  {
    titleKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.RESPONSIVE_WEB_DESIGN_2022.TITLE",
    ),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.RESPONSIVE_WEB_DESIGN_2022.DESCRIPTION",
    ),
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    step: 4,
  },
  {
    titleKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.JS_ALGORITHMS.TITLE",
    ),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.JS_ALGORITHMS.DESCRIPTION",
    ),
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    step: 5,
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.INTRO_TO_JS.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.INTRO_TO_JS.DESCRIPTION",
    ),
    url: "https://www.codecademy.com/learn/introduction-to-javascript",
    step: 6,
  },
  {
    titleKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.JS_ALGORITHMS_V8.TITLE",
    ),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SPEEDRUN_RESOURCES.JS_ALGORITHMS_V8.DESCRIPTION",
    ),
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    step: 7,
  },
];

const reactResources = [
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.REACT_RESOURCES.REACT_DOCS.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.REACT_RESOURCES.REACT_DOCS.DESCRIPTION",
    ),
    url: "https://react.dev/learn",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.REACT_RESOURCES.REACT_TUTORIAL.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.REACT_RESOURCES.REACT_TUTORIAL.DESCRIPTION",
    ),
    url: "https://www.freecodecamp.org/news/learn-react-course/",
  },
];

const shadcnBlocks = [
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.AWESOME_SHADCN.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.AWESOME_SHADCN.DESCRIPTION",
    ),
    url: "https://www.shadcn.io/awesome",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.ORIGIN_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.ORIGIN_UI.DESCRIPTION",
    ),
    url: "https://originui.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.ANIMATE_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.ANIMATE_UI.DESCRIPTION",
    ),
    url: "https://animate-ui.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.MVP_BLOCKS.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.MVP_BLOCKS.DESCRIPTION",
    ),
    url: "https://blocks.mvp-subha.me/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.SHSF_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.SHSF_UI.DESCRIPTION",
    ),
    url: "https://www.shsfui.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.KIBO_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.KIBO_UI.DESCRIPTION",
    ),
    url: "https://www.kibo-ui.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.REACT_BITS.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.REACT_BITS.DESCRIPTION",
    ),
    url: "https://reactbits.dev/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.SKIPER_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.SKIPER_UI.DESCRIPTION",
    ),
    url: "https://skiper-ui.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.ACETERNITY_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.ACETERNITY_UI.DESCRIPTION",
    ),
    url: "https://ui.aceternity.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.MAGIC_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.MAGIC_UI.DESCRIPTION",
    ),
    url: "https://magicui.design/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.CULT_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_BLOCKS.CULT_UI.DESCRIPTION",
    ),
    url: "https://cult-ui.com/",
  },
];

const shadcnUtils = [
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_UTILS.TWEAKCN.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_UTILS.TWEAKCN.DESCRIPTION",
    ),
    url: "https://tweakcn.com/",
  },
  {
    titleKey: msg("RESOURCES.JAVASCRIPT.SHADCN_UTILS.AWESOME_SHADCN_UI.TITLE"),
    descriptionKey: msg(
      "RESOURCES.JAVASCRIPT.SHADCN_UTILS.AWESOME_SHADCN_UI.DESCRIPTION",
    ),
    url: "https://github.com/birobirobiro/awesome-shadcn-ui",
  },
];

export function Javascript() {
  const t = useTranslations();

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        {t("RESOURCES.JAVASCRIPT.TITLE")}
      </h1>

      <section id="why-javascript" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.JAVASCRIPT.WHY_JAVASCRIPT.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.JAVASCRIPT.WHY_JAVASCRIPT.CONTENT")}
        </p>
      </section>

      <section id="web-dev-speedrun" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.JAVASCRIPT.WEB_DEV_SPEEDRUN.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.JAVASCRIPT.WEB_DEV_SPEEDRUN.DESCRIPTION")}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {speedrunResources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                      {resource.step}
                    </span>
                    {t(resource.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    {t(resource.descriptionKey)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="nodejs" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.JAVASCRIPT.NODEJS.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.JAVASCRIPT.NODEJS.CONTENT_1")}{" "}
          <a
            href="https://nodejs.org/en/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("RESOURCES.JAVASCRIPT.NODEJS.LINK_TEXT")}
          </a>
          .
        </p>
      </section>

      <section id="react" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.JAVASCRIPT.REACT.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("RESOURCES.JAVASCRIPT.REACT.CONTENT")}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {reactResources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t(resource.titleKey)}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>
                    {t(resource.descriptionKey)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="shadcn-ui" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          {t("RESOURCES.JAVASCRIPT.SHADCN.TITLE")}
        </h2>
        <p className="text-muted-foreground mb-6">
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            shadcn/ui
          </a>{" "}
          {t("RESOURCES.JAVASCRIPT.SHADCN.DESCRIPTION")}
        </p>

        <div id="shadcn-blocks" className="mb-8 scroll-mt-20">
          <h3 className="mb-4 text-xl font-semibold">
            {t("RESOURCES.JAVASCRIPT.SHADCN.BLOCKS_TITLE")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("RESOURCES.JAVASCRIPT.SHADCN.BLOCKS_DESCRIPTION")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shadcnBlocks.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card
                  size="sm"
                  className="hover:bg-muted/50 h-full transition-colors"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {t(resource.titleKey)}
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {t(resource.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        <div id="shadcn-utils" className="scroll-mt-20">
          <h3 className="mb-4 text-xl font-semibold">
            {t("RESOURCES.JAVASCRIPT.SHADCN.UTILS_TITLE")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("RESOURCES.JAVASCRIPT.SHADCN.UTILS_DESCRIPTION")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {shadcnUtils.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card
                  size="sm"
                  className="hover:bg-muted/50 h-full transition-colors"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {t(resource.titleKey)}
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {t(resource.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ResourceFooter />
    </div>
  );
}
