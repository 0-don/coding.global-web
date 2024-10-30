import type { AdapterUser } from "@auth/core/adapters";
import type { DiscordProfile } from "@auth/core/providers/discord";
import type { User } from "@solid-mediakit/auth";
import type { IconTypes } from "solid-icons";

export interface Staff {
  id: string;
  username: string;
  globalName: string | null;
  joinedAt: string;
  displayAvatarURL: string;
  bannerUrl?: string | null;
  displayHexColor: string;
  memberRoles: string[];
}

export interface MemberRole {
  role: string;
  Icon: IconTypes;
  color: string;
}

export interface SessionUser extends User {
  me: User | AdapterUser;
  profile: DiscordProfile;
}
