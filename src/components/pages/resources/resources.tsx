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
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { HiOutlineBolt, HiOutlineShieldCheck } from "react-icons/hi2";
import { SiJavascript, SiPython } from "react-icons/si";

const toc: TOCItemType[] = [
  { url: "#programming-languages", title: "Programming Languages", depth: 2 },
  { url: "#general-resources", title: "General Resources", depth: 2 },
  { url: "#getting-started", title: "Getting Started", depth: 2 },
  { url: "#free-ai-assistants", title: "Free AI Assistants", depth: 2 },
  { url: "#code-like-a-pro", title: "Code Like a Pro", depth: 2 },
  { url: "#utilities", title: "Utilities", depth: 2 },
  { url: "#discord-text-formatting", title: "Discord Text Formatting", depth: 2 },
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
    title: "Roadmap.sh",
    description: "Interactive roadmaps for all developer paths",
    url: "https://roadmap.sh/",
  },
  {
    title: "FreeCodeCamp",
    description: "Free courses for Python, JavaScript, HTML, CSS and more",
    url: "https://www.freecodecamp.org/",
  },
  {
    title: "Codecademy",
    description: "Interactive courses for Python, JavaScript, Java, SQL, C++ and more",
    url: "https://www.codecademy.com/catalog",
  },
  {
    title: "Don't Ask to Ask",
    description: "Learn how to ask questions properly in tech communities",
    url: "https://dontasktoask.com/",
  },
  {
    title: "QuickType",
    description: "Convert JSON to TypeScript, Python, Go, and more",
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
    title: "ServerHunter",
    description: "Find cheap VPS and server deals",
    url: "https://www.serverhunter.com/",
  },
  {
    title: "MAS Genuine ISO",
    description: "Genuine Windows installation media",
    url: "https://massgrave.dev/genuine-installation-media",
  },
];

const codeResources = [
  { language: "HTML", site: "W3Schools.com", url: "https://w3schools.com/" },
  { language: "CSS", site: "Codecademy.com", url: "https://www.codecademy.com/learn/learn-css" },
  { language: "JavaScript", site: "freecodecamp.org", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  { language: "React", site: "react.dev", url: "https://react.dev/" },
  { language: "Python", site: "learnpython.org", url: "https://learnpython.org/" },
  { language: "Java", site: "sololearn.com", url: "https://www.sololearn.com/" },
  { language: "PHP", site: "php.net", url: "https://www.php.net/manual/en/tutorial.php" },
  { language: "Cybersecurity", site: "tryhackme.com", url: "https://tryhackme.com/" },
  { language: "C", site: "learn-c.org", url: "https://learn-c.org/" },
  { language: "C++", site: "learncpp.com", url: "https://www.learncpp.com/" },
  { language: "AWS", site: "skillbuilder.aws", url: "https://skillbuilder.aws/" },
  { language: "AI / ML", site: "coursera.org", url: "https://www.coursera.org/" },
  { language: "Git", site: "learngitbranching.js.org", url: "https://learngitbranching.js.org/" },
  { language: "SQL", site: "sqlbolt.com", url: "https://sqlbolt.com/" },
];

const resourceCategories = [
  {
    title: "Programming Languages",
    description: "Learn popular programming languages with curated resources",
    items: [
      {
        name: "JavaScript",
        description: "Web development essentials",
        href: "/resources/languages/javascript" as const,
        icon: SiJavascript,
      },
      {
        name: "Python",
        description: "Data science & automation",
        href: "/resources/languages/python" as const,
        icon: SiPython,
      },
    ],
  },
  {
    title: "General Resources",
    description: "Productivity tips and recommended tools",
    items: [
      {
        name: "Vibe Coding",
        description: "Flow state & productivity",
        href: "/resources/guides/vibe-coding" as const,
        icon: HiOutlineBolt,
      },
      {
        name: "Cyber Security",
        description: "Security best practices",
        href: "/resources/guides/cyber-security" as const,
        icon: HiOutlineShieldCheck,
      },
    ],
  },
];

export function Resources() {
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
        <h1 className="mb-2 text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Curated learning resources, tools, and guides for developers
        </p>
      </motion.div>

      <div className="grid gap-8">
        {resourceCategories.map((category, categoryIndex) => (
          <AnimatedSection
            key={category.title}
            id={category.title.toLowerCase().replace(/\s+/g, "-")}
            className="scroll-mt-20"
            delay={categoryIndex * 0.1}
          >
            <h2 className="mb-2 text-xl font-semibold">{category.title}</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {category.description}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.name}
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
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
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
          <h2 className="mb-2 text-xl font-semibold">Getting Started</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Essential resources for learning programming
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
                      {link.title}
                      <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{link.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        {/* Free AIs */}
        <AnimatedSection id="free-ai-assistants" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">Free AI Assistants</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            AI tools to help you learn and code faster
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
          <h2 className="mb-2 text-xl font-semibold">Code Like a Pro</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Free resources for learning different languages and technologies
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
                  <span className="font-medium">{resource.language}</span>
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
          <h2 className="mb-2 text-xl font-semibold">Utilities</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Helpful tools and services
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
                      {link.title}
                      <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{link.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>

        {/* Discord Text Formatting */}
        <AnimatedSection id="discord-text-formatting" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-semibold">Discord Text Formatting</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Learn how to format your messages in Discord
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
