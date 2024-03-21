declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_DB: string;
    DATABASE_URL: string;
    VITE_HOST_URL: string;
  }
}
