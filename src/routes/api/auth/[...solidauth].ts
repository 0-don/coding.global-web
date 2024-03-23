import Discord from "@auth/core/providers/discord";
import { SolidAuth, SolidAuthConfig } from "@solid-mediakit/auth";
import { dbAdapter } from "~/routes/api/db";
import { serverEnv } from "~/utils/env/server";

const authOpts: SolidAuthConfig = {
  adapter: dbAdapter,
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
