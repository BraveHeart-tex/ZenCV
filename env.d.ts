declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly CLERK_SECRET_KEY: string;
    readonly UPSTASH_REDIS_REST_URL: string;
    readonly UPSTASH_REDIS_REST_TOKEN: string;
    readonly GROQ_API_KEY: string;
  }
}

export {};
