"use client";

import { toHTML } from "@odiffey/discord-markdown";
import { useSyncExternalStore } from "react";

interface DiscordMarkdownProps {
  content: string;
  className?: string;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function DiscordMarkdown(props: DiscordMarkdownProps) {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!props.content) return null;

  if (!isClient) {
    return <span className={props.className}>{props.content}</span>;
  }

  const html = toHTML(props.content, {
    escapeHTML: true,
    discordOnly: false,
  });

  return (
    <span
      className={props.className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
