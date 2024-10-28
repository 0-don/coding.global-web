import { AdapterUser } from "@auth/core/adapters";
import { DiscordProfile } from "@auth/core/providers/discord";
import "@auth/core/types";

declare module "@auth/core/types" {
  export interface Session extends DefaultSession {
    user?: User & {
      me: User | AdapterUser;
      profile: DiscordProfile;
    };
  }
}
