declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_DB: string;
    DATABASE_URL: string;

    VITE_BOT_URL: string;
    VITE_HOST_URL: string;
    VITE_AUTH_PATH: string;
    VITE_GUILD_ID: string;

    AUTH_URL: string;
    AUTH_SECRET: string;
    AUTH_TRUST_HOST: string;

    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
  }
}
