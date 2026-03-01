/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDiscordWidget, useTopStatsQuery } from "@/hook/bot-hook";
import { useSessionHook } from "@/hook/session-hook";
import {
  useTerminalMembersQuery,
  useTerminalTopQuery,
} from "@/hook/terminal-hook";
import { authClient } from "@/lib/auth-client";
import { rpc } from "@/lib/rpc";
import { cn } from "@/lib/utils";
import { getDiscordInviteLink, handleElysia } from "@/lib/utils/base";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";


function StaggeredHeroTitle({ text }: { text: string }) {
  // Split by "." to get individual words, filter empty strings, re-add the dot
  const words = text
    .split(".")
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => `${w}.`);

  // Each word gets a unique gradient for visual variety
  const wordGradients = [
    "from-primary via-primary to-chart-2", // Build.
    "from-chart-2 via-chart-2 to-chart-3", // Learn.
    "from-chart-3 via-chart-3 to-primary", // Connect.
  ];

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6">
      {words.map((word, i) => (
        <motion.span
          key={word}
          initial={{
            opacity: 0,
            y: 40,
            filter: "blur(12px)",
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.4 + i * 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative inline-block"
        >
          {/* Glow layer behind the text */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 1.2,
              delay: 0.6 + i * 0.2,
              ease: "easeOut",
            }}
            className={`bg-linear-to-r ${wordGradients[i] ?? wordGradients[0]} pointer-events-none absolute inset-0 bg-clip-text text-transparent blur-xl`}
            aria-hidden
          >
            {word}
          </motion.span>
          {/* Actual text */}
          <span
            className={`bg-linear-to-r ${wordGradients[i] ?? wordGradients[0]} bg-clip-text text-transparent`}
          >
            {word}
          </span>
        </motion.span>
      ))}
    </span>
  );
}

/** Simple typewriter for terminal commands (no loop, just types out) */
function TerminalTypewriter({ text, delay = 30 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          className="ml-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// ─── Terminal colored output renderer ────────────────────────────────────────
// Parses {{color:text}} markers in strings and renders colored spans
const COLOR_MAP: Record<string, string> = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  red: "text-red-400",
  orange: "text-orange-400",
  blue: "text-blue-400",
  white: "text-white",
  pink: "text-pink-400",
};

function TerminalColoredOutput({ text }: { text: string }) {
  const parts = text.split(/(\{\{\w+:[^}]+\}\})/);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{\{(\w+):(.+)\}\}$/);
        if (match) {
          const [, color, content] = match;
          return (
            <span key={i} className={COLOR_MAP[color] || "text-white"}>
              {content}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** Fast colored typewriter — strips markers, types plain text, renders colored when done */
function TerminalColoredTypewriter({ text, delay = 8 }: { text: string; delay?: number }) {
  const plain = text.replace(/\{\{\w+:([^}]+)\}\}/g, "$1");
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (charIndex < plain.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), delay);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [charIndex, plain.length, delay]);

  if (done) return <TerminalColoredOutput text={text} />;
  return <span>{plain.slice(0, charIndex)}<motion.span className="ml-0.5" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>|</motion.span></span>;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const ORIGIN_SIZE = { width: 700, height: 350 };
const ORIGIN_POS = { x: 0, y: 0 }; // relative to container center
const LOADING_MARKER = "__LOADING__";
const ALL_COMMANDS = [
  "/help",
  "/about",
  "/stats",
  "/usercount",
  "/discord",
  "/members",
  "/top",
  "/search",
  "/login",
  "/me",
  "/os",
  "/clear",
];

// ─── Fuzzy autocomplete helper ───────────────────────────────────────────────
function getAutocompleteSuggestion(input: string): string | null {
  if (!input || !input.startsWith("/")) return null;
  const lower = input.toLowerCase();
  // Exact prefix match first
  const prefixMatch = ALL_COMMANDS.find(
    (c) => c.startsWith(lower) && c !== lower,
  );
  if (prefixMatch) return prefixMatch;
  // Fuzzy: check if all chars of input appear in order
  const fuzzy = ALL_COMMANDS.find((cmd) => {
    let ci = 0;
    for (const ch of cmd) {
      if (ch === lower[ci]) ci++;
      if (ci === lower.length) return cmd !== lower;
    }
    return false;
  });
  return fuzzy ?? null;
}

// ─── InteractiveTerminal ─────────────────────────────────────────────────────
function InteractiveTerminal() {
  const session = useSessionHook();
  const isLoggedIn = !!session?.data?.user?.id;
  const discordUsername = session?.data?.user?.name ?? null;
  const t = useTranslations();
  const [commands, setCommands] = useState<
    Array<{ command: string; output: string; id: number; isUser?: boolean; isBoot?: boolean }>
  >([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const cmdIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command history
  const historyRef = useRef<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // API hooks
  const { data: widget } = useDiscordWidget();
  const { data: topStats } = useTopStatsQuery();
  const membersQuery = useTerminalMembersQuery();
  const topQuery = useTerminalTopQuery({ limit: 5 });

  // Boot intro message (single block)
  const bootMessage = isLoggedIn
    ? `  {{cyan:/top}}      {{white:— Top contributors}}\n  {{cyan:/members}}  {{white:— Member stats}}\n  {{cyan:/me}}       {{white:— Your profile}}\n\n{{green:Logged in as}} {{cyan:${discordUsername || "User"}}}. Type {{cyan:/help}} for all commands.`
    : `  {{cyan:/top}}      {{white:— Top contributors}}\n  {{cyan:/members}}  {{white:— Member stats}}\n  {{cyan:/login}}    {{white:— Discord login}}\n\nType {{cyan:/help}} for all commands.`;

  const memberCount = widget?.memberCount?.toLocaleString() ?? "...";
  const onlineCount = widget?.presenceCount?.toLocaleString() ?? "...";
  const totalMessages = topStats?.totalMessages?.toLocaleString() ?? "...";
  const voiceHours = topStats?.totalVoiceHours?.toLocaleString() ?? "...";
  const discordLink = getDiscordInviteLink();

  // Detect OS
  const [userOS, setUserOS] = useState<"windows" | "mac" | "linux">("windows");
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) setUserOS("mac");
    else if (ua.includes("linux") || ua.includes("android")) setUserOS("linux");
    else setUserOS("windows");
  }, []);

  // Prompt prefix as JSX — OS-specific
  const promptUser = discordUsername || "guest";
  const PromptPrefix = () => {
    if (userOS === "mac") return (
      <span className="mr-2 shrink-0 select-none">
        <span className="text-green-400">{promptUser}</span>
        <span className="text-white/40">@</span>
        <span className="text-cyan-400">coding.global</span>
        <span className="text-white/30"> ~ </span>
        <span className="text-purple-400">%</span>
      </span>
    );
    if (userOS === "linux") return (
      <span className="mr-2 shrink-0 select-none">
        <span className="text-white/40">[</span>
        <span className="text-green-400">{promptUser}</span>
        <span className="text-white/40">@</span>
        <span className="text-cyan-400">coding.global</span>
        <span className="text-white/30"> ~</span>
        <span className="text-white/40">]</span>
        <span className="text-white/60">$</span>
      </span>
    );
    // Windows default
    return (
      <span className="mr-2 shrink-0 select-none">
        <span className="text-white">coding</span>
        <span className="text-red-500">.global</span>
        <span className="text-white/50">\</span>
        <span className="text-yellow-400">{promptUser}</span>
        <span className="text-white/40">&gt;</span>
      </span>
    );
  };

  // Autocomplete ghost
  const suggestion = getAutocompleteSuggestion(inputValue);
  const ghostText =
    suggestion && inputValue ? suggestion.slice(inputValue.length) : "";

  // Static commands
  const staticCommands: Record<string, string> = {
    "/help":
      "{{yellow:Available commands:}}\n  {{cyan:/help}}    — Show this help message\n  {{cyan:/about}}   — Learn about coding.global\n  {{cyan:/stats}}   — Show member statistics\n  {{cyan:/discord}} — Get Discord invite link\n  {{cyan:/members}} — Show member join stats\n  {{cyan:/top}}     — Show top contributors\n  {{cyan:/search}}  — Search users (e.g. /search Don)\n  {{cyan:/login}}   — Login with Discord\n  {{cyan:/me}}      — Show your profile\n  {{cyan:/os}}      — Show your system info\n  {{cyan:/clear}}   — Clear terminal",
    "/about":
      "{{green:coding.global}} is a thriving community of developers!\nWe connect thousands of programmers worldwide to learn,\nshare knowledge, and build amazing projects together.",
    "/stats": `{{yellow:Community Stats:}}\n  • {{cyan:${memberCount}}} Members\n  • {{green:${onlineCount}}} Online\n  • {{purple:${totalMessages}}} Messages\n  • {{orange:${voiceHours}}} Voice Hours`,
    "/usercount": `{{yellow:Community Stats:}}\n  • {{cyan:${memberCount}}} Members\n  • {{green:${onlineCount}}} Online\n  • {{purple:${totalMessages}}} Messages\n  • {{orange:${voiceHours}}} Voice Hours`,
    "/discord": `Join our Discord: {{cyan:${discordLink}}}\nConnect with developers from around the world!`,
    "/clear": "CLEAR_COMMAND",
    "/os": (() => {
      const ua = navigator.userAgent;
      let os = "Unknown";
      let device = "Desktop";
      if (/iPhone|iPad|iPod/.test(ua)) { os = "iOS"; device = /iPad/.test(ua) ? "Tablet" : "Mobile"; }
      else if (/Android/.test(ua)) { os = "Android"; device = /Mobile/.test(ua) ? "Mobile" : "Tablet"; }
      else if (/Mac/.test(ua)) os = "macOS";
      else if (/Win/.test(ua)) os = "Windows";
      else if (/Linux/.test(ua)) os = "Linux";
      let browser = "Unknown";
      if (/Edg\//.test(ua)) browser = "Edge";
      else if (/Chrome\//.test(ua)) browser = "Chrome";
      else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
      else if (/Firefox\//.test(ua)) browser = "Firefox";
      const w = window.screen.width;
      const h = window.screen.height;
      const touch = "ontouchstart" in window ? "Yes" : "No";
      return `{{yellow:System Info:}}\n  {{cyan:OS}}         {{white:${os}}}\n  {{cyan:Device}}     {{white:${device}}}\n  {{cyan:Browser}}    {{white:${browser}}}\n  {{cyan:Screen}}     {{white:${w}×${h}}}\n  {{cyan:Language}}   {{white:${navigator.language}}}\n  {{cyan:Touch}}      {{white:${touch}}}\n  {{cyan:Cores}}      {{white:${navigator.hardwareConcurrency || "?"}}}`;
    })(),
    "/login": isLoggedIn
      ? `{{green:Already logged in as}} {{cyan:${discordUsername || "User"}}}\nType {{cyan:/me}} to view your profile.`
      : "LOGIN_COMMAND",
    "/me": isLoggedIn
      ? "ME_ASYNC"
      : "{{red:Not logged in.}} Type {{cyan:/login}} to login with Discord.",
  };

  // Async commands
  const asyncCommands: Record<string, (args: string) => Promise<string>> = {
    "/members": async () => {
      try {
        const data = await membersQuery.fetch();
        if (!data) return "No members data available.";
        const d = data as {
          memberCount?: number;
          thirtyDaysCount?: number;
          sevenDaysCount?: number;
          oneDayCount?: number;
        };
        return `{{yellow:Member Stats:}}\n  • {{cyan:${d.memberCount?.toLocaleString() ?? "?"}}} Total Members\n  • {{green:${d.thirtyDaysCount?.toLocaleString() ?? "?"}}} joined last 30 days\n  • {{green:${d.sevenDaysCount?.toLocaleString() ?? "?"}}} joined last 7 days\n  • {{orange:${d.oneDayCount?.toLocaleString() ?? "?"}}} joined today`;
      } catch {
        return "❌ Failed to fetch members. Try again later.";
      }
    },
    "/top": async () => {
      try {
        const data = await topQuery.fetch();
        if (!data) return "No data available.";
        let output = "{{yellow:Top Contributors:}}\n";
        const topData = data as {
          mostActiveMessageUsers?: Array<{
            displayName?: string;
            count?: number;
          }>;
          mostActiveVoiceUsers?: Array<{
            displayName?: string;
            sum?: number;
          }>;
          mostHelpfulUsers?: Array<{
            displayName?: string;
            count?: number;
          }>;
          totalMessages?: number;
          totalVoiceHours?: number;
        };
        if (topData.mostActiveMessageUsers?.length) {
          output += "\n  {{cyan:Messages:}}\n";
          output += topData.mostActiveMessageUsers
            .slice(0, 5)
            .map(
              (u, i) =>
                `    {{white:${i + 1}.}} {{green:${u.displayName || "Unknown"}}} — {{cyan:${u.count?.toLocaleString() || 0}}}`,
            )
            .join("\n");
        }
        if (topData.mostActiveVoiceUsers?.length) {
          output += "\n\n  {{purple:Voice:}}\n";
          output += topData.mostActiveVoiceUsers
            .slice(0, 5)
            .map(
              (u, i) =>
                `    {{white:${i + 1}.}} {{green:${u.displayName || "Unknown"}}} — {{purple:${Math.round(u.sum || 0)}h}}`,
            )
            .join("\n");
        }
        if (topData.mostHelpfulUsers?.length) {
          output += "\n\n  {{orange:Helpers:}}\n";
          output += topData.mostHelpfulUsers
            .slice(0, 5)
            .map(
              (u, i) =>
                `    {{white:${i + 1}.}} {{green:${u.displayName || "Unknown"}}} — {{orange:${u.count || 0}}} helps`,
            )
            .join("\n");
        }
        if (topData.totalMessages || topData.totalVoiceHours) {
          output += `\n\n  {{yellow:Total:}} {{cyan:${topData.totalMessages?.toLocaleString() ?? "?"}}} messages, {{purple:${topData.totalVoiceHours?.toLocaleString() ?? "?"}}} voice hours`;
        }
        return output;
      } catch {
        return "❌ Failed to fetch top contributors. Try again later.";
      }
    },
    "/search": async (args: string) => {
      if (!args.trim())
        return "Usage: /search <username>\nExample: /search Don";
      try {
        const data = await topQuery.fetch();
        if (!data) return "No data available to search.";
        const topData = data as {
          mostActiveMessageUsers?: Array<{
            displayName?: string;
            username?: string;
            globalName?: string;
            id?: string;
          }>;
          mostActiveVoiceUsers?: Array<{
            displayName?: string;
            username?: string;
            globalName?: string;
            id?: string;
          }>;
          mostHelpfulUsers?: Array<{
            displayName?: string;
            username?: string;
            globalName?: string;
            id?: string;
          }>;
        };
        const allUsers = [
          ...(topData.mostActiveMessageUsers || []),
          ...(topData.mostActiveVoiceUsers || []),
          ...(topData.mostHelpfulUsers || []),
        ];
        const seen = new Set<string>();
        const unique = allUsers.filter((u) => {
          if (!u.id || seen.has(u.id)) return false;
          seen.add(u.id);
          return true;
        });
        const q = args.trim().toLowerCase();
        const results = unique.filter(
          (u) =>
            u.displayName?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.globalName?.toLowerCase().includes(q),
        );
        if (results.length === 0)
          return `No users found for "${args.trim()}".`;
        const lines = results
          .slice(0, 10)
          .map(
            (u) =>
              `  • {{green:${u.displayName || u.username || "Unknown"}}} ({{cyan:@${u.username || "?"}}})`,
          );
        return `🔍 Search results for "${args.trim()}":\n${lines.join("\n")}${results.length > 10 ? `\n  ... and ${results.length - 10} more` : ""}`;
      } catch {
        return "❌ Search failed. Try again later.";
      }
    },
  };

  // Boot sequence — single intro message
  useEffect(() => {
    if (!isInteractive && commands.length === 0) {
      setCommands([{
        command: "",
        output: bootMessage,
        id: cmdIdRef.current++,
        isBoot: true,
      }]);
      setIsInteractive(true);
    }
  }, []);

  // Auto-scroll to bottom after new commands
  useEffect(() => {
    const inner = terminalRef.current;
    if (!inner) return;
    const scrollEl = inner.closest(".terminal-scroll");
    if (scrollEl) {
      setTimeout(() => { scrollEl.scrollTop = scrollEl.scrollHeight; }, 50);
    }
  }, [commands]);

  const addOutput = (output: string) => {
    setCommands((prev) => [
      ...prev,
      { command: "", output, id: cmdIdRef.current++ },
    ]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    const parts = trimmedCmd.split(/\s+/);
    const baseCmd = parts[0];
    const args = cmd.trim().slice(baseCmd.length).trim();

    posthog.capture("terminal_command_executed", {
      command: baseCmd,
      is_valid_command: !!(staticCommands[baseCmd] || asyncCommands[baseCmd]),
    });

    // Add to history
    historyRef.current.push(cmd.trim());
    setHistoryIndex(-1);

    setCommands((prev) => [
      ...prev,
      { command: cmd, output: "", id: cmdIdRef.current++, isUser: true },
    ]);
    setInputValue("");

    if (staticCommands[baseCmd]) {
      if (baseCmd === "/clear") {
        setCommands([]);
        setTimeout(() => {
          setCommands([
            {
              command: "",
              output:
                "Terminal cleared. Type {{cyan:/help}} to see available commands.",
              id: cmdIdRef.current++,
            },
          ]);
        }, 100);
        return;
      }
      if (staticCommands[baseCmd] === "LOGIN_COMMAND") {
        addOutput("{{cyan:Redirecting to Discord login...}}");
        setTimeout(() => {
          authClient.signIn.social({
            provider: "discord",
            callbackURL: "/",
          });
        }, 500);
        return;
      }
      if (staticCommands[baseCmd] === "ME_ASYNC") {
        addOutput(LOADING_MARKER);
        try {
          const userId = session?.data?.user?.id;
          const userName = session?.data?.user?.name || "User";
          const userEmail = session?.data?.user?.email || "—";
          const statsData = await handleElysia(await rpc.api.terminal.users.post({ userIds: [userId!] }));
          const s = (statsData as Array<{
            stats?: {
              messages?: { total?: number; last7Days?: number; last24Hours?: number };
              voice?: { totalHours?: number; last7DaysHours?: number; last24HoursHours?: number };
              help?: { given?: number; received?: number };
              lastActivity?: { lastVoice?: string; lastMessage?: string };
            };
          }>)?.[0]?.stats;
          let output = `{{yellow:Your Profile:}}\n  {{cyan:Name}}      {{white:${userName}}}\n  {{cyan:Email}}     {{white:${userEmail}}}\n  {{cyan:ID}}        {{white:${userId}}}`;
          if (s?.messages) {
            output += `\n\n{{yellow:Messages:}}\n  {{cyan:Total}}     {{white:${s.messages.total?.toLocaleString() ?? "0"}}}\n  {{cyan:Last 7d}}   {{white:${s.messages.last7Days?.toLocaleString() ?? "0"}}}\n  {{cyan:Last 24h}}  {{white:${s.messages.last24Hours?.toLocaleString() ?? "0"}}}`;
          }
          if (s?.voice) {
            output += `\n\n{{purple:Voice:}}\n  {{cyan:Total}}     {{purple:${Math.round(s.voice.totalHours ?? 0)}h}}\n  {{cyan:Last 7d}}   {{purple:${Math.round(s.voice.last7DaysHours ?? 0)}h}}\n  {{cyan:Last 24h}}  {{purple:${Math.round(s.voice.last24HoursHours ?? 0)}h}}`;
          }
          if (s?.help) {
            output += `\n\n{{orange:Help:}}\n  {{cyan:Given}}     {{green:${s.help.given ?? 0}}}\n  {{cyan:Received}}  {{green:${s.help.received ?? 0}}}`;
          }
          setCommands((prev) => {
            const idx = prev.findLastIndex((c) => c.output === LOADING_MARKER);
            if (idx !== -1) {
              const copy = [...prev];
              copy[idx] = { ...copy[idx], output };
              return copy;
            }
            return [...prev, { command: "", output, id: cmdIdRef.current++ }];
          });
        } catch {
          addOutput("{{yellow:Your Profile:}}\n  {{cyan:Name}}  {{white:" + (session?.data?.user?.name || "User") + "}}\n  {{cyan:Email}} {{white:" + (session?.data?.user?.email || "—") + "}}\n  {{red:Could not fetch server stats.}}");
        }
        return;
      }
      addOutput(staticCommands[baseCmd]);
      return;
    }

    if (asyncCommands[baseCmd]) {
      addOutput(LOADING_MARKER);
      try {
        const result = await asyncCommands[baseCmd](args);
        setCommands((prev) => {
          const loadingIdx = prev.findLastIndex(
            (c) => c.output === LOADING_MARKER,
          );
          if (loadingIdx !== -1) {
            const updated = [...prev];
            updated[loadingIdx] = { ...updated[loadingIdx], output: result };
            return updated;
          }
          return [
            ...prev,
            { command: "", output: result, id: cmdIdRef.current++ },
          ];
        });
      } catch {
        addOutput("❌ An error occurred. Try again later.");
      }
      return;
    }

    addOutput(
      `{{red:'${cmd}'}} is not recognized as an internal or external command.`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
      return;
    }

    // Ctrl+L → clear terminal
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setCommands([]);
      return;
    }

    // Tab or Right arrow → accept autocomplete
    if ((e.key === "Tab" || e.key === "ArrowRight") && ghostText) {
      e.preventDefault();
      setInputValue(suggestion ?? inputValue);
      return;
    }

    // Command history: Up
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const hist = historyRef.current;
      if (hist.length === 0) return;
      const newIdx =
        historyIndex === -1 ? hist.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInputValue(hist[newIdx]);
      return;
    }

    // Command history: Down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const hist = historyRef.current;
      if (historyIndex === -1) return;
      const newIdx = historyIndex + 1;
      if (newIdx >= hist.length) {
        setHistoryIndex(-1);
        setInputValue("");
      } else {
        setHistoryIndex(newIdx);
        setInputValue(hist[newIdx]);
      }
      return;
    }
  };

  return (
    <div
      ref={terminalRef}
      className="h-full space-y-1 font-mono text-sm"
    >
      {commands.map((cmd) => (
        <div key={cmd.id} className="space-y-0.5">
          {cmd.command && (
            <div className="flex items-center">
              <PromptPrefix />
              {cmd.isUser ? (
                <span>{cmd.command}</span>
              ) : (
                <TerminalTypewriter text={cmd.command} delay={30} />
              )}
            </div>
          )}
          {cmd.output && (
            <div
              className="text-muted-foreground text-sm whitespace-pre-line"
            >
              {cmd.output === LOADING_MARKER ? (
                <span className="text-muted-foreground inline-flex gap-0.5 text-sm">
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                </span>
              ) : cmd.isBoot ? (
                <TerminalColoredTypewriter text={cmd.output} delay={8} />
              ) : (
                <TerminalColoredOutput text={cmd.output} />
              )}
            </div>
          )}
        </div>
      ))}
      {isInteractive && (
        <div className="flex items-center">
          <PromptPrefix />
          <div className="relative flex-1">
            <input
              ref={inputRef}
              data-terminal-input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setHistoryIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="relative z-10 w-full bg-transparent outline-none"
              placeholder={
                commands.length <= 1 ? "Type /help for commands..." : ""
              }
            />
            {/* Ghost autocomplete text */}
            {ghostText && (
              <span className="pointer-events-none absolute left-0 top-0 flex items-center">
                <span className="invisible">{inputValue}</span>
                <span className="text-muted-foreground/40">{ghostText}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HeroSection with draggable/resizable terminal ───────────────────────────
export function HeroSection() {
  const t = useTranslations();
  const session = useSessionHook();
  const promptUser = session?.data?.user?.name ?? "guest";

  // Terminal window state
  const [terminalState, setTerminalState] = useState<
    "normal" | "maximized" | "minimized"
  >("normal");
  const [terminalSize, setTerminalSize] = useState({ ...ORIGIN_SIZE });
  const [terminalPos, setTerminalPos] = useState({ ...ORIGIN_POS });

  // Detect OS for terminal styling
  const [userOS, setUserOS] = useState<"windows" | "mac" | "linux">("windows");
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) setUserOS("mac");
    else if (ua.includes("linux") || ua.includes("android")) setUserOS("linux");
    else setUserOS("windows");
  }, []);

  // Refs for resize
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  const resizeDirRef = useRef({ top: false, bottom: false, left: false, right: false });

  // Refs for drag
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Store pre-fullscreen state to restore on drag-out
  const preFullscreenRef = useRef({ size: { ...ORIGIN_SIZE }, pos: { ...ORIGIN_POS } });

  // Timer for minimize auto-restore
  const stateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dock zone ref for snap-back
  const dockZoneRef = useRef<HTMLDivElement>(null);
  const [isNearDock, setIsNearDock] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Custom scrollbar
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const [scrollThumb, setScrollThumb] = useState({ ratio: 0, thumbH: 0, visible: false });

  // Terminal is undocked when it has been dragged away
  const isUndocked = terminalPos.x !== 0 || terminalPos.y !== 0;

  // ── Close: instant dock + minimize ──
  const handleClose = () => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setTerminalState("minimized");
    setTerminalPos({ ...ORIGIN_POS });
    if (terminalState === "maximized") {
      setTerminalSize({ ...preFullscreenRef.current.size });
    }
  };

  // ── Minimize ──
  const handleMinimize = () => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setTerminalState("minimized");
  };

  // ── Maximize / restore ──
  const handleMaximize = () => {
    if (stateTimerRef.current) {
      clearTimeout(stateTimerRef.current);
      stateTimerRef.current = null;
    }
    if (terminalState === "minimized") {
      setTerminalState("normal");
    } else if (terminalState === "maximized") {
      setTerminalState("normal");
      setTerminalSize({ ...preFullscreenRef.current.size });
      setTerminalPos({ ...preFullscreenRef.current.pos });
    } else {
      // Save current state before fullscreen
      preFullscreenRef.current = {
        size: { ...terminalSize },
        pos: { ...terminalPos },
      };
      setTerminalState("maximized");
    }
  };

  // ── Drag logic ──
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);

    if (terminalState === "maximized") {
      const restoreSize = preFullscreenRef.current.size;
      setTerminalState("normal");
      setTerminalSize({ ...restoreSize });
      const newX = clientX - restoreSize.width / 2;
      const newY = clientY - 20;
      setTerminalPos({ x: newX, y: newY });
      dragStartRef.current = { mouseX: clientX, mouseY: clientY, posX: newX, posY: newY };
    } else {
      const el = (e.target as HTMLElement).closest('[data-terminal-window]');
      if (el) {
        const rect = el.getBoundingClientRect();
        setTerminalPos({ x: rect.left, y: rect.top });
        dragStartRef.current = { mouseX: clientX, mouseY: clientY, posX: rect.left, posY: rect.top };
      } else {
        dragStartRef.current = { mouseX: clientX, mouseY: clientY, posX: terminalPos.x, posY: terminalPos.y };
      }
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const getXY = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getXY(e);
      const dx = x - dragStartRef.current.mouseX;
      const dy = y - dragStartRef.current.mouseY;
      const rawX = dragStartRef.current.posX + dx;
      const rawY = dragStartRef.current.posY + dy;
      const clampedX = Math.max(-terminalSize.width + 100, Math.min(window.innerWidth - 100, rawX));
      const clampedY = Math.max(-20, Math.min(window.innerHeight - 44, rawY));
      setTerminalPos({ x: clampedX, y: clampedY });
      setIsNearEdge(terminalState !== "minimized" && (y <= 10 || x <= 10 || x >= window.innerWidth - 10));
      if (dockZoneRef.current) {
        const dock = dockZoneRef.current.getBoundingClientRect();
        const visibleHeight = terminalState === "minimized" ? 44 : terminalSize.height;
        const centerX = (dragStartRef.current.posX + dx) + terminalSize.width / 2;
        const centerY = (dragStartRef.current.posY + dy) + visibleHeight / 2;
        const dockCenterX = dock.left + dock.width / 2;
        const dockCenterY = dock.top + dock.height / 2;
        const dist = Math.hypot(centerX - dockCenterX, centerY - dockCenterY);
        setIsNearDock(dist < 200);
      }
    };
    const handleEnd = () => {
      setIsDragging(false);
      if (isNearEdge) { setIsNearEdge(false); handleMaximize(); return; }
      if (isNearDock) { setTerminalPos({ ...ORIGIN_POS }); setIsNearDock(false); return; }
      // Clamp: don't let terminal hide behind navbar (48px)
      setTerminalPos(prev => prev.y < 48 && prev.y !== 0 ? { ...prev, y: 48 } : prev);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, isNearDock, isNearEdge, terminalSize.width, terminalSize.height]);

  // ── Resize logic (all edges) ──
  const handleResizeStart = (dir: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeDirRef.current = { top: !!dir.top, bottom: !!dir.bottom, left: !!dir.left, right: !!dir.right };
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: terminalSize.width,
      height: terminalSize.height,
      posX: terminalPos.x,
      posY: terminalPos.y,
    };
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStartRef.current.x;
      const dy = e.clientY - resizeStartRef.current.y;
      const d = resizeDirRef.current;
      let newW = resizeStartRef.current.width;
      let newH = resizeStartRef.current.height;
      let newX = resizeStartRef.current.posX;
      let newY = resizeStartRef.current.posY;

      if (d.right) newW = Math.max(400, Math.min(1600, resizeStartRef.current.width + dx));
      if (d.left) {
        newW = Math.max(400, Math.min(1600, resizeStartRef.current.width - dx));
        newX = resizeStartRef.current.posX + (resizeStartRef.current.width - newW);
      }
      if (d.bottom) newH = Math.max(250, Math.min(900, resizeStartRef.current.height + dy));
      if (d.top) {
        newH = Math.max(250, Math.min(900, resizeStartRef.current.height - dy));
        newY = resizeStartRef.current.posY + (resizeStartRef.current.height - newH);
      }

      setTerminalSize({ width: newW, height: newH });
      // Only adjust position for top/left resize when undocked (fixed positioning)
      const wasDocked = resizeStartRef.current.posX === 0 && resizeStartRef.current.posY === 0;
      if ((d.left || d.top) && !wasDocked) setTerminalPos({ x: newX, y: newY });
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // ── Terminal style ──
  const getTerminalWrapperStyle = (): React.CSSProperties => {
    if (terminalState === "maximized") {
      return {
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      };
    }
    // When dragged away from origin, use fixed positioning
    if (terminalPos.x !== 0 || terminalPos.y !== 0) {
      return {
        position: "fixed",
        left: `${terminalPos.x}px`,
        top: `${terminalPos.y}px`,
        width: `${terminalSize.width}px`,
        maxWidth: "95vw",
        zIndex: isDragging ? 50 : 40,
      };
    }
    return {
      position: "absolute" as const,
      inset: 0,
      zIndex: isDragging ? 50 : 10,
    };
  };

  return (
    <div className="container mx-auto px-4">
      {/* Fullscreen snap preview overlay */}
      {isNearEdge && isDragging && (
        <div
          className="pointer-events-none fixed inset-2 z-[9998] rounded-lg border-2 border-primary/50 bg-primary/5 backdrop-blur-sm"
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-primary/60 font-mono text-sm">Release for fullscreen</span>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        className="flex flex-col items-center gap-8 text-center"
      >
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-bold md:text-7xl"
        >
          <StaggeredHeroTitle text={t("HOME.HERO_TITLE")} />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground max-w-2xl text-xl md:text-2xl"
        >
          {t("HOME.HERO_SUBTITLE")}
        </motion.p>

        {/* Terminal container — always maintains layout space */}
        <div
          className="relative"
          style={{
            width: `${terminalSize.width}px`,
            maxWidth: "95vw",
            height: terminalState === "minimized"
              ? 44
              : `${terminalSize.height + 44}px`,
          }}
        >
          {/* Dock Zone — visible when terminal is undocked */}
          <div
            ref={dockZoneRef}
            className={cn(
              "absolute top-0 left-0 right-0 rounded-lg",
              isUndocked || terminalState === "maximized"
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
            style={{
              height: terminalState === "minimized" ? 44 : terminalSize.height + 44,
            }}
          >
            <div
              className={cn(
                "h-full w-full rounded-lg border-2 border-dashed",
                isNearDock
                  ? "border-primary/60 bg-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb,99,102,241),0.3)]"
                  : "border-muted-foreground/20 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5",
              )}
            >
              <div className="flex h-full items-center justify-center">
                <span
                  className={cn(
                    "font-mono text-sm",
                    isNearDock ? "text-primary/60" : "text-muted-foreground/30",
                  )}
                >
                  {isNearDock ? "Release to dock" : "Terminal undocked"}
                </span>
              </div>
            </div>
          </div>

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: terminalState === "minimized" ? 0.8 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              ...getTerminalWrapperStyle(),
              ...(isSnapping && {
                transition: "left 0.35s ease-out, top 0.35s ease-out, width 0.35s ease-out, height 0.35s ease-out",
              }),
            }}
            className={cn(isDragging && "pointer-events-auto")}
          >
          <Card data-terminal-window className="border-primary relative flex flex-col gap-0 overflow-hidden rounded-lg bg-black/90 p-0 text-left backdrop-blur-sm">
            {/* ── Header (draggable) ── Win11 Terminal style */}
            <div
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{ touchAction: "none" }}
              onDoubleClick={() => {
                if (terminalState === "minimized") {
                  setTerminalState("normal");
                } else if (terminalState === "maximized") {
                  setTerminalState("normal");
                  setTerminalSize({ ...ORIGIN_SIZE });
                } else {
                  handleMaximize();
                }
              }}
              className={cn(
                "flex shrink-0 items-center justify-between rounded-t-lg border-b border-white/5 bg-[#1e1e1e] px-3 py-2",
                terminalState !== "maximized" && "cursor-grab",
                isDragging && "cursor-grabbing",
              )}
            >
              {userOS === "mac" ? (
                <>
                  {/* macOS traffic lights — left */}
                  <div className="flex items-center gap-2 select-none">
                    <button onClick={handleClose} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" aria-label="Close" />
                    <button onClick={handleMinimize} className={cn("h-3 w-3 rounded-full transition-colors", terminalState === "minimized" ? "bg-yellow-800/50" : "bg-yellow-500 hover:bg-yellow-400")} aria-label="Minimize" />
                    <button onClick={handleMaximize} className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" aria-label="Maximize" />
                  </div>
                  {/* Center title */}
                  <span className="text-[13px] text-white/50 font-medium select-none absolute left-1/2 -translate-x-1/2">{promptUser}@coding.global</span>
                  <div />
                </>
              ) : userOS === "linux" ? (
                <>
                  {/* Linux — minimal left title */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[13px] text-white/50 font-medium">{promptUser}@coding.global: ~</span>
                  </div>
                  {/* Right: simple controls */}
                  <div className="flex items-center gap-1">
                    <button onClick={handleMinimize} disabled={terminalState === "minimized"} className={cn("flex h-7 w-7 items-center justify-center rounded transition-colors", terminalState === "minimized" ? "text-white/15" : "text-white/50 hover:bg-white/10")} aria-label="Minimize">
                      <svg width="8" height="1" viewBox="0 0 8 1"><rect width="8" height="1" fill="currentColor"/></svg>
                    </button>
                    <button onClick={handleMaximize} className="flex h-7 w-7 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10" aria-label="Maximize">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="7" height="7" rx="0.5"/></svg>
                    </button>
                    <button onClick={handleClose} disabled={!isUndocked && terminalState !== "maximized"} className={cn("flex h-7 w-7 items-center justify-center rounded transition-colors", !isUndocked && terminalState !== "maximized" ? "text-white/15" : "text-white/50 hover:bg-red-500/80 hover:text-white")} aria-label="Close">
                      <svg width="8" height="8" viewBox="0 0 8 8" stroke="currentColor" strokeWidth="1.2"><line x1="1" y1="1" x2="7" y2="7"/><line x1="7" y1="1" x2="1" y2="7"/></svg>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Windows — Win11 style */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-primary text-xs font-bold">{">"}_</span>
                    <span className="text-[13px] text-white/60 font-medium">Terminal</span>
                  </div>
                  <div className="flex items-center">
                    <button onClick={handleMinimize} disabled={terminalState === "minimized"} className={cn("flex h-8 w-11 items-center justify-center transition-colors", terminalState === "minimized" ? "text-white/15 cursor-not-allowed" : "text-white/50 hover:bg-white/10 hover:text-white/80")} aria-label="Minimize">
                      <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
                    </button>
                    <button onClick={handleMaximize} className="flex h-8 w-11 items-center justify-center text-white/50 transition-colors hover:bg-white/10 hover:text-white/80" aria-label="Maximize">
                      {terminalState === "maximized" ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2.5" y="0.5" width="7" height="7" rx="0.5"/><rect x="0.5" y="2.5" width="7" height="7" rx="0.5"/></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="9" height="9" rx="0.5"/></svg>
                      )}
                    </button>
                    <button onClick={handleClose} disabled={!isUndocked && terminalState !== "maximized"} className={cn("flex h-8 w-11 items-center justify-center rounded-tr-lg transition-colors", !isUndocked && terminalState !== "maximized" ? "text-white/15 cursor-not-allowed" : "text-white/50 hover:bg-red-500/90 hover:text-white")} aria-label="Close">
                      <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.2"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ── Terminal content ── */}
            {terminalState !== "minimized" && (
              <div className="relative" style={{
                height: terminalState === "maximized" ? "calc(100vh - 56px)" : `${terminalSize.height}px`,
              }}>
                <div
                  ref={terminalScrollRef}
                  onClick={(e) => {
                    const input = (e.currentTarget as HTMLElement).querySelector<HTMLInputElement>("[data-terminal-input]");
                    input?.focus();
                  }}
                  onScroll={() => {
                    const el = terminalScrollRef.current;
                    if (el) {
                      const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
                      const thumbH = Math.max(20, (el.clientHeight / el.scrollHeight) * el.clientHeight);
                      setScrollThumb({ ratio, thumbH, visible: el.scrollHeight > el.clientHeight });
                    }
                  }}
                  className="terminal-scroll h-full overflow-y-auto px-4 py-3"
                >
                  <InteractiveTerminal />
                </div>
                {/* Custom scrollbar */}
                {scrollThumb.visible && (
                  <div
                    className="group absolute top-1 bottom-1 right-0 z-10"
                    style={{ width: 14 }}
                    onMouseDown={(e) => {
                      // Click on track → jump scroll to that position
                      e.preventDefault();
                      const el = terminalScrollRef.current;
                      if (!el) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = (e.clientY - rect.top) / rect.height;
                      el.scrollTop = clickY * (el.scrollHeight - el.clientHeight);
                    }}
                  >
                    <div
                      className="absolute right-0.5 rounded-full bg-white/20 hover:bg-white/50 active:bg-white/60"
                      style={{
                        width: 3,
                        height: scrollThumb.thumbH,
                        top: `${scrollThumb.ratio * (100 - (scrollThumb.thumbH / (terminalScrollRef.current?.clientHeight || 1)) * 100)}%`,
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const el = terminalScrollRef.current;
                        if (!el) return;
                        const startY = e.clientY;
                        const startScroll = el.scrollTop;
                        const scrollRange = el.scrollHeight - el.clientHeight;
                        const trackH = el.clientHeight - scrollThumb.thumbH;
                        const thumb = e.currentTarget as HTMLElement;
                        thumb.style.width = "8px";
                        const onMove = (ev: MouseEvent) => {
                          const dy = ev.clientY - startY;
                          el.scrollTop = startScroll + (dy / trackH) * scrollRange;
                        };
                        const onUp = () => {
                          thumb.style.width = "3px";
                          document.removeEventListener("mousemove", onMove);
                          document.removeEventListener("mouseup", onUp);
                        };
                        document.addEventListener("mousemove", onMove);
                        document.addEventListener("mouseup", onUp);
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.width = "8px"; }}
                      onMouseLeave={(e) => { if (!(e.buttons & 1)) (e.target as HTMLElement).style.width = "3px"; }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Resize handles (all edges & corners) ── */}
            {terminalState === "normal" && (
              <>
                {/* Edges */}
                <div onMouseDown={handleResizeStart({ top: true })} className="absolute top-0 left-3 right-3 h-1 cursor-ns-resize" />
                <div onMouseDown={handleResizeStart({ bottom: true })} className="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize" />
                <div onMouseDown={handleResizeStart({ left: true })} className="absolute top-3 bottom-3 left-0 w-1 cursor-ew-resize" />
                <div onMouseDown={handleResizeStart({ right: true })} className="absolute top-3 bottom-3 right-0 w-1 cursor-ew-resize" />
                {/* Corners */}
                <div onMouseDown={handleResizeStart({ top: true, left: true })} className="absolute top-0 left-0 h-3 w-3 cursor-nwse-resize" />
                <div onMouseDown={handleResizeStart({ top: true, right: true })} className="absolute top-0 right-0 h-3 w-3 cursor-nesw-resize" />
                <div onMouseDown={handleResizeStart({ bottom: true, left: true })} className="absolute bottom-0 left-0 h-3 w-3 cursor-nesw-resize" />
                <div onMouseDown={handleResizeStart({ bottom: true, right: true })} className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize" />
              </>
            )}
          </Card>
        </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href={getDiscordInviteLink()}
            className={cn(buttonVariants({ size: "lg" }))}
            onClick={() => {
              posthog.capture("hero_cta_clicked", {
                cta_type: "primary",
                destination: "discord",
              });
              posthog.capture("discord_link_clicked", { section: "hero_cta" });
            }}
          >
            {t("HOME.HERO_CTA_PRIMARY")}
          </Link>
          <Link
            href="/resources"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            onClick={() =>
              posthog.capture("hero_cta_clicked", {
                cta_type: "secondary",
                destination: "resources",
              })
            }
          >
            {t("HOME.HERO_CTA_SECONDARY")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

