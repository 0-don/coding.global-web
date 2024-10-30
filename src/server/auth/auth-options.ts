import { JWT } from "@auth/core/jwt";
import Discord, { DiscordProfile } from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultSession, SolidAuthConfig } from "@solid-mediakit/auth";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { serverEnv } from "~/utils/env/server";
import { SessionUser } from "~/utils/types";
import { users } from "../../lib/schema/auth";

declare module "@auth/core/types" {
  export interface Session {
    user?: SessionUser;
  }
}

const getImage = (profile: DiscordProfile) =>
  `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar?.startsWith("a_") ? "gif" : "png"}`;

export const authOptions: SolidAuthConfig = {
  basePath: import.meta.env.VITE_AUTH_PATH,
  secret: serverEnv.AUTH_SECRET,
  session: { strategy: "jwt" },
  debug: false,
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      profile(profile) {
        profile.image = getImage(profile);
        return {
          id: profile.id,
          name: profile?.username || profile.global_name,
          email: profile?.email || profile.id,
          image: profile.image,
        };
      },
    }),
  ],
  events: {
    signIn({ user, profile }) {
      const p = profile as DiscordProfile;

      db.update(users)
        .set({
          name: p?.username,
          globalName: p?.global_name,
          image: getImage(p),
          accentColor: p?.accent_color,
          banner: p?.banner,
          bannerColor: p?.banner_color,
          emailVerified: new Date(),
        })
        .where(eq(users.id, user.id!))
        .then();
    },
  },
  callbacks: {
    jwt({ token, user, profile }) {
      if (profile && user) return { ...token, me: user, profile } as JWT;
      return { ...token } as JWT;
    },
    session({ token, session }) {
      return { ...session, user: { ...token } } as DefaultSession;
    },
  },
};
