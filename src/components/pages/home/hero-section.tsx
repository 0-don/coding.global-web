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
import { createPortal } from "react-dom";


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
  "/logout",
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
    ? `  {{cyan:/top}}      {{white:— Top contributors}}\n  {{cyan:/members}}  {{white:— Member stats}}\n  {{cyan:/me}}       {{white:— Your profile}}\n  {{cyan:/logout}}   {{white:— Sign out}}\n\n{{green:Logged in as}} {{cyan:${discordUsername || "User"}}}. Type {{cyan:/help}} for all commands.`
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
    "/help": isLoggedIn
      ? "{{yellow:Available commands:}}\n  {{cyan:/help}}    — Show this help message\n  {{cyan:/about}}   — Learn about coding.global\n  {{cyan:/stats}}   — Show member statistics\n  {{cyan:/discord}} — Get Discord invite link\n  {{cyan:/members}} — Show member join stats\n  {{cyan:/top}}     — Show top contributors\n  {{cyan:/search}}  — Search users (e.g. /search Don)\n  {{cyan:/me}}      — Show your profile\n  {{cyan:/logout}}  — Sign out\n  {{cyan:/os}}      — Show your system info\n  {{cyan:/clear}}   — Clear terminal"
      : "{{yellow:Available commands:}}\n  {{cyan:/help}}    — Show this help message\n  {{cyan:/about}}   — Learn about coding.global\n  {{cyan:/stats}}   — Show member statistics\n  {{cyan:/discord}} — Get Discord invite link\n  {{cyan:/members}} — Show member join stats\n  {{cyan:/top}}     — Show top contributors\n  {{cyan:/search}}  — Search users (e.g. /search Don)\n  {{cyan:/login}}   — Login with Discord\n  {{cyan:/me}}      — Show your profile\n  {{cyan:/os}}      — Show your system info\n  {{cyan:/clear}}   — Clear terminal",
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
      ? `{{green:Already logged in as}} {{cyan:${discordUsername || "User"}}}\nType {{cyan:/me}} to view your profile or {{cyan:/logout}} to sign out.`
      : "LOGIN_COMMAND",
    "/logout": isLoggedIn
      ? "LOGOUT_COMMAND"
      : "{{red:Not logged in.}} Type {{cyan:/login}} to login with Discord.",
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
      if (staticCommands[baseCmd] === "LOGOUT_COMMAND") {
        addOutput("{{yellow:Signing out...}}");
        setTimeout(() => {
          authClient.signOut();
        }, 500);
        return;
      }
      if (staticCommands[baseCmd] === "ME_ASYNC") {
        addOutput(LOADING_MARKER);
        try {
          const discordId = (session?.data?.user as Record<string, unknown>)?.discordId as string | undefined;
          const userName = session?.data?.user?.name || "User";
          const userEmail = session?.data?.user?.email || "—";
          const statsData = await handleElysia(await rpc.api.terminal.users.post({ userIds: [discordId!] }));
          const s = (statsData as Array<{
            stats?: {
              messages?: { total?: number; last7Days?: number; last24Hours?: number };
              voice?: { totalHours?: number; last7DaysHours?: number; last24HoursHours?: number };
              help?: { given?: number; received?: number };
              lastActivity?: { lastVoice?: string; lastMessage?: string };
            };
          }>)?.[0]?.stats;
          let output = `{{yellow:Your Profile:}}\n  {{cyan:Name}}      {{white:${userName}}}\n  {{cyan:Email}}     {{white:${userEmail}}}`;
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
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const [isNearDock, setIsNearDock] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Custom scrollbar
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const [scrollThumb, setScrollThumb] = useState({ ratio: 0, thumbH: 0, visible: false });

  // ── Desktop shortcut state (Windows 11 style) ──
  const [isTerminalClosed, setIsTerminalClosed] = useState(false);
  const [shortcutPos, setShortcutPos] = useState({ x: 0, y: 0 }); // relative to container
  const [shortcutLabel, setShortcutLabel] = useState("Terminal");
  const [isShortcutSelected, setIsShortcutSelected] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isDraggingShortcut, setIsDraggingShortcut] = useState(false);
  const shortcutDragRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const shortcutClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shortcutLabelInputRef = useRef<HTMLTextAreaElement>(null);
  const [editLabelValue, setEditLabelValue] = useState("Terminal");

  // ── Windows 11 Context Menu (right-click) state ──
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextMenuRef = useRef<HTMLElement>(null);

  // Terminal is undocked when it has been dragged away
  const isUndocked = terminalPos.x !== 0 || terminalPos.y !== 0;

  // ── Close: fully close terminal → show desktop shortcut ──
  const handleClose = () => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setIsTerminalClosed(true);
    setTerminalState("normal");
    setTerminalPos({ ...ORIGIN_POS });
    setTerminalSize({ ...ORIGIN_SIZE });
    setIsShortcutSelected(false);
    setIsEditingLabel(false);
  };

  // ── Open terminal from shortcut ──
  const handleOpenFromShortcut = () => {
    setIsTerminalClosed(false);
    setTerminalState("normal");
    setTerminalSize({ ...ORIGIN_SIZE });
    setTerminalPos({ ...ORIGIN_POS });
    setIsShortcutSelected(false);
    setIsEditingLabel(false);
  };

  // ── Shortcut drag logic (threshold + scroll tracking + boundary clamp) ──
  const handleShortcutDragStart = (e: React.MouseEvent) => {
    if (isEditingLabel) return;
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = shortcutPos.x;
    const startPosY = shortcutPos.y;
    const startScrollY = window.scrollY;
    let dragging = false;
    const DRAG_THRESHOLD = 3;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY + (window.scrollY - startScrollY);
      if (!dragging) {
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          dragging = true;
          setIsDraggingShortcut(true);
        }
        return;
      }
      // Clamp to viewport bounds (not the small container)
      const btnW = 70, btnH = 80; // approx shortcut size
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // The shortcut is centered in the container, so newX/newY are offsets from center
      const container = terminalContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const newAbsX = centerX + startPosX + dx;
        const newAbsY = centerY + startPosY + dy;
        // Clamp so the shortcut stays within viewport
        const clampedAbsX = Math.max(btnW / 2, Math.min(vw - btnW / 2, newAbsX));
        const clampedAbsY = Math.max(56, Math.min(vh - btnH / 2, newAbsY)); // 56 = below navbar
        setShortcutPos({
          x: clampedAbsX - centerX,
          y: clampedAbsY - centerY,
        });
      } else {
        setShortcutPos({ x: startPosX + dx, y: startPosY + dy });
      }
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (dragging) setIsDraggingShortcut(false);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // ── Shortcut click logic (select / rename) ──
  const handleShortcutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isShortcutSelected) {
      setIsShortcutSelected(true);
      return;
    }
    // Already selected → start rename timer (slow double-click like Windows)
    if (!isEditingLabel) {
      if (shortcutClickTimer.current) clearTimeout(shortcutClickTimer.current);
      shortcutClickTimer.current = setTimeout(() => {
        setIsEditingLabel(true);
        setEditLabelValue(shortcutLabel);
      }, 500);
    }
  };

  const handleShortcutDoubleClick = () => {
    if (shortcutClickTimer.current) clearTimeout(shortcutClickTimer.current);
    handleOpenFromShortcut();
  };

  const confirmRename = () => {
    const trimmed = editLabelValue.trim();
    if (trimmed) setShortcutLabel(trimmed);
    setIsEditingLabel(false);
  };

  const cancelRename = () => {
    setIsEditingLabel(false);
    setEditLabelValue(shortcutLabel);
  };

  // Focus rename textarea when editing starts (1:1 daedalOS RenameBox: focus + setSelectionRange)
  useEffect(() => {
    if (isEditingLabel && shortcutLabelInputRef.current) {
      shortcutLabelInputRef.current.focus();
      shortcutLabelInputRef.current.setSelectionRange(0, shortcutLabel.length);
    }
  }, [isEditingLabel]);

  // Deselect shortcut & close context menu when clicking outside
  useEffect(() => {
    if (!isShortcutSelected && !isEditingLabel && !contextMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Close context menu if clicking outside it
      if (contextMenu && contextMenuRef.current && !contextMenuRef.current.contains(target)) {
        setContextMenu(null);
      }
      if (!target.closest('[data-desktop-shortcut]') && !target.closest('[data-context-menu]')) {
        if (isEditingLabel) confirmRename();
        setIsShortcutSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShortcutSelected, isEditingLabel, contextMenu]);

  // Close context menu on Escape (1:1 daedalOS)
  useEffect(() => {
    if (!contextMenu) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };
    window.addEventListener("keydown", onEscape, { passive: true });
    return () => window.removeEventListener("keydown", onEscape);
  }, [contextMenu]);

  // Handle right-click anywhere in shortcut container (1:1 daedalOS)
  const handleShortcutContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShortcutSelected(true);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Context menu actions
  const handleContextMenuOpen = () => {
    setContextMenu(null);
    handleOpenFromShortcut();
  };

  const handleContextMenuRename = () => {
    setContextMenu(null);
    setIsEditingLabel(true);
    setEditLabelValue(shortcutLabel);
  };

  // Properties dialog state
  const [showProperties, setShowProperties] = useState<{ x: number; y: number } | null>(null);
  const handleContextMenuProperties = () => {
    const pos = contextMenu;
    setContextMenu(null);
    if (pos) setShowProperties({ x: pos.x, y: pos.y });
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
        // Coords are already viewport coords since we use position: fixed when undocked
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
      const clampedY = Math.max(48, Math.min(window.innerHeight - 44, rawY)); // 48 = navbar height
      setTerminalPos({ x: clampedX, y: clampedY });
      setIsNearEdge(terminalState !== "minimized" && (y <= 48 || x <= 10 || x >= window.innerWidth - 10));
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
      // Keep viewport coords as-is since undocked terminal uses position: fixed
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
      const maxH = window.innerHeight - 60; // navbar height (~48px) + padding
      if (d.bottom) newH = Math.max(250, Math.min(maxH, resizeStartRef.current.height + dy));
      if (d.top) {
        newH = Math.max(250, Math.min(maxH, resizeStartRef.current.height - dy));
        newY = Math.max(48, resizeStartRef.current.posY + (resizeStartRef.current.height - newH)); // don't go above navbar
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
    // When dragged away from origin — always fixed so it's not clipped by the hero section
    if (terminalPos.x !== 0 || terminalPos.y !== 0) {
      return {
        position: "fixed" as const,
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
          ref={terminalContainerRef}
          className="relative"
          style={{
            width: `${terminalSize.width}px`,
            maxWidth: "95vw",
            height: isTerminalClosed
              ? 120
              : terminalState === "minimized"
                ? 44
                : `${terminalSize.height + 44}px`,
          }}
        >
          {/* ── Windows 11 Desktop Shortcut (1:1 daedalOS) ── */}
          {isTerminalClosed && (
            <div
              data-desktop-shortcut
              className="absolute flex items-center justify-center"
              style={{ inset: 0, zIndex: 9999 }}
              onContextMenu={handleShortcutContextMenu}
            >
              {/* daedalOS: StyledFileEntry (Icon view) + Button + StyledFigure */}
              <button
                data-shortcut-icon
                type="button"
                className="relative flex cursor-default flex-col items-center outline-none select-none"
                style={{
                  transform: `translate(${shortcutPos.x}px, ${shortcutPos.y}px)`,
                  ...(isDraggingShortcut && { pointerEvents: "none" as const, opacity: 0.7 }),
                  /* StyledFileEntry: padding */
                  padding: "6px 8px",
                  /* StyledFileEntry: outline-offset: -2px */
                  outlineOffset: -2,
                  /* colors.ts: fileEntry states — applied via data attributes */
                  backgroundColor: isShortcutSelected
                    ? "hsla(207, 60%, 72%, 35%)"  /* backgroundFocused */
                    : undefined,
                  outline: isShortcutSelected
                    ? "1px solid hsla(207, 60%, 72%, 35%)" /* borderFocused */
                    : undefined,
                }}
                /* daedalOS StyledFileEntry: &:hover */
                onMouseEnter={(e) => {
                  if (!isShortcutSelected) {
                    e.currentTarget.style.backgroundColor = "hsla(207, 30%, 72%, 25%)"; /* background */
                    e.currentTarget.style.outline = "1px solid hsla(207, 30%, 72%, 30%)"; /* border */
                  } else {
                    e.currentTarget.style.backgroundColor = "hsla(207, 90%, 72%, 30%)"; /* backgroundFocusedHover */
                    e.currentTarget.style.outline = "1px solid hsla(207, 90%, 72%, 40%)"; /* borderFocusedHover */
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isShortcutSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.outline = "none";
                  } else {
                    e.currentTarget.style.backgroundColor = "hsla(207, 60%, 72%, 35%)";
                    e.currentTarget.style.outline = "1px solid hsla(207, 60%, 72%, 35%)";
                  }
                }}
                onMouseDown={handleShortcutDragStart}
                onClick={handleShortcutClick}
                onDoubleClick={handleShortcutDoubleClick}
                onContextMenu={handleShortcutContextMenu}
                onKeyDown={(e) => {
                  if (e.key === "F2" && isShortcutSelected && !isEditingLabel) {
                    e.preventDefault();
                    setIsEditingLabel(true);
                    setEditLabelValue(shortcutLabel);
                  }
                  if (e.key === "Enter" && !isEditingLabel) {
                    handleOpenFromShortcut();
                  }
                }}
              >
                {/* StyledFigure: figure > flex column, place-items center, margin-bottom -2px */}
                <figure
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    margin: 0,
                    marginBottom: -2,
                    pointerEvents: isEditingLabel ? "all" : undefined,
                  }}
                >
                  {/* daedalOS: Icon picture { height/width: 48px } */}
                  <picture style={{ height: 48, width: 48, position: "relative" }}>
                    <img
                      src="/images/terminal-icon.png"
                      alt="Terminal"
                      style={{ width: 48, height: 48 }}
                      draggable={false}
                    />
                    {/* SubIcons — shortcut arrow overlay */}
                    <svg
                      style={{ position: "absolute", bottom: -2, left: -2 }}
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <rect x="1" y="1" width="14" height="14" rx="2" fill="white" />
                      <path d="M4 12V4l8 4-8 4z" fill="#2d7dd2" stroke="#1a5fa3" strokeWidth="0.5" />
                    </svg>
                  </picture>

                  {/* StyledFileEntry: figcaption or RenameBox */}
                  {isEditingLabel ? (
                    <textarea
                      ref={shortcutLabelInputRef}
                      defaultValue={shortcutLabel}
                      rows={1}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (e.target as HTMLTextAreaElement).value.trim();
                          if (val) setShortcutLabel(val);
                          setIsEditingLabel(false);
                        }
                        if (e.key === "Escape") cancelRename();
                      }}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val) setShortcutLabel(val);
                        setIsEditingLabel(false);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onDoubleClick={(e) => e.stopPropagation()}
                      onDragStart={(e) => e.preventDefault()}
                      style={{
                        /* StyledFileEntry: textarea { position: absolute; top: 48px } */
                        position: "absolute",
                        top: 48,
                        backgroundColor: "rgb(33, 33, 33)",
                        border: "1px solid #fff",
                        borderRadius: 0,
                        color: "#fff",
                        fontFamily: "inherit",
                        fontSize: "11.5px",
                        marginBottom: 2,
                        minHeight: 19,
                        minWidth: 30,
                        overflow: "hidden",
                        padding: "1px 5px",
                        resize: "none",
                        textAlign: "center",
                        userSelect: "text",
                        whiteSpace: "break-spaces",
                        zIndex: 1,
                        outline: "none",
                        width: 70,
                      }}
                    />
                  ) : (
                    /* StyledFileEntry figcaption: color, fontSize, textShadow from colors.ts */
                    <figcaption
                      style={{
                        pointerEvents: "none",
                        color: "#FFF",
                        fontSize: "11.5px",
                        lineHeight: 1.2,
                        margin: "1px 0",
                        overflowWrap: "anywhere",
                        padding: "2px 0",
                        textAlign: "center",
                        /* colors.ts: fileEntry.textShadow (exact) */
                        textShadow: `0 0 1px rgba(0, 0, 0, 75%),
                          0 0 2px rgba(0, 0, 0, 50%),
                          0 1px 1px rgba(0, 0, 0, 75%),
                          0 1px 2px rgba(0, 0, 0, 50%),
                          0 2px 1px rgba(0, 0, 0, 75%),
                          0 2px 2px rgba(0, 0, 0, 50%)`,
                      }}
                    >
                      {shortcutLabel}
                    </figcaption>
                  )}
                </figure>
              </button>

              {/* Context Menu — rendered via portal to fix positioning */}
              {contextMenu && createPortal(
                <nav
                  ref={contextMenuRef}
                  data-context-menu
                  className="fixed z-[10000]"
                  style={{
                    left: contextMenu.x,
                    top: contextMenu.y,
                    /* StyledMenu.ts */
                    backgroundColor: "rgb(43 43 43)",
                    border: "1px solid rgb(160 160 160)",
                    boxShadow: "1px 1px 1px hsl(0 0% 20% / 70%), 2px 2px 2px hsl(0 0% 10% / 70%)",
                    color: "rgb(255 255 255)",
                    contain: "layout",
                    fontSize: 12,
                    maxHeight: "fit-content",
                    maxWidth: "fit-content",
                    padding: "4px 2px",
                    pointerEvents: "none",
                    width: "max-content",
                  }}
                >
                  <ol style={{ listStyle: "none", margin: 0, padding: 0, pointerEvents: "all" }}>
                    {/* ── Open (primary/bold) ── */}
                    <li>
                      <div
                        role="button"
                        tabIndex={-1}
                        onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); handleContextMenuOpen(); }}
                        style={{ display: "flex", padding: "3px 0", cursor: "default" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgb(65 65 65)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        <picture style={{ margin: "0 -24px 0 8px", display: "flex", alignItems: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3l5 5-5 5" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </picture>
                        <figcaption
                          style={{
                            display: "flex", height: 16, lineHeight: "16px",
                            marginLeft: 32, marginRight: 64, placeItems: "center",
                            position: "relative", top: -1, whiteSpace: "nowrap", width: "max-content",
                            fontWeight: 700,
                          }}
                        >
                          Open
                        </figcaption>
                      </div>
                    </li>

                    <li><hr style={{ backgroundColor: "rgb(128 128 128)", height: 1, margin: "3px 8px", border: "none" }} /></li>

                    {/* ── Rename ── */}
                    <li>
                      <div
                        role="button"
                        tabIndex={-1}
                        onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); handleContextMenuRename(); }}
                        style={{ display: "flex", padding: "3px 0", cursor: "default" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgb(65 65 65)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        <picture style={{ margin: "0 -24px 0 8px", display: "flex", alignItems: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.498 2.002a1.75 1.75 0 0 1 2.474 0l.026.026a1.75 1.75 0 0 1 0 2.474l-7.07 7.07a1 1 0 0 1-.442.261l-2.822.94a.5.5 0 0 1-.632-.632l.94-2.822a1 1 0 0 1 .261-.442l7.265-6.875z" fill="#fff" />
                          </svg>
                        </picture>
                        <figcaption
                          style={{
                            display: "flex", height: 16, lineHeight: "16px",
                            marginLeft: 32, marginRight: 64, placeItems: "center",
                            position: "relative", top: -1, whiteSpace: "nowrap", width: "max-content",
                          }}
                        >
                          Rename
                        </figcaption>
                      </div>
                    </li>

                    <li><hr style={{ backgroundColor: "rgb(128 128 128)", height: 1, margin: "3px 8px", border: "none" }} /></li>

                    {/* ── Properties ── */}
                    <li>
                      <div
                        role="button"
                        tabIndex={-1}
                        onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); handleContextMenuProperties(); }}
                        style={{ display: "flex", padding: "3px 0", cursor: "default" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgb(65 65 65)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                      >
                        <picture style={{ margin: "0 -24px 0 8px", display: "flex", alignItems: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="4.5" r="1.5" fill="#fff" />
                            <rect x="7" y="7" width="2" height="5" rx="1" fill="#fff" />
                          </svg>
                        </picture>
                        <figcaption
                          style={{
                            display: "flex", height: 16, lineHeight: "16px",
                            marginLeft: 32, marginRight: 64, placeItems: "center",
                            position: "relative", top: -1, whiteSpace: "nowrap", width: "max-content",
                          }}
                        >
                          Properties
                        </figcaption>
                      </div>
                    </li>
                  </ol>
                </nav>,
                document.body
              )}

              {/* Properties dialog — rendered via portal */}
              {showProperties && createPortal(
                <div
                  className="fixed inset-0 z-[10001]"
                  onMouseDown={() => setShowProperties(null)}
                >
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      position: "fixed",
                      left: showProperties.x,
                      top: showProperties.y,
                      backgroundColor: "rgb(43 43 43)",
                      border: "1px solid rgb(160 160 160)",
                      boxShadow: "1px 1px 1px hsl(0 0% 20% / 70%), 2px 2px 2px hsl(0 0% 10% / 70%)",
                      color: "rgb(255 255 255)",
                      fontSize: 12,
                      padding: "16px 20px",
                      minWidth: 280,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <img src="/images/terminal-icon.png" alt="Terminal" style={{ width: 32, height: 32 }} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{shortcutLabel}</span>
                    </div>
                    <hr style={{ backgroundColor: "rgb(128 128 128)", height: 1, margin: "8px 0", border: "none" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgb(170 170 170)" }}>Type:</span>
                        <span>Shortcut</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgb(170 170 170)" }}>Target:</span>
                        <span>Terminal</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgb(170 170 170)" }}>Location:</span>
                        <span>Desktop</span>
                      </div>
                    </div>
                    <hr style={{ backgroundColor: "rgb(128 128 128)", height: 1, margin: "12px 0 8px", border: "none" }} />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setShowProperties(null)}
                        style={{
                          backgroundColor: "rgb(55 55 55)",
                          border: "1px solid rgb(160 160 160)",
                          color: "#fff",
                          padding: "4px 20px",
                          fontSize: 12,
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgb(70 70 70)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgb(55 55 55)"; }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          )}

          {/* Dock Zone — visible when terminal is undocked */}
          {!isTerminalClosed && (
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
          )}

          {/* Terminal Window */}
          {!isTerminalClosed && (
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
                    <button onClick={handleClose} className="flex h-7 w-7 items-center justify-center rounded transition-colors text-white/50 hover:bg-red-500/80 hover:text-white" aria-label="Close">
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
                    <button onClick={handleClose} className="flex h-8 w-11 items-center justify-center rounded-tr-lg transition-colors text-white/50 hover:bg-red-500/90 hover:text-white" aria-label="Close">
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
                    // Don't focus input if user is selecting text
                    const sel = window.getSelection();
                    if (sel && sel.toString().length > 0) return;
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
        )}
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

