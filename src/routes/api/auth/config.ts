import { JWT } from "@auth/core/jwt";
import Discord from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultSession, SolidAuthConfig } from "@solid-mediakit/auth";
import { serverEnv } from "~/utils/env/server";
import { db } from "../db";

export const authOpts: SolidAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      profile(profile) {
        const image = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith("a_") ? "gif" : "png"}`;
        profile.image = image;
        return {
          id: profile.id,
          name: profile?.username || profile.global_name,
          email: profile.email,
          image,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, profile }) {
      console.log(profile);
      return { ...token, ...profile, ...user } as JWT;
    },
    session({ token, session }) {
      return { ...session, user: { ...token } } as DefaultSession;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: false,
};
