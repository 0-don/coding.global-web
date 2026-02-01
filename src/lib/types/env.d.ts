declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    DATABASE_URL: string;

    NEXT_PUBLIC_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_INVITE_CODE: string;
    NEXT_PUBLIC_BOT_URL: string;
    NEXT_PUBLIC_GUILD_ID: string;

    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;

    NEXT_PUBLIC_POSTHOG_KEY: string;
    POSTHOG_API_KEY: string;
    POSTHOG_ENV_ID: string;
    INDEXNOW_KEY: string;
  }
}
