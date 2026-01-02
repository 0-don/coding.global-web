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
} as const;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "always",
  localeDetection: true,
  pathnames,
});
