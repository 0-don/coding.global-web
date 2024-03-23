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
        console.log(profile);
        return {
          id: profile.id,
          name: profile?.username || profile.global_name,
          global_name: profile.global_name,
          email: profile.email,
          image,
          banner: profile.banner,
          banner_color: profile.banner_color,
          accent_color: profile.accent_color,
        };
      },
    }),
  ],
  events: {
    createUser({ user }) {
      console.log(user);
    },
  },
  callbacks: {
    jwt({ token, user, profile }) {
      profile && (profile.test = "test");
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
