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
      authorization: {
        params: { scope: ["identify",  "guilds", "email",].join(" ") },
      },
    }),
  ],
  debug: false,
};
// https://discord.com/oauth2/authorize?scope=identify+email&response_type=code&client_id=1220819574661054665&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&code_challenge=t_0slsW20GV6Oe-El_GK_siAcEirbCcG0gDFOa3ltEc&code_challenge_method=S256


// https://discord.com/oauth2/authorize?client_id=1220819574661054665&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&scope=identify+guilds+email