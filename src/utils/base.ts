export function parseCookie(cookie: string, key: string): string | undefined {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match?.[2];
}