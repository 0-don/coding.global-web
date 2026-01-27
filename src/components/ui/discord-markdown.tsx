"use client";

import hljs from "highlight.js";
import { get as getEmoji } from "node-emoji";
import { useSyncExternalStore } from "react";

// Types
interface DiscordNode {
  id?: string;
  name?: string;
  timestamp?: number;
  style?: string;
  animated?: boolean;
}

interface DiscordCallbacks {
  user: (node: DiscordNode) => string;
  channel: (node: DiscordNode) => string;
  role: (node: DiscordNode) => string;
  everyone: () => string;
  here: () => string;
  slash: (node: DiscordNode) => string;
  timestamp: (node: DiscordNode) => string;
}

interface HtmlOptions {
  escapeHTML?: boolean;
  discordOnly?: boolean;
  discordCallback?: Partial<DiscordCallbacks>;
}

// HTML escape
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Default callbacks
const defaultCallbacks: DiscordCallbacks = {
  user: (node) => "@" + escapeHtml(node.id || ""),
  channel: (node) => "#" + escapeHtml(node.id || ""),
  role: (node) => "&" + escapeHtml(node.id || ""),
  everyone: () => "@everyone",
  here: () => "@here",
  slash: (node) => "/" + escapeHtml(node.name || ""),
  timestamp: (node) => {
    const date = new Date((node.timestamp || 0) * 1000);
    switch (node.style) {
      case "t":
        return date.toLocaleTimeString(undefined, { timeStyle: "short" });
      case "T":
        return date.toLocaleTimeString(undefined, { timeStyle: "medium" });
      case "d":
        return date.toLocaleDateString(undefined, { dateStyle: "short" });
      case "D":
        return date.toLocaleDateString(undefined, { dateStyle: "medium" });
      case "F":
        return date.toLocaleString(undefined, {
          dateStyle: "full",
          timeStyle: "short",
        });
      default:
        return date.toLocaleString(undefined, {
          dateStyle: "long",
          timeStyle: "short",
        });
    }
  },
};

// Tailwind classes for styling
const styles = {
  heading1: "text-xl font-bold mt-2 mb-1 block",
  heading2: "text-lg font-bold mt-2 mb-1 block",
  heading3: "text-base font-bold mt-2 mb-1 block",
  blockquote:
    "border-l-4 border-muted-foreground/30 pl-3 my-1 text-muted-foreground block",
  code: "bg-muted px-1.5 py-0.5 rounded text-sm font-mono",
  codeBlock: "bg-muted p-3 rounded-md my-2 overflow-x-auto block",
  spoiler:
    "bg-foreground text-foreground rounded px-1 cursor-pointer hover:bg-transparent hover:text-inherit transition-colors",
  mention:
    "bg-primary/20 text-primary rounded px-1 hover:bg-primary/30 cursor-pointer",
  timestamp: "bg-muted rounded px-1",
  slash: "bg-muted rounded px-1",
  emoji: "inline-block h-5 w-5 align-text-bottom",
  link: "text-primary hover:underline",
  list: "list-disc list-inside my-1",
  listItem: "block",
  small: "text-xs text-muted-foreground block",
  del: "line-through text-muted-foreground",
};

// Parse rules - order matters (more specific first)
type ParseRule = {
  pattern: RegExp;
  replace: (
    match: RegExpExecArray,
    callbacks: DiscordCallbacks,
    parse: (text: string) => string,
    atLineStart: boolean,
  ) => string;
  requiresLineStart?: boolean;
};

const createRules = (escape: boolean): ParseRule[] => {
  const e = escape ? escapeHtml : (s: string) => s;

  return [
    // Escape sequences (backslash escaping)
    {
      pattern: /^\\([*_~|`\\<>\[\]#-])/,
      replace: (match) => e(match[1]),
    },
    // Code blocks (``` ```) - must be early to prevent inner parsing
    {
      pattern: /^```([a-z0-9-]*)\n?([\s\S]*?)```/i,
      replace: (match) => {
        const lang = match[1]?.trim();
        const code = match[2] || "";
        let highlighted: string;
        if (lang && hljs.getLanguage(lang)) {
          highlighted = hljs.highlight(code, {
            language: lang,
            ignoreIllegals: true,
          }).value;
        } else {
          highlighted = escapeHtml(code);
        }
        return `<pre class="${styles.codeBlock}"><code class="hljs${lang ? ` ${lang}` : ""}">${highlighted}</code></pre>`;
      },
    },
    // Double-backtick inline code (``code with ` inside``)
    {
      pattern: /^``([^`]+)``/,
      replace: (match) =>
        `<code class="${styles.code}">${escapeHtml(match[1])}</code>`,
    },
    // Single-backtick inline code (`code`)
    {
      pattern: /^`([^`]+)`/,
      replace: (match) =>
        `<code class="${styles.code}">${escapeHtml(match[1])}</code>`,
    },
    // Block quote (>>> multiline) - requires line start
    {
      pattern: /^>>> ([\s\S]+?)(?=\n\n|$)/,
      requiresLineStart: true,
      replace: (match, _, parse) =>
        `<blockquote class="${styles.blockquote}">${parse(match[1])}</blockquote>`,
    },
    // Block quote (> single line) - requires line start
    {
      pattern: /^> ([^\n]+)\n?/,
      requiresLineStart: true,
      replace: (match, _, parse) =>
        `<blockquote class="${styles.blockquote}">${parse(match[1])}</blockquote>`,
    },
    // Spoiler (||text||)
    {
      pattern: /^\|\|([\s\S]+?)\|\|/,
      replace: (match, _, parse) =>
        `<span class="${styles.spoiler}">${parse(match[1])}</span>`,
    },
    // Custom emoji (<:name:id> or <a:name:id>)
    {
      pattern: /^<(a?):(\w+):(\d+)>/,
      replace: (match) => {
        const animated = match[1] === "a";
        const name = match[2];
        const id = match[3];
        return `<img class="${styles.emoji}" src="https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}" alt=":${escapeHtml(name)}:" />`;
      },
    },
    // Standard emoji shortcodes (:clap:, :white_check_mark:, etc.)
    {
      pattern: /^:([a-z0-9_+-]+):/i,
      replace: (match) => {
        const emoji = getEmoji(match[1]);
        return emoji ? emoji : e(match[0]);
      },
    },
    // Timestamp (<t:timestamp:style>)
    {
      pattern: /^<t:(\d{10})(?::([RtTdDfF]))?>/,
      replace: (match, callbacks) => {
        const node = { timestamp: parseInt(match[1]), style: match[2] };
        return `<span class="${styles.timestamp}">${callbacks.timestamp(node)}</span>`;
      },
    },
    // Slash command (</name:id>)
    {
      pattern: /^<\/([\w-]{1,32}):(\d{16,22})>/,
      replace: (match, callbacks) => {
        const node = { name: match[1], id: match[2] };
        return `<span class="${styles.slash}">${callbacks.slash(node)}</span>`;
      },
    },
    // User mention (<@!id> or <@id>)
    {
      pattern: /^<@!?(\d+)>/,
      replace: (match, callbacks) => {
        const node = { id: match[1] };
        return `<span class="${styles.mention}">${callbacks.user(node)}</span>`;
      },
    },
    // Channel mention (<#id>)
    {
      pattern: /^<#(\d+)>/,
      replace: (match, callbacks) => {
        const node = { id: match[1] };
        return `<span class="${styles.mention}">${callbacks.channel(node)}</span>`;
      },
    },
    // Role mention (<@&id>)
    {
      pattern: /^<@&(\d+)>/,
      replace: (match, callbacks) => {
        const node = { id: match[1] };
        return `<span class="${styles.mention}">${callbacks.role(node)}</span>`;
      },
    },
    // @everyone
    {
      pattern: /^@everyone/,
      replace: (_, callbacks) =>
        `<span class="${styles.mention}">${callbacks.everyone()}</span>`,
    },
    // @here
    {
      pattern: /^@here/,
      replace: (_, callbacks) =>
        `<span class="${styles.mention}">${callbacks.here()}</span>`,
    },
    // Markdown link [text](url)
    {
      pattern: /^\[([^\]]+)\]\(([^)]+)\)/,
      replace: (match, _, parse) => {
        const text = parse(match[1]);
        const url = escapeHtml(match[2]);
        return `<a href="${url}" class="${styles.link}">${text}</a>`;
      },
    },
    // Heading (# ## ###) - only at line start
    {
      pattern: /^(#{1,3}) +([^\n]+)\n?/,
      requiresLineStart: true,
      replace: (match, _, parse) => {
        const level = match[1].length;
        const style =
          level === 1
            ? styles.heading1
            : level === 2
              ? styles.heading2
              : styles.heading3;
        return `<span class="${style}">${parse(match[2])}</span>`;
      },
    },
    // Footnote (-# text) - only at line start
    {
      pattern: /^-# +([^\n]+)\n?/,
      requiresLineStart: true,
      replace: (match, _, parse) =>
        `<span class="${styles.small}">${parse(match[1])}</span>`,
    },
    // Unordered list item (- or *) - only at line start
    {
      pattern: /^([*-]) +([^\n]+)\n?/,
      requiresLineStart: true,
      replace: (match, _, parse) =>
        `<span class="${styles.listItem}">• ${parse(match[2])}</span>`,
    },
    // Ordered list item (1. 2. etc) - only at line start
    {
      pattern: /^(\d+)\. +([^\n]+)\n?/,
      requiresLineStart: true,
      replace: (match, _, parse) =>
        `<span class="${styles.listItem}">${match[1]}. ${parse(match[2])}</span>`,
    },
    // Bold + Italic (***text***)
    {
      pattern: /^\*\*\*(.+?)\*\*\*/,
      replace: (match, _, parse) =>
        `<strong><em>${parse(match[1])}</em></strong>`,
    },
    // Bold (**text**)
    {
      pattern: /^\*\*(.+?)\*\*/,
      replace: (match, _, parse) => `<strong>${parse(match[1])}</strong>`,
    },
    // Bold + Underline (__**text**__)
    {
      pattern: /^__\*\*(.+?)\*\*__/,
      replace: (match, _, parse) =>
        `<u><strong>${parse(match[1])}</strong></u>`,
    },
    // Underline + Italic (__*text*__)
    {
      pattern: /^__\*(.+?)\*__/,
      replace: (match, _, parse) => `<u><em>${parse(match[1])}</em></u>`,
    },
    // Underline (__text__)
    {
      pattern: /^__(.+?)__/,
      replace: (match, _, parse) => `<u>${parse(match[1])}</u>`,
    },
    // Italic (*text*)
    {
      pattern: /^\*(.+?)\*/,
      replace: (match, _, parse) => `<em>${parse(match[1])}</em>`,
    },
    // Italic (_text_) - but not mid-word
    {
      pattern: /^_(.+?)_(?![a-zA-Z0-9])/,
      replace: (match, _, parse) => `<em>${parse(match[1])}</em>`,
    },
    // Strikethrough (~~text~~)
    {
      pattern: /^~~(.+?)~~/,
      replace: (match, _, parse) =>
        `<span class="${styles.del}">${parse(match[1])}</span>`,
    },
    // Autolink (<https://...>)
    {
      pattern: /^<(https?:\/\/[^>]+)>/,
      replace: (match) => {
        const url = escapeHtml(match[1]);
        return `<a href="${url}" class="${styles.link}">${url}</a>`;
      },
    },
    // URL (https://... or http://...)
    {
      pattern: /^(https?:\/\/[^\s<\])\n]+)/,
      replace: (match) => {
        const url = escapeHtml(match[1]);
        return `<a href="${url}" class="${styles.link}">${url}</a>`;
      },
    },
    // Newline
    {
      pattern: /^\n/,
      replace: () => "<br />",
    },
    // Emoticon (shrug)
    {
      pattern: /^(¯\\_\(ツ\)_\/¯)/,
      replace: (match) => e(match[1]),
    },
    // Text (consume until special character)
    {
      pattern: /^[^\s*_~|`<@\[\]\\\n]+/,
      replace: (match) => e(match[0]),
    },
    // Whitespace (space/tab but not newline)
    {
      pattern: /^[ \t]+/,
      replace: (match) => match[0],
    },
    // Fallback single character
    {
      pattern: /^./,
      replace: (match) => e(match[0]),
    },
  ];
};

// Main parser
export function toHTML(source: string, options?: HtmlOptions): string {
  const opts = {
    escapeHTML: true,
    discordOnly: false,
    discordCallback: {},
    ...options,
  };

  const callbacks: DiscordCallbacks = {
    ...defaultCallbacks,
    ...opts.discordCallback,
  };
  const rules = createRules(opts.escapeHTML);

  const parse = (text: string, isLineStart: boolean = true): string => {
    let result = "";
    let remaining = text;
    let atLineStart = isLineStart;

    while (remaining.length > 0) {
      let matched = false;

      for (const rule of rules) {
        // Skip rules that require line start if we're not at line start
        if (rule.requiresLineStart && !atLineStart) {
          continue;
        }

        const match = rule.pattern.exec(remaining);
        if (match) {
          result += rule.replace(
            match,
            callbacks,
            (t) => parse(t, false),
            atLineStart,
          );
          remaining = remaining.slice(match[0].length);
          // After a newline, we're at line start again
          atLineStart = match[0].endsWith("\n") || match[0] === "\n";
          matched = true;
          break;
        }
      }

      if (!matched) {
        result += opts.escapeHTML ? escapeHtml(remaining[0]) : remaining[0];
        atLineStart = remaining[0] === "\n";
        remaining = remaining.slice(1);
      }
    }

    return result;
  };

  return parse(source, true);
}

// Mention types for user resolution
interface MentionUser {
  id: string;
  username: string;
  globalName: string | null;
}

interface MentionRole {
  id: string;
  name: string;
}

interface Mentions {
  users?: MentionUser[];
  roles?: MentionRole[];
  everyone?: boolean;
}

// Resolved user type (from backend aggregation)
type ResolvedUser = { id: string; username: string; globalName: string | null };

// React component
interface DiscordMarkdownProps {
  content: string;
  className?: string;
  mentions?: Mentions;
  resolvedUsers?: ResolvedUser[];
  options?: Omit<HtmlOptions, "escapeHTML">;
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
    return (
      <div className={`leading-snug ${props.className}`}>{props.content}</div>
    );
  }

  // Build lookup maps for mentions
  const userMap = new Map(
    props.mentions?.users?.map((u) => [u.id, u]) ?? [],
  );
  const roleMap = new Map(
    props.mentions?.roles?.map((r) => [r.id, r]) ?? [],
  );
  const resolvedUserMap = new Map(
    props.resolvedUsers?.map((u) => [u.id, u]) ?? [],
  );

  // Create callbacks that resolve mentions
  const discordCallback: Partial<DiscordCallbacks> = {
    user: (node) => {
      const id = node.id || "";
      // First check mentions array, then resolvedUsers fallback
      const user = userMap.get(id) || resolvedUserMap.get(id);
      if (user) {
        return "@" + escapeHtml(user.globalName || user.username);
      }
      return "@" + escapeHtml(id);
    },
    role: (node) => {
      const role = roleMap.get(node.id || "");
      if (role) {
        return "@" + escapeHtml(role.name);
      }
      return "@" + escapeHtml(node.id || "");
    },
  };

  const html = toHTML(props.content, {
    escapeHTML: true,
    discordOnly: false,
    ...props.options,
    discordCallback: {
      ...discordCallback,
      ...props.options?.discordCallback,
    },
  });

  return (
    <div
      className={`leading-snug ${props.className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
