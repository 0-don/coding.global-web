import { cache } from "@solidjs/router";
import { Staff } from "~/types";

async function fetchAPI(url: string, init?: RequestInit | undefined) {
  try {
    const response = await fetch(url, init);
    const text = await response.text();
    try {
      if (text === null) {
        return { error: "Not found" };
      }
      return JSON.parse(text);
    } catch (e) {
      console.error(`Received from API: ${text}`);
      console.error(e);
      return { error: e };
    }
  } catch (error) {
    return { error };
  }
}

export const getStaffMembers = cache(async (): Promise<Staff[]> => {
  "use server";
  return fetchAPI("https://bot.coding.global/api/693908458986143824/staff");
}, "staff-members");
