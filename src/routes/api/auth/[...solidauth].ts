import Discord from "@auth/core/providers/discord";
import { SolidAuth, type SolidAuthConfig } from "@solid-mediakit/auth";

// console.log("process.env.DISCORD_CLIENT_ID", process.env.DISCORD_CLIENT_ID);
// console.log(
//   "process.env.DISCORD_CLIENT_SECRET",
//   process.env.DISCORD_CLIENT_SECRET,
// );

export const authOpts: SolidAuthConfig = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  debug: false,
};

console.log("authOpts", authOpts);

export const { GET, POST } = SolidAuth(authOpts);
