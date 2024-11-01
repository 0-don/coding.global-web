import { parseCookies } from "vinxi/http";

export const setCookies = () => ({
  $headers: { cookie: parseCookies() },
});
