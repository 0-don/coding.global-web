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

export type ResolvedMember = UnresolvedMember & DiscordMember;
