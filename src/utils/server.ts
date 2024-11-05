import { parseCookies } from "vinxi/http";

export const setCookies = () => ({
  $headers: {
    cookie: Object.entries(parseCookies())
      .map(([key, value]) => `${key}=${value}`)
      .join("; "),
  },
});
