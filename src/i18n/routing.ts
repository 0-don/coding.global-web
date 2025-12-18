import { defineRouting } from "next-intl/routing";
import { ComponentProps } from "react";
import { LOCALES } from "../lib/config/constants";
import { Link, redirect, useRouter } from "./navigation";

export type LinkHref = ComponentProps<typeof Link>["href"];
export type RoutePush = Parameters<ReturnType<typeof useRouter>["push"]>[0];
export type Redirect = Parameters<typeof redirect>[0];

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
  "/team": {
    de: "/team",
  },
} as const;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "always",
  localeDetection: true,
  pathnames,
});
