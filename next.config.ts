import type { NextConfig } from 'next';
import z, { treeifyError } from 'zod';

(() => {
  const nonEmpty = (name: string) =>
    z.string().min(1, `${name} is required and cannot be empty`);

  const envSchema = z.object({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: nonEmpty(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'
    ),
    CLERK_SECRET_KEY: nonEmpty('CLERK_SECRET_KEY'),
    UPSTASH_REDIS_REST_URL: nonEmpty('UPSTASH_REDIS_REST_URL').url(
      'UPSTASH_REDIS_REST_URL must be a valid URL'
    ),
    UPSTASH_REDIS_REST_TOKEN: nonEmpty('UPSTASH_REDIS_REST_TOKEN'),
    GROQ_API_KEY: nonEmpty('GROQ_API_KEY'),
    CRON_TOKEN: nonEmpty('CRON_TOKEN'),
  });

  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    console.error(
      'Invalid environment variables:',
      treeifyError(env.error).properties
    );
    process.exit(1);
  }

  console.info('Environment variables are valid');
})();

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
