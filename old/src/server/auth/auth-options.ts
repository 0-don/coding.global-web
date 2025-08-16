import Discord, { DiscordProfile } from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SolidAuthConfig } from "@solid-mediakit/auth";
import { error } from "console";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { db } from "~/lib/db";
import { serverEnv } from "~/utils/env/server";
import { users } from "../../lib/schema/auth";

const getImage = async (profile: DiscordProfile) => {
  if (!profile.avatar) return null;

  try {
    const isGif = profile.avatar.startsWith("a_");
    const format = isGif ? "gif" : "png";
    const url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;

    const response = await fetch(url);
    const imageBuffer = await response.arrayBuffer();

    const processedBuffer = isGif
      ? await sharp(Buffer.from(imageBuffer), { animated: true })
          .resize(128, 128, {
            fit: "cover",
            position: "center",
          })
          .toBuffer()
      : await sharp(Buffer.from(imageBuffer))
          .resize(128, 128, {
            fit: "cover",
            position: "center",
          })
          .toBuffer();

    return processedBuffer.toString("base64");
  } catch (err) {
    error("Error processing image:", err);
    return null;
  }
};

export const authOptions: SolidAuthConfig = {
  session: { strategy: "database" },
  basePath: import.meta.env.VITE_AUTH_PATH,
  secret: serverEnv.AUTH_SECRET,
  debug: false,
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      async profile(profile) {
        profile.image = await getImage(profile);
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
    async signIn({ user, profile }) {
      const p = profile as DiscordProfile;

      db.update(users)
        .set({
          name: p?.username,
          globalName: p?.global_name,
          image: await getImage(p),
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
    session({ user, session }) {
      if (user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        };
      }
      return session;
    },
  },
};
