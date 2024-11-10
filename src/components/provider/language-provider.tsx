import {
  NullableTranslator,
  resolveTemplate,
  translator,
} from "@solid-primitives/i18n";
import { isServer } from "@tanstack/solid-query";
import {
  Accessor,
  JSX,
  createContext,
  createResource,
  createSignal,
  useContext,
} from "solid-js";
import { getCookie } from "vinxi/http";
import { Dictionary, Locale, baseLocale, fetchDictionary } from "~/lib/i18n";
import { parseCookie } from "~/utils/base";
import { clientEnv } from "~/utils/env/client";

export interface LanguageContextType {
  locale: Accessor<Locale>;
  setLocale: (locale: Locale) => void;
  t: NullableTranslator<Dictionary, string>;
}

export const LanguageContext = createContext<LanguageContextType>();

export function useLanguage() {
  return useContext(LanguageContext!)!;
}

function getServerLanguageCookie() {
  "use server";
  const cookieValue = getCookie(clientEnv.LANGUAGE_KEY);
  const locale = cookieValue || baseLocale;
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  return [
    `${clientEnv.LANGUAGE_KEY}=${locale}`,
    "path=/",
    `expires=${expires.toUTCString()}`,
    !import.meta.env.DEV && "secure",
  ]
    .filter(Boolean)
    .join("; ");
}

export default function LanguageProvider(props: { children: JSX.Element }) {
  const cookie = isServer ? getServerLanguageCookie() : document.cookie;
  const detectedLocale =
    (parseCookie(cookie, clientEnv.LANGUAGE_KEY) as Locale) || baseLocale;
  const [locale, setLocale] = createSignal<Locale>(detectedLocale);
  const [dict] = createResource(locale, fetchDictionary);

  const contextValue: LanguageContextType = {
    locale,
    setLocale,
    t: translator(dict, resolveTemplate),
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {props.children}
    </LanguageContext.Provider>
  );
}
