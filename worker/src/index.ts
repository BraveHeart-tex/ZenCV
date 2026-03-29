import * as Sentry from '@sentry/cloudflare';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { type Env, validateEnv } from './env';
import { loggerMiddleware } from './middleware/logger';
import authRoutes from './routes/auth';
import generateBulletsRoute from './routes/generate-bullets';
import generateSummaryRoute from './routes/generate-summary';
import improveSummaryRoute from './routes/improve-summary';
import jobAnalysisRoute from './routes/job-analysis';

const app = new Hono<{ Bindings: Env }>();

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://zencv.vercel.app'],
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-CRON-TOKEN'],
  })
);
app.use('*', loggerMiddleware);
app.use('*', async (c, next) => {
  validateEnv(c.env);
  await next();
});

app.route('/auth', authRoutes);
app.route('/process/generate-bullets', generateBulletsRoute);
app.route('/process/improve-summary', improveSummaryRoute);
app.route('/process/job-analysis', jobAnalysisRoute);
app.route('/process/generate-summary', generateSummaryRoute);

app.notFound((c) => c.json({ success: false, message: 'Not found' }, 404));

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    {
      success: false,
      message: 'An internal error occurred.',
      timestamp: Date.now(),
    },
    500
  );
});

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN,
    environment: env.ENVIRONMENT,
    tracesSampleRate: 1.0,
  }),
  {
    fetch: app.fetch.bind(app),
  }
);
