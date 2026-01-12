import { ProgrammingThreadType } from "@/lib/types";
import { GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType } from "@/openapi";

const NON_PROGRAMMING_TYPES: GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType[] =
  ["job-board", "dev-board", "showcase"] as const;

export const PROGRAMMING_LANGUAGES = Object.keys(
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
).filter(
  (type) =>
    !NON_PROGRAMMING_TYPES.includes(
      type as (typeof NON_PROGRAMMING_TYPES)[number],
    ),
) as ProgrammingThreadType[];

export function isValidLanguage(lang: string): lang is ProgrammingThreadType {
  return PROGRAMMING_LANGUAGES.includes(lang as ProgrammingThreadType);
}

export function languageToTranslationKey<T extends string>(
  language: T,
): Uppercase<T> {
  return language.toUpperCase() as Uppercase<T>;
}
