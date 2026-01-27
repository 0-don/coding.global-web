"use client";

import { DiscordUserPopover } from "@/components/elements/discord/discord-user-popover";
import { GetApiByGuildIdNews200ItemAuthor } from "@/openapi";
import hljs from "highlight.js";
import { get as getEmoji } from "node-emoji";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Types
interface DiscordNode {
  id?: string;
  name?: string;
  timestamp?: number;
  style?: string;
}

type ParseFn = (text: string) => string;
type DiscordCallback = (node: DiscordNode) => string;
type DiscordCallbacks = Record<
  "user" | "channel" | "role" | "everyone" | "here" | "slash" | "timestamp",
  DiscordCallback
>;

interface HtmlOptions {
  escapeHTML?: boolean;
  discordCallback?: Partial<DiscordCallbacks>;
}

// Utilities
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Styles
const S = {
  h1: "text-xl font-bold mt-2 mb-1 block",
  h2: "text-lg font-bold mt-2 mb-1 block",
  h3: "text-base font-bold mt-2 mb-1 block",
  quote: "border-l-4 border-muted-foreground/30 pl-3 my-1 text-muted-foreground block",
  code: "bg-muted px-1.5 py-0.5 rounded text-sm font-mono",
  pre: "bg-muted p-3 rounded-md my-2 overflow-x-auto block",
  spoiler: "bg-foreground text-foreground rounded px-1 cursor-pointer hover:bg-transparent hover:text-inherit transition-colors",
  mention: "bg-primary/20 text-primary rounded px-1 hover:bg-primary/30 cursor-pointer",
  time: "bg-muted rounded px-1",
  link: "text-primary hover:underline",
  list: "block",
  small: "text-xs text-muted-foreground block",
  del: "line-through text-muted-foreground",
  emoji: "inline-block h-5 w-5 align-text-bottom",
} as const;

// Timestamp formatting
const TIMESTAMP_FORMATS: Record<string, Intl.DateTimeFormatOptions> = {
  t: { timeStyle: "short" },
  T: { timeStyle: "medium" },
  d: { dateStyle: "short" },
  D: { dateStyle: "medium" },
  F: { dateStyle: "full", timeStyle: "short" },
  f: { dateStyle: "long", timeStyle: "short" },
};

// Default callbacks
const defaultCallbacks: DiscordCallbacks = {
  user: (n) => "@" + escapeHtml(n.id || ""),
  channel: (n) => "#" + escapeHtml(n.id || ""),
  role: (n) => "&" + escapeHtml(n.id || ""),
  everyone: () => "@everyone",
  here: () => "@here",
  slash: (n) => "/" + escapeHtml(n.name || ""),
  timestamp: (n) => {
    const d = new Date((n.timestamp || 0) * 1000);
    return d.toLocaleString(undefined, TIMESTAMP_FORMATS[n.style || "f"]);
  },
};

// Rule types
type RuleFn = (m: RegExpExecArray, cb: DiscordCallbacks, parse: ParseFn) => string;
type Rule = { p: RegExp; r: RuleFn; l?: boolean };

// Rule helpers
const wrap = (tag: string): RuleFn => (m, _, parse) =>
  `<${tag}>${parse(m[1])}</${tag}>`;

const spanClass = (cls: string): RuleFn => (m, _, parse) =>
  `<span class="${cls}">${parse(m[1])}</span>`;

const inlineCode: RuleFn = (m) =>
  `<code class="${S.code}">${escapeHtml(m[1])}</code>`;

const autoLink: RuleFn = (m) => {
  const url = escapeHtml(m[1]);
  return `<a href="${url}" class="${S.link}">${url}</a>`;
};

// Build rules
const createRules = (escape: boolean): Rule[] => {
  const e = escape ? escapeHtml : (s: string) => s;

  return [
    // Escape sequences
    { p: /^\\([*_~|`\\<>\[\]#-])/, r: (m) => e(m[1]) },

    // Code blocks
    {
      p: /^```([a-z0-9-]*)\n?([\s\S]*?)```/i,
      r: (m) => {
        const lang = m[1]?.trim();
        const code =
          lang && hljs.getLanguage(lang)
            ? hljs.highlight(m[2] || "", { language: lang, ignoreIllegals: true }).value
            : escapeHtml(m[2] || "");
        return `<pre class="${S.pre}"><code class="hljs${lang ? ` ${lang}` : ""}">${code}</code></pre>`;
      },
    },

    // Inline code
    { p: /^``([^`]+)``/, r: inlineCode },
    { p: /^`([^`]+)`/, r: inlineCode },

    // Block quotes
    { p: /^>>> ([\s\S]+?)(?=\n\n|$)/, r: spanClass(S.quote), l: true },
    { p: /^> ([^\n]+)\n?/, r: spanClass(S.quote), l: true },

    // Spoiler
    { p: /^\|\|([\s\S]+?)\|\|/, r: spanClass(S.spoiler) },

    // Custom emoji
    {
      p: /^<(a?):(\w+):(\d+)>/,
      r: (m) =>
        `<img class="${S.emoji}" src="https://cdn.discordapp.com/emojis/${m[3]}.${m[1] === "a" ? "gif" : "png"}" alt=":${escapeHtml(m[2])}:" />`,
    },

    // Standard emoji
    { p: /^:([a-z0-9_+-]+):/i, r: (m) => getEmoji(m[1]) || e(m[0]) },

    // Timestamp
    {
      p: /^<t:(\d{10})(?::([RtTdDfF]))?>/,
      r: (m, cb) =>
        `<span class="${S.time}">${cb.timestamp({ timestamp: parseInt(m[1]), style: m[2] })}</span>`,
    },

    // Slash command
    {
      p: /^<\/([\w-]{1,32}):(\d{16,22})>/,
      r: (m, cb) => `<span class="${S.time}">${cb.slash({ name: m[1], id: m[2] })}</span>`,
    },

    // Mentions
    {
      p: /^<@!?(\d+)>/,
      r: (m, cb) =>
        `<span class="${S.mention}" data-user-id="${escapeHtml(m[1])}">${cb.user({ id: m[1] })}</span>`,
    },
    { p: /^<#(\d+)>/, r: (m, cb) => `<span class="${S.mention}">${cb.channel({ id: m[1] })}</span>` },
    { p: /^<@&(\d+)>/, r: (m, cb) => `<span class="${S.mention}">${cb.role({ id: m[1] })}</span>` },
    { p: /^@everyone/, r: (_, cb) => `<span class="${S.mention}">${cb.everyone({})}</span>` },
    { p: /^@here/, r: (_, cb) => `<span class="${S.mention}">${cb.here({})}</span>` },

    // Markdown link
    {
      p: /^\[([^\]]+)\]\(([^)]+)\)/,
      r: (m, _, parse) => `<a href="${escapeHtml(m[2])}" class="${S.link}">${parse(m[1])}</a>`,
    },

    // Headings
    {
      p: /^(#{1,3}) +([^\n]+)\n?/,
      l: true,
      r: (m, _, parse) => {
        const cls = m[1].length === 1 ? S.h1 : m[1].length === 2 ? S.h2 : S.h3;
        return `<span class="${cls}">${parse(m[2])}</span>`;
      },
    },

    // Footnote & lists
    { p: /^-# +([^\n]+)\n?/, r: spanClass(S.small), l: true },
    { p: /^[*-] +([^\n]+)\n?/, l: true, r: (m, _, parse) => `<span class="${S.list}">• ${parse(m[1])}</span>` },
    { p: /^(\d+)\. +([^\n]+)\n?/, l: true, r: (m, _, parse) => `<span class="${S.list}">${m[1]}. ${parse(m[2])}</span>` },

    // Text formatting
    { p: /^\*\*\*(.+?)\*\*\*/, r: (m, _, parse) => `<strong><em>${parse(m[1])}</em></strong>` },
    { p: /^\*\*(.+?)\*\*/, r: wrap("strong") },
    { p: /^__\*\*(.+?)\*\*__/, r: (m, _, parse) => `<u><strong>${parse(m[1])}</strong></u>` },
    { p: /^__\*(.+?)\*__/, r: (m, _, parse) => `<u><em>${parse(m[1])}</em></u>` },
    { p: /^__(.+?)__/, r: wrap("u") },
    { p: /^\*(.+?)\*/, r: wrap("em") },
    { p: /^_(.+?)_(?![a-zA-Z0-9])/, r: wrap("em") },
    { p: /^~~(.+?)~~/, r: spanClass(S.del) },

    // Links
    { p: /^<(https?:\/\/[^>]+)>/, r: autoLink },
    { p: /^(https?:\/\/[^\s<\])\n]+)/, r: autoLink },

    // Misc
    { p: /^\n/, r: () => "<br />" },
    { p: /^(¯\\_\(ツ\)_\/¯)/, r: (m) => e(m[1]) },
    { p: /^[^\s*_~|`<@\[\]\\\n]+/, r: (m) => e(m[0]) },
    { p: /^[ \t]+/, r: (m) => m[0] },
    { p: /^./, r: (m) => e(m[0]) },
  ];
};

// Parser
export function toHTML(source: string, options?: HtmlOptions): string {
  const escape = options?.escapeHTML ?? true;
  const callbacks: DiscordCallbacks = { ...defaultCallbacks, ...options?.discordCallback };
  const rules = createRules(escape);

  const parse = (text: string, lineStart = true): string => {
    let result = "";
    let remaining = text;
    let atLineStart = lineStart;

    while (remaining.length > 0) {
      let matched = false;

      for (const rule of rules) {
        if (rule.l && !atLineStart) continue;

        const match = rule.p.exec(remaining);
        if (match) {
          result += rule.r(match, callbacks, (t) => parse(t, false));
          remaining = remaining.slice(match[0].length);
          atLineStart = match[0].endsWith("\n") || match[0] === "\n";
          matched = true;
          break;
        }
      }

      if (!matched) {
        result += escape ? escapeHtml(remaining[0]) : remaining[0];
        atLineStart = remaining[0] === "\n";
        remaining = remaining.slice(1);
      }
    }

    return result;
  };

  return parse(source);
}

// React component types
interface MentionUser {
  id: string;
  username: string;
  globalName: string | null;
  displayName?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

interface Mentions {
  users?: MentionUser[];
  roles?: { id: string; name: string }[];
}

interface DiscordMarkdownProps {
  content: string;
  className?: string;
  mentions?: Mentions;
  options?: Omit<HtmlOptions, "escapeHTML">;
}

// SSR helpers
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function DiscordMarkdown(props: DiscordMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickedUser, setClickedUser] = useState<MentionUser | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Close popover on outside click
  useEffect(() => {
    if (!clickedUser) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-slot='popover-content']")) return;
      if (target.dataset.userId) return;
      setClickedUser(null);
      setAnchorRect(null);
    };

    const timer = setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [clickedUser]);

  if (!props.content) return null;

  if (!isClient) {
    return <div className={`leading-snug ${props.className}`}>{props.content}</div>;
  }

  // Build mention maps
  const userMap = new Map(props.mentions?.users?.map((u) => [u.id, u]) ?? []);
  const roleMap = new Map(props.mentions?.roles?.map((r) => [r.id, r]) ?? []);

  const html = toHTML(props.content, {
    escapeHTML: true,
    ...props.options,
    discordCallback: {
      user: (n) => {
        const user = userMap.get(n.id || "");
        return "@" + escapeHtml(user?.globalName || user?.username || n.id || "");
      },
      role: (n) => {
        const role = roleMap.get(n.id || "");
        return "@" + escapeHtml(role?.name || n.id || "");
      },
      ...props.options?.discordCallback,
    },
  });

  const isResolved = (u: MentionUser): u is MentionUser & GetApiByGuildIdNews200ItemAuthor =>
    Boolean(u.displayName && u.avatarUrl);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const userId = target.dataset.userId;
    if (userId) {
      const user = userMap.get(userId);
      if (user && isResolved(user)) {
        setClickedUser(user);
        setAnchorRect(target.getBoundingClientRect());
      }
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`leading-snug ${props.className}`}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleClick}
      />
      {clickedUser && anchorRect && isResolved(clickedUser) &&
        createPortal(
          <DiscordUserPopover
            user={clickedUser as GetApiByGuildIdNews200ItemAuthor}
            anchorRect={anchorRect}
          />,
          document.body,
        )}
    </>
  );
}
