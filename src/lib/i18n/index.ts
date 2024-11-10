import { type Flatten, flatten } from "@solid-primitives/i18n";
import { clientEnv } from "~/utils/env/client";
import type * as de from "./de.json";

export type RawDictionary = typeof de;
export type Locale = (typeof clientEnv)["LANGUAGES"][number];
export type Dictionary = Flatten<RawDictionary>;
export type DictionaryKey = {
  [K in keyof Dictionary]: Dictionary[K] extends string ? K : never;
}[keyof Dictionary];


export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = await import(`./${locale}.json?import`);
  return flatten(dict);
}

export const msg = (key: DictionaryKey) => key;
