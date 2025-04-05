import { Type as t } from "@sinclair/typebox";
import { TypeCompiler } from "elysia/type-system";
import { safeParse } from "~/utils/base";

const serverSchema = t.Object({
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

const serverSchemaChecker = TypeCompiler.Compile(serverSchema);

const serverEnvResult = safeParse(serverSchemaChecker, {
  DATABASE_URL: process.env.DATABASE_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  AUTH_URL: process.env.AUTH_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!serverEnvResult.success) {
  const firstError = serverEnvResult.errors[0];
  if (firstError) {
    throw new Error(
      `Invalid server environment variable: ${firstError.message}`,
    );
  }
  throw new Error(`Invalid server environment validation failed`);
}

export const serverEnv = serverEnvResult.data;
