import { z } from 'zod';

const envSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),
  CRON_TOKEN: z.string().min(1),
  SENTRY_DSN: z.string().min(1),
  ENVIRONMENT: z.enum(['development', 'production']).default('production'),
});

export type Env = z.infer<typeof envSchema> & {
  RATE_LIMITER: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
};

export function validateEnv(env: unknown): Env {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    for (const [field, issues] of Object.entries(
      result.error.flatten().fieldErrors
    )) {
      console.error(`  ${field}: ${issues?.join(', ')}`);
    }
    throw new Error(
      'Worker startup aborted due to invalid environment variables.'
    );
  }

  return result.data as Env;
}
