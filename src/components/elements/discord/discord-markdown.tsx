"use client";

import { toHTML } from "@odiffey/discord-markdown";
import { useMemo } from "react";

interface DiscordMarkdownProps {
  content: string;
  className?: string;
}

export function DiscordMarkdown(props: DiscordMarkdownProps) {
  const html = useMemo(() => {
    return toHTML(props.content, {
      escapeHTML: true,
      discordOnly: false,
    });
  }, [props.content]);

  return (
    <span
      className={props.className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
