import Discord from "@auth/core/providers/discord";
import { SolidAuth, type SolidAuthConfig } from "@solid-mediakit/auth";

export const authOpts: SolidAuthConfig = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
