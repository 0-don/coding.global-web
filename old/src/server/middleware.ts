import { authMiddleware } from "@solid-mediakit/auth";
import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie, setCookie } from "vinxi/http";
import { Locale } from "~/lib/i18n";
import { clientEnv } from "~/utils/env/client";
import { acceptLanguageHeader } from "~/utils/server";
import { authOptions } from "./auth/auth-options";

export default createMiddleware({
  onRequest: [
    authMiddleware(true, authOptions),
    (event) => {
      const url = new URL(event.request.url);

      if (url.pathname.includes("/api")) return;

      const pathSegments = url.pathname.split("/").filter(Boolean);
      const potentialLocale = pathSegments[0] as Locale;
      const currentLocale = getCookie(
        event.nativeEvent,
        clientEnv.LANGUAGE_KEY,
      ) as Locale;

      let newLocale: Locale | undefined;

      if (potentialLocale && clientEnv.LANGUAGES.includes(potentialLocale)) {
        // Priority 1: Use URL locale if valid
        newLocale = potentialLocale;
      } else if (!currentLocale) {
        // Priority 2: If no cookie exists, use Accept-Language or default
        const acceptedLanguage = acceptLanguageHeader(event.nativeEvent);
        newLocale = acceptedLanguage || clientEnv.LANGUAGES[0];
      }

      // Only set cookie if we have a new locale that's different from current
      if (newLocale && newLocale !== currentLocale) {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        setCookie(clientEnv.LANGUAGE_KEY, newLocale, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          expires: expirationDate,
        });
      }
    },
  ],
});
