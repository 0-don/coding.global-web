"use client";

import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TweetCard } from "@/components/ui/tweet-card";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import type { Tweet } from "react-tweet/api";
import { ResourceFooter } from "../../../layout/resources/resource-footer";

const toc: TOCItemType[] = [
  { url: "#what-is-vibe-coding", title: "What is Vibe Coding?", depth: 2 },
  { url: "#choosing-the-best-model", title: "Choosing the Best Model", depth: 2 },
  { url: "#my-setup", title: "My Setup", depth: 2 },
  { url: "#ai-editors", title: "AI Editors", depth: 2 },
  { url: "#ai-clis", title: "AI CLIs", depth: 2 },
];

export const vibeCodingTOC = createTOC(toc);

const aiEditors = [
  {
    title: "Cursor",
    description: "AI-first code editor built on VSCode",
    url: "https://cursor.com/",
  },
  {
    title: "Windsurf",
    description: "AI-powered IDE by Codeium",
    url: "https://codeium.com/windsurf",
  },
  {
    title: "Antigravity",
    description: "AI coding environment",
    url: "https://antigravity.google/",
  },
];

const aiCLIs = [
  {
    title: "Claude Code",
    description: "Anthropic's agentic coding CLI",
    url: "https://github.com/anthropics/claude-code",
  },
  {
    title: "OpenAI Codex CLI",
    description: "OpenAI's terminal coding assistant",
    url: "https://github.com/openai/codex",
  },
  {
    title: "Gemini CLI",
    description: "Google's AI coding assistant for terminal",
    url: "https://github.com/google-gemini/gemini-cli",
  },
];

interface VibeCodingProps {
  tweet: Tweet | undefined;
}

export function VibeCoding(props: VibeCodingProps) {
  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">Vibe Coding</h1>

      <section id="what-is-vibe-coding" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">What is Vibe Coding?</h2>
        <p className="text-muted-foreground mb-4">
          Vibe coding is a new approach to programming where you describe what
          you want in natural language and let AI build it for you. Instead of
          writing every line of code yourself, you guide the AI with prompts and
          let it handle the implementation.
        </p>
        <p className="text-muted-foreground mb-4">
          The term was coined by Andrej Karpathy in this tweet:
        </p>
        <div className="mb-4 flex justify-center">
          {props.tweet && <TweetCard tweet={props.tweet} />}
        </div>
        <p className="text-muted-foreground">
          To vibe code effectively, you need the right tools. Here are the best
          AI-powered editors and CLIs available today.
        </p>
      </section>

      <section id="choosing-the-best-model" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Choosing the Best Model</h2>
        <p className="text-muted-foreground mb-4">
          The AI model you use matters just as much as the tool. You can find
          the latest rankings of AI models for web development on the{" "}
          <a
            href="https://lmarena.ai/leaderboard/webdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            LM Arena Web Development Leaderboard
          </a>
          .
        </p>
        <p className="text-muted-foreground">
          That said, Claude models by Anthropic consistently rank at the top for
          coding tasks. If you want the best results for vibe coding, Claude is
          usually the way to go.
        </p>
      </section>

      <section id="my-setup" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">My Setup</h2>
        <p className="text-muted-foreground mb-4">
          I personally use the{" "}
          <a
            href="https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            Claude Code VSCode Extension
          </a>{" "}
          for my vibe coding workflow. It integrates Claude directly into VSCode
          with agentic capabilities.
        </p>
        <p className="text-muted-foreground">
          To help gather context for AI assistants, I also built the{" "}
          <a
            href="https://marketplace.visualstudio.com/items?itemName=0-don.code-collector"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            Code Collector
          </a>{" "}
          extension. It automatically collects files based on import
          dependencies, making it easy to provide your codebase context to any
          AI assistant.
        </p>
      </section>

      <section id="ai-editors" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">AI Editors</h2>
        <p className="text-muted-foreground mb-6">
          These editors have AI deeply integrated into the coding experience,
          allowing you to chat with AI, generate code, and get intelligent
          completions.
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
                    {editor.title}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{editor.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section id="ai-clis" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">AI CLIs</h2>
        <p className="text-muted-foreground mb-6">
          Command-line tools that let you vibe code directly from your terminal.
          These are great for quick tasks, automation, and working in any editor
          you prefer.
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
                    {cli.title}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{cli.description}</CardDescription>
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
