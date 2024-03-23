import Discord from "@auth/core/providers/discord";
import { SolidAuth, SolidAuthConfig } from "@solid-mediakit/auth";
import { dbAdapter } from "~/routes/api/db";
import { serverEnv } from "~/utils/env/server";

export const authOpts: SolidAuthConfig = {
  adapter: dbAdapter,
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
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
    }),
  ],
  // session: {
  //   strategy: "database",
  // },
  callbacks: {
    // jwt: async ({ account, token, user, profile, session }) => {
    //   if (account) {
    //     token.id = account.id;
    //   }
    //   return token;
    // },
    session: async ({ session }) => {
      // console.log(token, user);

      // console.log("session", session);
      // session.user.id = user.id;
      return session;
    },
  },
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
