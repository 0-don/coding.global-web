import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";
import { DiscordProfile } from "@auth/core/providers/discord";
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

export function Discord<P extends DiscordProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> & { options: OAuthUserConfig<P> | undefined } {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber =
          profile.discriminator === "0"
            ? Number(BigInt(profile.id) >> BigInt(22)) % 6
            : parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return {
        ...profile,
        id: profile.id,
        name: profile.global_name ?? profile.username,
        email: profile.email,
        image: profile.image_url,
      };
    },
    style: { logo: "/discord.svg", bg: "#5865F2", text: "#fff" },
    options,
  };
}

export const authOpts: SolidAuthConfig = {
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
    }),
  ],
  debug: false,
};
