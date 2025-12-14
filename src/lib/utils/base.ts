export const getDiscordInviteLink = () =>
  `https://discord.com/invite/${process.env.NEXT_PUBLIC_INVITE_CODE}`;

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
