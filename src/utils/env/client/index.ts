import { Type as t } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { LANGUAGES, Locale } from "~/lib/i18n";
import { safeParse } from "~/utils/base";

const clientSchema = t.Object({
  HOST_URL: t.String({
    minLength: 1,
    error: "VITE_HOST_URL client environment variable is not set!",
  }),
  BOT_URL: t.String({
    minLength: 1,
    error: "BOT_URL client environment variable is not set!",
  }),
  GUILD_ID: t.String({
    minLength: 1,
    error: "GUILD_ID client environment variable is not set!",
  }),
  LANGUAGE_KEY: t.Union([t.Literal("lang"), t.String()], {
    error: "LANGUAGE_KEY client environment variable is not set!",
  }),
  LANGUAGES: t.Array(t.Union([t.Literal("de"), t.Literal("en")]), {
    minLength: 3,
    error: "LANGUAGES client environment variable is not set!",
  }),
});
const clientSchemaChecker = TypeCompiler.Compile(clientSchema);

const clientEnvResult = safeParse(clientSchemaChecker, {
  HOST_URL:
    import.meta.env.VITE_HOST_URL ??
    `http://localhost:${import.meta.env.VITE_PORT ?? 3000}`,
  BOT_URL: import.meta.env.VITE_BOT_URL ?? "https://bot.coding.global",
  GUILD_ID: import.meta.env.VITE_GUILD_ID ?? "693908458986143824",
  LANGUAGE_KEY: import.meta.env.VITE_LANGUAGE_KEY ?? "lang",
  LANGUAGES: (import.meta.env.VITE_LANGUAGES
    ? import.meta.env.VITE_LANGUAGES.split(",")
    : LANGUAGES) as Locale[],
});

if (!clientEnvResult.success) {
  const firstError = clientEnvResult.errors[0];
  if (firstError) {
    throw new Error(
      `Invalid client environment variable: ${firstError.message}`,
    );
  }
  throw new Error(`Invalid client environment validation failed`);
}

export const clientEnv = clientEnvResult.data;
