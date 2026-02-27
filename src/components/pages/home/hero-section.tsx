/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDiscordWidget, useTopStatsQuery } from "@/hook/bot-hook";
import {
  useTerminalMembersQuery,
  useTerminalTopQuery,
} from "@/hook/terminal-hook";
import { cn } from "@/lib/utils";
import { getDiscordInviteLink } from "@/lib/utils/base";
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

function InteractiveTerminal() {
  const t = useTranslations();
  const [commands, setCommands] = useState<
    Array<{ command: string; output: string; id: number; isUser?: boolean }>
  >([]);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const cmdIdRef = useRef(0);

  const { data: widget } = useDiscordWidget();
  const { data: topStats } = useTopStatsQuery();
  const membersQuery = useTerminalMembersQuery();
  const topQuery = useTerminalTopQuery({ limit: 5 });

  const terminalCommands = [
    {
      command: "npm install coding.global",
      output:
        t("HOME.HERO_TERMINAL_OUTPUT_1") ||
        "✓ Installing community features...",
    },
    {
      command: "npm start learning",
      output:
        t("HOME.HERO_TERMINAL_OUTPUT_2") || "✓ Starting your coding journey...",
    },
    {
      command: "npm run connect",
      output:
        t("HOME.HERO_TERMINAL_OUTPUT_3") ||
        "✓ Connecting with developers worldwide...",
    },
  ];

  const memberCount = widget?.memberCount?.toLocaleString() ?? "...";
  const onlineCount = widget?.presenceCount?.toLocaleString() ?? "...";
  const totalMessages = topStats?.totalMessages?.toLocaleString() ?? "...";
  const voiceHours = topStats?.totalVoiceHours?.toLocaleString() ?? "...";
  const discordLink = getDiscordInviteLink();

  // Static commands (instant response)
  const staticCommands: Record<string, string> = {
    "/help":
      "Available commands:\n  /help    - Show this help message\n  /about   - Learn about coding.global\n  /stats   - Show member statistics\n  /discord - Get Discord invite link\n  /members - Show online members\n  /top     - Show top contributors\n  /search  - Search users (e.g. /search John)\n  /clear   - Clear terminal",
    "/about":
      "coding.global is a thriving community of developers!\nWe connect thousands of programmers worldwide to learn,\nshare knowledge, and build amazing projects together.",
    "/stats":
      `📊 Community Stats:\n  • ${memberCount} Members\n  • ${onlineCount} Online\n  • ${totalMessages} Messages\n  • ${voiceHours} Voice Hours`,
    "/usercount":
      `📊 Community Stats:\n  • ${memberCount} Members\n  • ${onlineCount} Online\n  • ${totalMessages} Messages\n  • ${voiceHours} Voice Hours`,
    "/discord":
      `Join our Discord: ${discordLink}\nConnect with developers from around the world!`,
    "/clear": "CLEAR_COMMAND",
  };

  // Async commands that fetch real API data
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
        return `👥 Member Stats:\n  • ${d.memberCount?.toLocaleString() ?? "?"} Total Members\n  • ${d.thirtyDaysCount?.toLocaleString() ?? "?"} joined last 30 days\n  • ${d.sevenDaysCount?.toLocaleString() ?? "?"} joined last 7 days\n  • ${d.oneDayCount?.toLocaleString() ?? "?"} joined today`;
      } catch {
        return "❌ Failed to fetch members. Try again later.";
      }
    },
    "/top": async () => {
      try {
        const data = await topQuery.fetch();
        if (!data) return "No data available.";
        let output = "🏆 Top Contributors:\n";
        const topData = data as {
          mostActiveMessageUsers?: Array<{ displayName?: string; count?: number }>;
          mostActiveVoiceUsers?: Array<{ displayName?: string; sum?: number }>;
          mostHelpfulUsers?: Array<{ displayName?: string; count?: number }>;
          totalMessages?: number;
          totalVoiceHours?: number;
        };
        if (topData.mostActiveMessageUsers?.length) {
          output += "\n  💬 Messages:\n";
          output += topData.mostActiveMessageUsers
            .slice(0, 5)
            .map(
              (u, i) =>
                `    ${i + 1}. ${u.displayName || "Unknown"} — ${u.count?.toLocaleString() || 0}`,
            )
            .join("\n");
        }
        if (topData.mostActiveVoiceUsers?.length) {
          output += "\n\n  🎙️ Voice:\n";
          output += topData.mostActiveVoiceUsers
            .slice(0, 5)
            .map(
              (u, i) =>
                `    ${i + 1}. ${u.displayName || "Unknown"} — ${Math.round(u.sum || 0)}h`,
            )
            .join("\n");
        }
        if (topData.mostHelpfulUsers?.length) {
          output += "\n\n  🤝 Helpers:\n";
          output += topData.mostHelpfulUsers
            .slice(0, 5)
            .map(
              (u, i) =>
                `    ${i + 1}. ${u.displayName || "Unknown"} — ${u.count || 0} helps`,
            )
            .join("\n");
        }
        if (topData.totalMessages || topData.totalVoiceHours) {
          output += `\n\n  📊 Total: ${topData.totalMessages?.toLocaleString() ?? "?"} messages, ${topData.totalVoiceHours?.toLocaleString() ?? "?"} voice hours`;
        }
        return output;
      } catch {
        return "❌ Failed to fetch top contributors. Try again later.";
      }
    },
    "/search": async (args: string) => {
      if (!args.trim()) return "Usage: /search <username>\nExample: /search Don";
      try {
        const data = await topQuery.fetch();
        if (!data) return "No data available to search.";
        const topData = data as {
          mostActiveMessageUsers?: Array<{ displayName?: string; username?: string; globalName?: string; id?: string; count?: number }>;
          mostActiveVoiceUsers?: Array<{ displayName?: string; username?: string; globalName?: string; id?: string; sum?: number }>;
          mostHelpfulUsers?: Array<{ displayName?: string; username?: string; globalName?: string; id?: string; count?: number }>;
        };
        const allUsers = [
          ...(topData.mostActiveMessageUsers || []),
          ...(topData.mostActiveVoiceUsers || []),
          ...(topData.mostHelpfulUsers || []),
        ];
        // Deduplicate by id
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
              `  • ${u.displayName || u.username || "Unknown"} (@${u.username || "?"})`,
          );
        return `🔍 Search results for "${args.trim()}":\n${lines.join("\n")}${results.length > 10 ? `\n  ... and ${results.length - 10} more` : ""}`;
      } catch {
        return "❌ Search failed. Try again later.";
      }
    },
  };

  useEffect(() => {
    if (currentCommand < terminalCommands.length) {
      const timeout = setTimeout(
        () => {
          setCommands((prev) => [
            ...prev,
            { ...terminalCommands[currentCommand], id: cmdIdRef.current++ },
          ]);
          setCurrentCommand((prev) => prev + 1);
        },
        currentCommand === 0 ? 500 : 2500,
      );

      return () => clearTimeout(timeout);
    } else if (currentCommand === terminalCommands.length && !isInteractive) {
      const timeout = setTimeout(() => {
        setIsInteractive(true);
        setCommands((prev) => [
          ...prev,
          {
            command: "",
            output: "✨ Terminal ready! Type /help to see available commands.",
            id: cmdIdRef.current++,
          },
        ]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentCommand, isInteractive]);

  // Auto-scroll terminal content to bottom (only internal scroll, won't affect page)
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
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

    // Parse command and args (e.g. "/search John" -> cmd="/search", args="John")
    const parts = trimmedCmd.split(/\s+/);
    const baseCmd = parts[0];
    const args = cmd.trim().slice(baseCmd.length).trim();

    posthog.capture("terminal_command_executed", {
      command: baseCmd,
      is_valid_command: !!(staticCommands[baseCmd] || asyncCommands[baseCmd]),
    });

    // Add user command to history
    setCommands((prev) => [
      ...prev,
      { command: cmd, output: "", id: cmdIdRef.current++, isUser: true },
    ]);
    setInputValue("");

    // Check static commands first
    if (staticCommands[baseCmd]) {
      if (baseCmd === "/clear") {
        setCommands([]);
        setTimeout(() => {
          setCommands([
            {
              command: "",
              output: "✨ Terminal cleared! Type /help to see available commands.",
              id: cmdIdRef.current++,
            },
          ]);
        }, 100);
        return;
      }
      setTimeout(() => addOutput(staticCommands[baseCmd]), 300);
      return;
    }

    // Check async commands
    if (asyncCommands[baseCmd]) {
      addOutput("⏳ Loading...");
      try {
        const result = await asyncCommands[baseCmd](args);
        // Replace the loading message with the result
        setCommands((prev) => {
          const loadingIdx = prev.findLastIndex((c) => c.output === "⏳ Loading...");
          if (loadingIdx !== -1) {
            const updated = [...prev];
            updated[loadingIdx] = { ...updated[loadingIdx], output: result };
            return updated;
          }
          return [...prev, { command: "", output: result, id: cmdIdRef.current++ }];
        });
      } catch {
        addOutput("❌ An error occurred. Try again later.");
      }
      return;
    }

    // Unknown command
    setTimeout(() => {
      addOutput(`Command not found: ${cmd}\nType /help to see available commands.`);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
    }
  };

  return (
    <div
      ref={terminalRef}
      className="scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent max-h-96 space-y-3 overflow-y-auto font-mono text-base"
    >
      {commands.map((cmd) => (
        <div key={cmd.id} className="space-y-2">
          {cmd.command && (
            <div className="flex items-center">
              <span className="mr-2 text-green-400">$</span>
              {cmd.isUser ? (
                <span>{cmd.command}</span>
              ) : (
                <TerminalTypewriter text={cmd.command} delay={30} />
              )}
            </div>
          )}
          {cmd.output && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: cmd.isUser ? 0 : 0.5 }}
              className="text-muted-foreground pl-5 text-sm whitespace-pre-line"
            >
              {cmd.output}
            </motion.div>
          )}
        </div>
      ))}
      {currentCommand < terminalCommands.length && commands.length > 0 && (
        <div className="flex items-center">
          <span className="mr-2 text-green-400">$</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            _
          </motion.span>
        </div>
      )}
      {isInteractive && (
        <div className="flex items-center">
          <span className="mr-2 text-green-400">$</span>
          <input
            ref={(el) => el?.focus({ preventScroll: true })}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            placeholder="Type /help for commands..."
          />
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-0.5"
          >
            |
          </motion.span>
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations();
  const [terminalState, setTerminalState] = useState<
    "normal" | "maximized" | "minimized" | "closed"
  >("normal");
  const [terminalSize, setTerminalSize] = useState({ width: 896, height: 500 }); // max-w-4xl = 896px
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const stateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to set terminal state after a delay, cancelling any pending timer
  const setStateWithDelay = (state: typeof terminalState, delayMs: number) => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    stateTimerRef.current = setTimeout(() => {
      setTerminalState(state);
      stateTimerRef.current = null;
    }, delayMs);
  };

  const handleClose = () => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setTerminalState("closed");
    setStateWithDelay("normal", 3000);
  };

  const handleMinimize = () => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setTerminalState("minimized");
    setStateWithDelay("normal", 2000);
  };

  const handleMaximize = () => {
    // Cancel any pending auto-restore timers (e.g. from minimize)
    if (stateTimerRef.current) {
      clearTimeout(stateTimerRef.current);
      stateTimerRef.current = null;
    }
    if (terminalState === "maximized") {
      setTerminalState("normal");
    } else {
      setTerminalState("maximized");
      // Reset to default size when maximizing
      setTerminalSize({ width: 896, height: 500 });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: terminalSize.width,
      height: terminalSize.height,
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      const newWidth = Math.max(
        400,
        Math.min(1400, resizeStartRef.current.width + deltaX),
      );
      const newHeight = Math.max(
        300,
        Math.min(800, resizeStartRef.current.height + deltaY),
      );

      setTerminalSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const getTerminalStyle = () => {
    if (terminalState === "maximized") {
      return { width: "100%", maxWidth: "100%" };
    }
    return { width: `${terminalSize.width}px`, maxWidth: "90vw" };
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        className="flex flex-col items-center gap-8 text-center"
      >
        {/* Main heading with gradient and typewriter effect */}
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

        {/* Interactive Terminal window with macOS-style buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: terminalState === "closed" ? 0 : 1,
            y: terminalState === "closed" ? 20 : 0,
            scale: terminalState === "minimized" ? 0.8 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={getTerminalStyle()}
          className="relative"
        >
          {terminalState !== "closed" && (
            <Card className="border-primary relative overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm">
              {/* Terminal header with macOS-style buttons */}
              <div className="bg-muted/30 border-border flex items-center justify-between border-b px-6 py-4">
                <div className="text-muted-foreground flex-1 text-center font-mono text-sm">
                  coding.global — terminal
                </div>
                <div className="flex items-center space-x-2.5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 transition-all hover:bg-red-600"
                    aria-label="Close"
                  >
                    <span className="text-[11px] leading-3 font-bold text-red-950">
                      ✕
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMinimize}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 transition-all hover:bg-yellow-600"
                    aria-label="Minimize"
                  >
                    <span className="text-[11px] leading-3 font-bold text-yellow-950">
                      −
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMaximize}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 transition-all hover:bg-green-600"
                    aria-label="Maximize"
                  >
                    <span className="text-[11px] leading-3 font-bold text-green-950">
                      +
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Terminal content */}
              {terminalState !== "minimized" && (
                <motion.div
                  initial={{ height: "auto" }}
                  animate={{ height: "auto" }}
                  style={{ height: `${terminalSize.height}px` }}
                  className="overflow-hidden p-8"
                >
                  <InteractiveTerminal />
                </motion.div>
              )}

              {/* Resize handle - bottom right corner */}
              {terminalState !== "minimized" &&
                terminalState !== "maximized" && (
                  <div
                    onMouseDown={handleResizeStart}
                    className="bg-muted/50 absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    }}
                  >
                    <div className="absolute right-0.5 bottom-0.5 flex flex-col gap-0.5">
                      <div className="bg-border h-px w-2 self-end" />
                      <div className="bg-border h-px w-2.5 self-end" />
                    </div>
                  </div>
                )}
            </Card>
          )}
        </motion.div>

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
