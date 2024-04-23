import { Flatten, flatten } from "@solid-primitives/i18n";
import type { clientEnv } from "~/utils/env/client";
import type * as de from "./de/index.ts";

export const baseLocale: Locale = "de";

export type RawDictionary = typeof de["default"];
export type Locale = (typeof clientEnv)["LANGUAGES"][number];
export type Dictionary = Flatten<RawDictionary>;

export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`./${locale}/index.ts`)).default;
  return flatten(dict);
}
