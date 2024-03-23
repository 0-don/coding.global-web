import "@auth/core/types";

declare module "@auth/core/types" {
  export interface Session extends DefaultSession {
    user?: User & {
      global_name?: string;
      banner?: string;
      banner_color?: string;
      accent_color?: number;
    };
  }
}
