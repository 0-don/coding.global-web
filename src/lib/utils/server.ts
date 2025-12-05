import { headers } from "next/headers";
import { SERVER_URL_KEY } from "../config/constants";

export const serverUrl = async () => (await headers()).get(SERVER_URL_KEY);
