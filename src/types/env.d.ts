declare namespace NodeJS {
  export interface ProcessEnv {
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    JWT_SECRET_KEY: string;
    CON_STRING: string;
  }
}
