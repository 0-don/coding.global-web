import { Elysia, t } from "elysia";

const API_URL = process.env.CODING_API_URL;
const SERVER = process.env.SERVER_ID;

if (!API_URL) {
  throw new Error("CODING_API_URL environment variable is missing");
}
if (!SERVER) {
  throw new Error("SERVER_ID environment variable is missing");
}
 
export const api = new Elysia({prefix:'/api'})
  .get("/team", async () => {
    try {
      const response = await fetch(`${API_URL}api/${SERVER}/staff`);

      if (!response.ok) {
        throw new Error(`Failed to fetch staff data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching team data:", error);
      return { error: "Unable to fetch team data" };
    }
  })
    .get("/news", async () => {
    try {
      const response = await fetch(`${API_URL}api/${SERVER}/news`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Unable to fetch data" };
    }
  })
 
export type Bknd = typeof api;

export const GET = api.handle;
export const POST = api.handle

