"use client";

import { useSetTOC } from "@/components/layout/toc/toc-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";

const toc: TOCItemType[] = [
  { url: "#why-javascript", title: "Why JavaScript?", depth: 2 },
  { url: "#web-dev-speedrun", title: "Web Dev Speedrun", depth: 2 },
  { url: "#nodejs", title: "Node.js", depth: 2 },
  { url: "#react", title: "React", depth: 2 },
  { url: "#shadcn-ui", title: "Designing with shadcn/ui", depth: 2 },
  { url: "#shadcn-blocks", title: "Component Libraries", depth: 3 },
  { url: "#shadcn-utils", title: "Tools & Utilities", depth: 3 },
];

const speedrunResources = [
  {
    title: "Responsive Web Design",
    description: "FreeCodeCamp - HTML & CSS fundamentals",
    url: "https://www.freecodecamp.org/learn/responsive-web-design/",
    step: 1,
  },
  {
    title: "Learn HTML",
    description: "Codecademy - Deep dive into HTML",
    url: "https://www.codecademy.com/learn/learn-html",
    step: 2,
  },
  {
    title: "Learn CSS",
    description: "Codecademy - Master CSS styling",
    url: "https://www.codecademy.com/learn/learn-css",
    step: 3,
  },
  {
    title: "Responsive Web Design (2022)",
    description: "FreeCodeCamp - Updated HTML & CSS curriculum",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    step: 4,
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    description: "FreeCodeCamp - Core JavaScript concepts",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    step: 5,
  },
  {
    title: "Introduction to JavaScript",
    description: "Codecademy - JavaScript fundamentals",
    url: "https://www.codecademy.com/learn/introduction-to-javascript",
    step: 6,
  },
  {
    title: "JavaScript Algorithms & Data Structures (v8)",
    description: "FreeCodeCamp - Latest JavaScript curriculum",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    step: 7,
  },
];


const reactResources = [
  {
    title: "React Official Docs",
    description: "The best place to learn React from scratch",
    url: "https://react.dev/learn",
  },
  {
    title: "React Tutorial for Beginners",
    description: "FreeCodeCamp - Comprehensive React course",
    url: "https://www.freecodecamp.org/news/learn-react-course/",
  },
];

const shadcnBlocks = [
  {
    title: "Awesome shadcn",
    description: "Curated list of shadcn resources",
    url: "https://www.shadcn.io/awesome",
  },
  {
    title: "Origin UI",
    description: "Beautiful UI components",
    url: "https://originui.com/",
  },
  {
    title: "Animate UI",
    description: "Animated components for React",
    url: "https://animate-ui.com/",
  },
  {
    title: "MVP Blocks",
    description: "Ready-to-use blocks for MVPs",
    url: "https://blocks.mvp-subha.me/",
  },
  {
    title: "SHSF UI",
    description: "Modern component library",
    url: "https://www.shsfui.com/",
  },
  {
    title: "Kibo UI",
    description: "Accessible component library",
    url: "https://www.kibo-ui.com/",
  },
  {
    title: "React Bits",
    description: "Useful React components",
    url: "https://reactbits.dev/",
  },
  {
    title: "Skiper UI",
    description: "UI components collection",
    url: "https://skiper-ui.com/",
  },
  {
    title: "Aceternity UI",
    description: "Beautiful animated components",
    url: "https://ui.aceternity.com/",
  },
  {
    title: "Magic UI",
    description: "Magical UI components",
    url: "https://magicui.design/",
  },
  {
    title: "Cult UI",
    description: "Modern design system",
    url: "https://cult-ui.com/",
  },
];

const shadcnUtils = [
  {
    title: "TweakCN",
    description: "Customize shadcn themes visually",
    url: "https://tweakcn.com/",
  },
  {
    title: "Awesome shadcn/ui",
    description: "GitHub collection of shadcn resources",
    url: "https://github.com/birobirobiro/awesome-shadcn-ui",
  },
];

export function Javascript() {
  useSetTOC(toc, "On This Page");

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        JavaScript & Full-Stack Development
      </h1>

      <section id="why-javascript" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Why JavaScript?</h2>
        <p className="text-muted-foreground mb-4">
          JavaScript is the easiest path to becoming a full-stack developer.
          With a single language, you can build everything from interactive
          websites to server-side applications, mobile apps, and even desktop
          software.
        </p>
      </section>

      <section id="web-dev-speedrun" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Web Dev Speedrun</h2>
        <p className="text-muted-foreground mb-6">
          This is the exact path I took to learn web development. Follow these
          resources in order to build a good foundation in HTML, CSS, and
          JavaScript. Each resource builds on the previous one.
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
                    {resource.title}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="nodejs" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Node.js</h2>
        <p className="text-muted-foreground mb-6">
          Node.js lets you run JavaScript on the server, making you a true
          full-stack developer. With Node.js, you can build APIs, handle
          databases, and create complete web applications using the same
          language you learned for the frontend. Download it from{" "}
          <a
            href="https://nodejs.org/en/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            nodejs.org
          </a>
          .
        </p>
      </section>

      <section id="react" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">React</h2>
        <p className="text-muted-foreground mb-6">
          Once you&apos;ve learned the basics and Node.js, it&apos;s time to
          master React. React is the most popular JavaScript library for
          building user interfaces and is used by companies like Meta, Netflix,
          and Airbnb.
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
                    {resource.title}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="shadcn-ui" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">
          Designing with shadcn/ui
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
          is a collection of beautifully designed, accessible components that
          you can copy and paste into your apps. It&apos;s built on top of Radix
          UI and Tailwind CSS, giving you full control over your components.
        </p>

        <div id="shadcn-blocks" className="mb-8 scroll-mt-20">
          <h3 className="mb-4 text-xl font-semibold">
            Component Libraries & Blocks
          </h3>
          <p className="text-muted-foreground mb-4">
            These libraries provide pre-built components and blocks that work
            seamlessly with shadcn/ui.
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
                      <span className="font-medium">{resource.title}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {resource.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        <div id="shadcn-utils" className="scroll-mt-20">
          <h3 className="mb-4 text-xl font-semibold">Tools & Utilities</h3>
          <p className="text-muted-foreground mb-4">
            Helpful tools for customizing and extending shadcn/ui.
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
                      <span className="font-medium">{resource.title}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {resource.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
