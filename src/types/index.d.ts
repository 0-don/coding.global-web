export interface UnresolvedMember {
  id: string;
  description: string;
}

export interface DiscordMember {
  id: string;
  tag: string;
  avatar: Image;
  banner: Image;
}

export interface Image {
  link: string;
}

export interface Staff {
  id: string;
  username: string;
  guildName: string;
  avatarUrl: string;
  staffRoles: string[];
}

export type ResolvedMember = UnresolvedMember & DiscordMember;
