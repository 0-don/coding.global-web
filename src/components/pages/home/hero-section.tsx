/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getDiscordInviteLink } from "@/lib/utils/base";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function TypewriterText({
  text,
  delay = 50,
  loop = false,
  deleteDelay = 50,
  pauseTime = 2000,
}: {
  text: string;
  delay?: number;
  loop?: boolean;
  deleteDelay?: number;
  pauseTime?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!loop) {
      // Original behavior without looping
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, delay);
        return () => clearTimeout(timeout);
      }
      return;
    }

    // Looping behavior
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deleteDelay);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, delay);
        return () => clearTimeout(timeout);
      } else {
        setIsPaused(true);
      }
    }
  }, [
    currentIndex,
    text,
    delay,
    isDeleting,
    displayedText,
    loop,
    deleteDelay,
    pauseTime,
    isPaused,
  ]);

  const showCursor = loop || currentIndex < text.length;

  return (
    <span>
      {displayedText}
      {showCursor && (
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

  const availableCommands: Record<string, string> = {
    "/help":
      "Available commands:\n  /help - Show this help message\n  /about - Learn about coding.global\n  /usercount - Show member statistics\n  /discord - Get Discord invite link\n  /clear - Clear terminal",
    "/about":
      "coding.global is a thriving community of developers!\nWe connect thousands of programmers worldwide to learn,\nshare knowledge, and build amazing projects together.",
    "/usercount":
      "📊 Community Stats:\n  • 10,000+ Members\n  • 2,000+ Active Users\n  • 50,000+ Messages\n  • Growing daily!",
    "/discord":
      "Join our Discord: discord.gg/coding-global\nConnect with developers from around the world!",
    "/clear": "CLEAR_COMMAND",
  };

  useEffect(() => {
    if (currentCommand < terminalCommands.length) {
      const timeout = setTimeout(
        () => {
          setCommands((prev) => [
            ...prev,
            { ...terminalCommands[currentCommand], id: Date.now() },
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
            id: Date.now(),
          },
        ]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentCommand, isInteractive]);

  // Auto-scroll to bottom when commands change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (!trimmedCmd) return;

    // Add user command to history
    setCommands((prev) => [
      ...prev,
      { command: cmd, output: "", id: Date.now(), isUser: true },
    ]);

    // Process command
    if (availableCommands[trimmedCmd]) {
      if (trimmedCmd === "/clear") {
        setCommands([]);
        setTimeout(() => {
          setCommands([
            {
              command: "",
              output:
                "✨ Terminal cleared! Type /help to see available commands.",
              id: Date.now(),
            },
          ]);
        }, 100);
      } else {
        setTimeout(() => {
          setCommands((prev) => [
            ...prev,
            {
              command: "",
              output: availableCommands[trimmedCmd],
              id: Date.now(),
            },
          ]);
        }, 300);
      }
    } else {
      setTimeout(() => {
        setCommands((prev) => [
          ...prev,
          {
            command: "",
            output: `Command not found: ${cmd}\nType /help to see available commands.`,
            id: Date.now(),
          },
        ]);
      }, 300);
    }

    setInputValue("");
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
                <TypewriterText text={cmd.command} delay={30} />
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
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            placeholder="Type /help for commands..."
            autoFocus
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

  const handleClose = () => {
    setTerminalState("closed");
    setTimeout(() => {
      setTerminalState("normal");
    }, 3000);
  };

  const handleMinimize = () => {
    setTerminalState("minimized");
    setTimeout(() => {
      setTerminalState("normal");
    }, 2000);
  };

  const handleMaximize = () => {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="from-primary to-chart-2 bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
        >
          <TypewriterText
            text={t("HOME.HERO_TITLE")}
            delay={100}
            deleteDelay={50}
            pauseTime={3000}
            loop={true}
          />
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
          >
            {t("HOME.HERO_CTA_PRIMARY")}
          </Link>
          <Link
            href="/resources"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {t("HOME.HERO_CTA_SECONDARY")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
