import { Elysia, t } from "elysia";

const {
  models: { serverSchema },
} = new Elysia().model({
  serverSchema: t.Object({
    NODE_ENV: t.Union(
      [t.Literal("development"), t.Literal("production"), t.Literal("test")],
      {
        minLength: 3,
        error: "NODE_ENV server environment variable is not set!",
        default: "development",
      },
    ),
    DATABASE_URL: t.String({
      minLength: 1,
      error: "DATABASE_URL server environment variable is not set!",
    }),
    STAFF_MEMERS_URL: t.String({
      minLength: 1,
      error: "STAFF_MEMERS_URL client environment variable is not set!",
    }),
    DISCORD_CLIENT_ID: t.String({
      minLength: 1,
      error: "DISCORD_CLIENT_ID server environment variable is not set!",
    }),
    DISCORD_CLIENT_SECRET: t.String({
      minLength: 1,
      error: "DISCORD_CLIENT_SECRET server environment variable is not set!",
    }),
    AUTH_SECRET: t.String({
      minLength: 1,
      error: "AUTH_SECRET server environment variable is not set!",
    }),
    AUTH_TRUST_HOST: t.Optional(
      t.String({
        minLength: 1,
        error: "AUTH_TRUST_HOST server environment variable is not set!",
      }),
    ),
    AUTH_URL: t.String({
      minLength: 1,
      error: "AUTH_URL server environment variable is not set!",
    }),
  }),
});

const serverEnvResult = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  STAFF_MEMERS_URL:
    import.meta.env.STAFF_MEMERS_URL ??
    "https://bot.coding.global/api/693908458986143824/staff",
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  AUTH_URL: process.env.AUTH_URL,
});

if (!serverEnvResult.data) {
  const firstError = serverEnvResult.errors[0];
  if (firstError)
    throw new Error(
      `Invalid server environment variable ${firstError.path.slice(1)}: ${firstError.summary.replaceAll("  ", " ")}`,
    );
  else throw new Error(`Invalid server environment ${serverEnvResult.error}`);
}

export const serverEnv = serverEnvResult.data;
