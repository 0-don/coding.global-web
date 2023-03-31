import { DiscordMember } from '../types';

export class DiscordApi {
  public static async getMemberInformation(id: string): Promise<DiscordMember> {
    const res = await fetch(
      `https://discordlookup.mesavirep.xyz/v1/user/${id}`
    );
    const data = (await res.json()) as DiscordMember;
    return data;
  }
}
