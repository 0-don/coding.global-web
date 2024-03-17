import { IconTypes } from "solid-icons";

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
