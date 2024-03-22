declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_DB: string;
    
    DATABASE_URL: string;

    VITE_HOST_URL: string;

    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;

    BUN?: string;
  }
}
