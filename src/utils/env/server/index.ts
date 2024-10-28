import { Type as t } from "@sinclair/typebox/type";
import "dotenv/config";
import { parse } from "~/utils/base";

const serverEnvSchema = t.Object({
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
});

export const serverEnv = parse(serverEnvSchema, {
  ...process.env,
  DATABASE_URL: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`,
});
