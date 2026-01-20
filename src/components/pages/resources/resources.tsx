"use client";

import { ResourceFooter } from "@/components/layout/resources/resource-footer";
import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { msg } from "@/lib/config/constants";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import {
  HiOutlineBolt,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { SiJavascript, SiPython } from "react-icons/si";

const toc: TOCItemType[] = [
  {
    url: "#programming-languages",
    title: msg("RESOURCES.TOC.PROGRAMMING_LANGUAGES"),
    depth: 2,
  },
  {
    url: "#general-resources",
    title: msg("RESOURCES.TOC.GENERAL_RESOURCES"),
    depth: 2,
  },
  {
    url: "#getting-started",
    title: msg("RESOURCES.TOC.GETTING_STARTED"),
    depth: 2,
  },
  {
    url: "#free-ai-assistants",
    title: msg("RESOURCES.TOC.FREE_AI_ASSISTANTS"),
    depth: 2,
  },
  {
    url: "#code-like-a-pro",
    title: msg("RESOURCES.TOC.CODE_LIKE_A_PRO"),
    depth: 2,
  },
  { url: "#utilities", title: msg("RESOURCES.TOC.UTILITIES"), depth: 2 },
  {
    url: "#discord-text-formatting",
    title: msg("RESOURCES.TOC.DISCORD_TEXT_FORMATTING"),
    depth: 2,
  },
];

export const resourcesTOC = createTOC(toc);

interface AnimatedSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

function AnimatedSection(props: AnimatedSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={props.id}
      className={props.className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: props.delay ?? 0 }}
    >
      {props.children}
    </motion.section>
  );
}

const generalLinks = [
  {
    titleKey: msg("RESOURCES.GENERAL_LINKS.ROADMAP.TITLE"),
    descriptionKey: msg("RESOURCES.GENERAL_LINKS.ROADMAP.DESCRIPTION"),
    url: "https://roadmap.sh/",
  },
  {
    titleKey: msg("RESOURCES.GENERAL_LINKS.FREECODECAMP.TITLE"),
    descriptionKey: msg("RESOURCES.GENERAL_LINKS.FREECODECAMP.DESCRIPTION"),
    url: "https://www.freecodecamp.org/",
  },
  {
    titleKey: msg("RESOURCES.GENERAL_LINKS.CODECADEMY.TITLE"),
    descriptionKey: msg("RESOURCES.GENERAL_LINKS.CODECADEMY.DESCRIPTION"),
    url: "https://www.codecademy.com/catalog",
  },
  {
    titleKey: msg("RESOURCES.GENERAL_LINKS.DONT_ASK_TO_ASK.TITLE"),
    descriptionKey: msg("RESOURCES.GENERAL_LINKS.DONT_ASK_TO_ASK.DESCRIPTION"),
    url: "https://dontasktoask.com/",
  },
  {
    titleKey: msg("RESOURCES.GENERAL_LINKS.QUICKTYPE.TITLE"),
    descriptionKey: msg("RESOURCES.GENERAL_LINKS.QUICKTYPE.DESCRIPTION"),
    url: "https://app.quicktype.io/",
  },
];

const freeAIs = [
  { title: "Claude", url: "https://claude.ai/" },
  { title: "Grok", url: "https://grok.com/" },
  { title: "Gemini", url: "https://gemini.google.com/" },
  { title: "ChatGPT", url: "https://chatgpt.com/" },
];

const utilityLinks = [
  {
    titleKey: msg("RESOURCES.UTILITY_LINKS.SERVERHUNTER.TITLE"),
    descriptionKey: msg("RESOURCES.UTILITY_LINKS.SERVERHUNTER.DESCRIPTION"),
    url: "https://www.serverhunter.com/",
  },
  {
    titleKey: msg("RESOURCES.UTILITY_LINKS.MAS_GENUINE_ISO.TITLE"),
    descriptionKey: msg("RESOURCES.UTILITY_LINKS.MAS_GENUINE_ISO.DESCRIPTION"),
    url: "https://massgrave.dev/genuine-installation-media",
  },
];

const codeResources = [
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.HTML"),
    site: "W3Schools.com",
    url: "https://w3schools.com/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.CSS"),
    site: "Codecademy.com",
    url: "https://www.codecademy.com/learn/learn-css",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.JAVASCRIPT"),
    site: "freecodecamp.org",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.REACT"),
    site: "react.dev",
    url: "https://react.dev/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.PYTHON"),
    site: "learnpython.org",
    url: "https://learnpython.org/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.JAVA"),
    site: "sololearn.com",
    url: "https://www.sololearn.com/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.PHP"),
    site: "php.net",
    url: "https://www.php.net/manual/en/tutorial.php",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.CYBERSECURITY"),
    site: "tryhackme.com",
    url: "https://tryhackme.com/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.C"),
    site: "learn-c.org",
    url: "https://learn-c.org/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.CPP"),
    site: "learncpp.com",
    url: "https://www.learncpp.com/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.AWS"),
    site: "skillbuilder.aws",
    url: "https://skillbuilder.aws/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.AI_ML"),
    site: "coursera.org",
    url: "https://www.coursera.org/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.GIT"),
    site: "learngitbranching.js.org",
    url: "https://learngitbranching.js.org/",
  },
  {
    languageKey: msg("RESOURCES.CODE_RESOURCES.SQL"),
    site: "sqlbolt.com",
    url: "https://sqlbolt.com/",
  },
];

const resourceCategories = [
  {
    id: "programming-languages",
    titleKey: msg("RESOURCES.CATEGORIES.PROGRAMMING_LANGUAGES.TITLE"),
    descriptionKey: msg(
      "RESOURCES.CATEGORIES.PROGRAMMING_LANGUAGES.DESCRIPTION",
    ),
    items: [
      {
        nameKey: msg("RESOURCES.ITEMS.JAVASCRIPT.NAME"),
        descriptionKey: msg("RESOURCES.ITEMS.JAVASCRIPT.DESCRIPTION"),
        href: "/resources/languages/javascript" as const,
        icon: SiJavascript,
      },
      {
        nameKey: msg("RESOURCES.ITEMS.PYTHON.NAME"),
        descriptionKey: msg("RESOURCES.ITEMS.PYTHON.DESCRIPTION"),
        href: "/resources/languages/python" as const,
        icon: SiPython,
      },
    ],
  },
  {
    id: "general-resources",
    titleKey: msg("RESOURCES.CATEGORIES.GENERAL_RESOURCES.TITLE"),
    descriptionKey: msg("RESOURCES.CATEGORIES.GENERAL_RESOURCES.DESCRIPTION"),
    items: [
      {
        nameKey: msg("RESOURCES.ITEMS.AI_ASSISTANTS.NAME"),
        descriptionKey: msg("RESOURCES.ITEMS.AI_ASSISTANTS.DESCRIPTION"),
        href: "/resources/ai-assistants" as const,
        icon: HiOutlineCpuChip,
      },
      {
        nameKey: msg("RESOURCES.ITEMS.VIBE_CODING.NAME"),
        descriptionKey: msg("RESOURCES.ITEMS.VIBE_CODING.DESCRIPTION"),
        href: "/resources/guides/vibe-coding" as const,
        icon: HiOutlineBolt,
      },
      {
        nameKey: msg("RESOURCES.ITEMS.CYBER_SECURITY.NAME"),
        descriptionKey: msg("RESOURCES.ITEMS.CYBER_SECURITY.DESCRIPTION"),
        href: "/resources/guides/cyber-security" as const,
        icon: HiOutlineShieldCheck,
      },
    ],
  },
];

export function Resources() {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-8 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">{t("RESOURCES.TITLE")}</h1>
        <p className="text-muted-foreground">{t("RESOURCES.SUBTITLE")}</p>
      </motion.div>

      <div className="grid gap-8">
        {resourceCategories.map((category, categoryIndex) => (
          <AnimatedSection
            key={category.id}
            id={category.id}
            className="scroll-mt-20"
            delay={categoryIndex * 0.1}
          >
            <h2 className="mb-2 text-xl font-semibold">
              {t(category.titleKey)}
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {t(category.descriptionKey)}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.nameKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + itemIndex * 0.1 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className="group hover:border-primary block rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-md p-2">
                        <item.icon className="text-primary size-5" />
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary font-medium transition-colors">
                          {t(item.nameKey)}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {t(item.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        ))}

        {/* General Links */}
        <AnimatedSection id="getting-started" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">
            {t("RESOURCES.SECTIONS.GETTING_STARTED.TITLE")}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("RESOURCES.SECTIONS.GETTING_STARTED.DESCRIPTION")}
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {generalLinks.map((link, index) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:bg-muted/50 h-full transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {t(link.titleKey)}
                      <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t(link.descriptionKey)}</CardDescription>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        {/* Free AIs */}
        <AnimatedSection id="free-ai-assistants" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">
            {t("RESOURCES.SECTIONS.FREE_AI_ASSISTANTS.TITLE")}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("RESOURCES.SECTIONS.FREE_AI_ASSISTANTS.DESCRIPTION")}
          </p>
          <div className="flex flex-wrap gap-3">
            {freeAIs.map((ai, index) => (
              <motion.a
                key={ai.url}
                href={ai.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted/50 hover:border-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ai.title}
                <ExternalLink className="h-3 w-3" />
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        {/* Code Like a Pro */}
        <AnimatedSection id="code-like-a-pro" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">
            {t("RESOURCES.SECTIONS.CODE_LIKE_A_PRO.TITLE")}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("RESOURCES.SECTIONS.CODE_LIKE_A_PRO.DESCRIPTION")}
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/images/resources/code-like-a-pro.png"
                alt="Code Like a Pro - Free learning resources"
                width={400}
                height={600}
                className="rounded-lg"
              />
            </motion.div>
            <div className="grid gap-2 sm:grid-cols-2">
              {codeResources.map((resource, index) => (
                <motion.a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-muted/50 hover:border-primary flex items-center justify-between rounded-lg border px-3 py-2 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="font-medium">{t(resource.languageKey)}</span>
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    {resource.site}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Utilities */}
        <AnimatedSection id="utilities" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">
            {t("RESOURCES.SECTIONS.UTILITIES.TITLE")}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("RESOURCES.SECTIONS.UTILITIES.DESCRIPTION")}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {utilityLinks.map((link, index) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:bg-muted/50 h-full transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {t(link.titleKey)}
                      <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t(link.descriptionKey)}</CardDescription>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        {/* Discord Text Formatting */}
        <AnimatedSection id="discord-text-formatting" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">
            {t("RESOURCES.SECTIONS.DISCORD_TEXT_FORMATTING.TITLE")}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("RESOURCES.SECTIONS.DISCORD_TEXT_FORMATTING.DESCRIPTION")}
          </p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/resources/discord-text-formating.gif"
              alt="Discord text formatting guide"
              width={600}
              height={400}
              className="rounded-lg"
              unoptimized
            />
          </motion.div>
        </AnimatedSection>

        <ResourceFooter />
      </div>
    </motion.div>
  );
}
