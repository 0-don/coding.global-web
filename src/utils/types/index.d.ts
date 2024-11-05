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

export type Attachment = {
  url: string;
  width: number | null;
  height: number | null;
  contentType: string | null;
};

export type News = {
  id: string;
  content: string;
  createdAt: string;
  attachments: Attachment[];
  user: Staff;
};

export interface MemberRole {
  role: string;
  Icon: IconTypes;
  color: string;
}

