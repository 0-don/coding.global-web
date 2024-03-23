import Discord from "@auth/core/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SolidAuth, SolidAuthConfig } from "@solid-mediakit/auth";
import { serverEnv } from "~/utils/env/server";
import { db } from "../db";

const authOpts: SolidAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      profile(profile) {
        return {
          ...profile,
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image: profile.image_url,
        };
      },
    }),
  ],
  debug: false,
};

export { authOpts };

export const { GET, POST } = SolidAuth(authOpts);
