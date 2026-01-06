import { defineRouting } from "next-intl/routing";
import { ComponentProps } from "react";
import { LOCALES } from "../lib/config/constants";
import { getPathname, Link, redirect, useRouter } from "./navigation";

export type LinkHref = ComponentProps<typeof Link>["href"];
export type RoutePush = Parameters<ReturnType<typeof useRouter>["push"]>[0];
export type Redirect = Parameters<typeof redirect>[0];
export type Pathname = Parameters<typeof getPathname>[0]["href"];

export type ValidRoutes = LinkHref | RoutePush | Redirect;

export const pathnames = {
  "/": "/",
  "/chat": {
    de: "/chat",
  },
  "/community/news": {
    de: "/community/nachrichten",
  },
  "/community/rules": {
    de: "/community/regeln",
  },
  "/community/showcase": {
    de: "/community/showcase",
  },
  "/community/showcase/[id]": {
    de: "/community/showcase/[id]",
  },
  "/community/team": {
    de: "/community/team",
  },
  "/marketplace": {
    de: "/marketplace",
  },
  "/marketplace/job-board": {
    de: "/marketplace/job-board",
  },
  "/marketplace/dev-board": {
    de: "/marketplace/dev-board",
  },
  "/marketplace/[id]": {
    de: "/marketplace/[id]",
  },
  "/marketplace/job-board/[id]": {
    de: "/marketplace/job-board/[id]",
  },
  "/marketplace/dev-board/[id]": {
    de: "/marketplace/dev-board/[id]",
  },
  "/resources": {
    de: "/ressourcen",
  },
  "/resources/languages/javascript": {
    de: "/ressourcen/sprachen/javascript",
  },
  "/resources/languages/python": {
    de: "/ressourcen/sprachen/python",
  },
  "/resources/guides/vibe-coding": {
    de: "/ressourcen/anleitungen/vibe-coding",
  },
  "/resources/guides/cyber-security": {
    de: "/ressourcen/anleitungen/cyber-security",
  },
  // Coding language pages
  "/community/coding/javascript": {
    de: "/community/coding/javascript",
  },
  "/community/coding/javascript/[id]": {
    de: "/community/coding/javascript/[id]",
  },
  "/community/coding/python": {
    de: "/community/coding/python",
  },
  "/community/coding/python/[id]": {
    de: "/community/coding/python/[id]",
  },
  "/community/coding/rust": {
    de: "/community/coding/rust",
  },
  "/community/coding/rust/[id]": {
    de: "/community/coding/rust/[id]",
  },
  "/community/coding/cpp": {
    de: "/community/coding/cpp",
  },
  "/community/coding/cpp/[id]": {
    de: "/community/coding/cpp/[id]",
  },
  "/community/coding/csharp": {
    de: "/community/coding/csharp",
  },
  "/community/coding/csharp/[id]": {
    de: "/community/coding/csharp/[id]",
  },
  "/community/coding/c": {
    de: "/community/coding/c",
  },
  "/community/coding/c/[id]": {
    de: "/community/coding/c/[id]",
  },
  "/community/coding/go": {
    de: "/community/coding/go",
  },
  "/community/coding/go/[id]": {
    de: "/community/coding/go/[id]",
  },
  "/community/coding/java": {
    de: "/community/coding/java",
  },
  "/community/coding/java/[id]": {
    de: "/community/coding/java/[id]",
  },
  "/community/coding/kotlin": {
    de: "/community/coding/kotlin",
  },
  "/community/coding/kotlin/[id]": {
    de: "/community/coding/kotlin/[id]",
  },
  "/community/coding/dart": {
    de: "/community/coding/dart",
  },
  "/community/coding/dart/[id]": {
    de: "/community/coding/dart/[id]",
  },
  "/community/coding/lua": {
    de: "/community/coding/lua",
  },
  "/community/coding/lua/[id]": {
    de: "/community/coding/lua/[id]",
  },
  "/community/coding/php": {
    de: "/community/coding/php",
  },
  "/community/coding/php/[id]": {
    de: "/community/coding/php/[id]",
  },
  "/community/coding/html-css": {
    de: "/community/coding/html-css",
  },
  "/community/coding/html-css/[id]": {
    de: "/community/coding/html-css/[id]",
  },
  "/community/coding/sql": {
    de: "/community/coding/sql",
  },
  "/community/coding/sql/[id]": {
    de: "/community/coding/sql/[id]",
  },
  "/community/coding/swift": {
    de: "/community/coding/swift",
  },
  "/community/coding/swift/[id]": {
    de: "/community/coding/swift/[id]",
  },
  "/community/coding/bash-powershell": {
    de: "/community/coding/bash-powershell",
  },
  "/community/coding/bash-powershell/[id]": {
    de: "/community/coding/bash-powershell/[id]",
  },
  "/community/coding/visual-basic": {
    de: "/community/coding/visual-basic",
  },
  "/community/coding/visual-basic/[id]": {
    de: "/community/coding/visual-basic/[id]",
  },
  "/community/coding/zig": {
    de: "/community/coding/zig",
  },
  "/community/coding/zig/[id]": {
    de: "/community/coding/zig/[id]",
  },
  "/community/coding/other": {
    de: "/community/coding/other",
  },
  "/community/coding/other/[id]": {
    de: "/community/coding/other/[id]",
  },
} as const;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "always",
  localeDetection: true,
  pathnames,
});
