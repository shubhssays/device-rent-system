// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    REDIS_HOST: string;
    REDIS_PORT: string;
    SERVER_HOST: string;
    SERVER_PORT: string;
    EMAIL_QUEUE_NAME: string;
  }
}