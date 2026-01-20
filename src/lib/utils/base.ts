export const getDiscordInviteLink = () =>
  `https://discord.com/invite/${process.env.NEXT_PUBLIC_INVITE_CODE}`;

export const getDiscordUserLink = (userId: string) =>
  `https://discord.com/users/${userId}`;

export const getDiscordChannelLink = (channelId: string) =>
  `https://discord.com/channels/${process.env.NEXT_PUBLIC_GUILD_ID}/${channelId}`;

/**
 * Helper to handle Eden.js API responses for use with TanStack Query.
 * Takes an Eden response object and either:
 * - Returns the data if successful
 * - Throws the error if unsuccessful
 *
 * @param response The Eden response object containing data or error
 * @returns The response data of type T
 * @throws EdenFetchError if the response contains an error
 */
export function handleElysia<T extends { data: unknown; status: number }>(
  response: T,
): T["data"] {
  if (response.status == 200) {
    return response.data as T["data"];
  }
  throw response;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
