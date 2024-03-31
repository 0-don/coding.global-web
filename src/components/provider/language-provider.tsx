import { JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";
import TypesafeI18n from "~/i18n/i18n-solid";
import { Locales } from "~/i18n/i18n-types";
import { baseLocale } from "~/i18n/i18n-util";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";
import { parseCookie } from "~/utils";
import { clientEnv } from "~/utils/env/client";

function getServerLanguageCookie() {
  "use server";
  const cookieValue = getCookie(clientEnv.LANGUAGE_KEY);

  return cookieValue
    ? `${clientEnv.LANGUAGE_KEY}=${cookieValue}`
    : `${clientEnv.LANGUAGE_KEY}=${baseLocale}`;
}

export default function LanguageProvider(props: { children: JSX.Element }) {
  const cookie = isServer ? getServerLanguageCookie() : document.cookie;
  const detectedLocale =
    (parseCookie(cookie, clientEnv.LANGUAGE_KEY) as Locales) || baseLocale;

  loadLocaleAsync(detectedLocale);

  return <TypesafeI18n locale={detectedLocale}>{props.children}</TypesafeI18n>;
}
