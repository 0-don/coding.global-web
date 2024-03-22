import { JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";
import TypesafeI18n from "~/i18n/i18n-solid";
import { Locales } from "~/i18n/i18n-types";
import { baseLocale } from "~/i18n/i18n-util";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";
import { parseCookie } from "~/utils";
import { clientEnv } from "~/utils/env/client";

function getLocale(): Locales {
  "use server";
  const cookieValue = isServer
    ? getCookie(clientEnv.LANGUAGE_KEY)
    : parseCookie(document.cookie, clientEnv.LANGUAGE_KEY);
  return (cookieValue as Locales) || baseLocale;
}

export default function LanguageProvider(props: { children: JSX.Element }) {
  const detectedLocale = getLocale();

  loadLocaleAsync(detectedLocale);

  return <TypesafeI18n locale={detectedLocale}>{props.children}</TypesafeI18n>;
}
