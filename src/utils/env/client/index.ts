import { Elysia, t } from "elysia";

const {
  models: { clientSchema },
} = new Elysia().model({
  clientSchema: t.Object({
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
  }),
});

const clientEnvResult = clientSchema.safeParse({
  HOST_URL:
    import.meta.env.VITE_HOST_URL ??
    `http://localhost:${import.meta.env.VITE_PORT ?? 3000}`,
  BOT_URL: import.meta.env.VITE_BOT_URL ?? "https://bot.coding.global",
  GUILD_ID: import.meta.env.VITE_GUILD_ID ?? "693908458986143824",
  LANGUAGE_KEY: import.meta.env.VITE_LANGUAGE_KEY ?? "lang",
  LANGUAGES: import.meta.env.VITE_LANGUAGES
    ? import.meta.env.VITE_LANGUAGES.split(",")
    : ["de", "en"],
});

if (!clientEnvResult.data) {
  const firstError = clientEnvResult.errors[0];
  if (firstError)
    throw new Error(
      `Invalid client environment variable ${firstError.path.slice(1)}: ${firstError.summary.replaceAll("  ", " ")}`,
    );
  else throw new Error(`Invalid client environment ${clientEnvResult.error}`);
}

export const clientEnv = clientEnvResult.data;
