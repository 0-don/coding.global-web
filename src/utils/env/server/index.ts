import Discord from "@auth/core/providers/discord";
import { Type as t } from "@sinclair/typebox/type";
import { SolidAuthConfig } from "@solid-mediakit/auth";
import { parse } from "~/utils";

const serverEnvSchema = t.Object({
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
});

export const serverEnv = parse(serverEnvSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
});

export const authOpts: SolidAuthConfig = {
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = { ...token, ...user };
        delete token.email;
      }
      return token;
    },
  },
  debug: false,
};
