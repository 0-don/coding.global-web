import { Flatten, flatten } from "@solid-primitives/i18n";
import { clientEnv } from "~/utils/env/client";
import type * as de from "./de.json";

export type RawDictionary = typeof de;
export type Locale = (typeof clientEnv)["LANGUAGES"][number];

// Helper type to get all possible paths that lead to string values
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DottedKeys<T> = (
  T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DottedKeys<T[K]>>}` }[Exclude<keyof T, symbol>] :
    ""
) extends infer D ? Extract<D, string> : never;

// Create a type that maps all possible paths to string
export type Dictionary = {
  [K in DottedKeys<RawDictionary>]: string;
};

export const baseLocale: Locale = clientEnv.LANGUAGES[0];

export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = await import(`./${locale}.json?import`);
  return flatten(dict);
}

export const msg = (key: keyof Dictionary) => key;
