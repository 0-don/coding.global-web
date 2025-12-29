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
  "/news": {
    de: "/nachrichten",
  },
  "/rules": {
    de: "/regeln",
  },
  "/showcase": {
    de: "/showcase",
  },
  "/showcase/[id]": {
    de: "/showcase/[id]",
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
  "/team": {
    de: "/team",
  },
  "/resources": {
    de: "/ressourcen",
  },
  "/resources/javascript": {
    de: "/ressourcen/javascript",
  },
  "/resources/python": {
    de: "/ressourcen/python",
  },
  "/resources/vibe-coding": {
    de: "/ressourcen/vibe-coding",
  },
  "/resources/best-tools": {
    de: "/ressourcen/beste-tools",
  },
} as const;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "always",
  localeDetection: true,
  pathnames,
});
