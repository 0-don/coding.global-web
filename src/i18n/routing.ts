import { redirect } from "elysia";
import { defineRouting } from "next-intl/routing";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps } from "react";
import { LOCALES } from "../lib/config/constants";

export type LinkHref = ComponentProps<typeof Link>["href"];
export type RoutePush = Parameters<ReturnType<typeof useRouter>["push"]>[0];
export type Redirect = Parameters<typeof redirect>[0];

export type ValidRoutes = LinkHref | RoutePush | Redirect;

export const pathnames = {
  "/": "/",
  "/auth/login": {
    de: "/auth/anmelden",
  },
  "/auth/register": {
    de: "/auth/registrieren",
  },
} as const;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "always",
  localeDetection: false,
  pathnames,
});
