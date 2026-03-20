import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env';
import authRoutes from './routes/auth';
import generateSummaryRoute from './routes/generate-summary';
import healthCheckRoute from './routes/health-check';
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

app.route('/auth', authRoutes);
app.route('/process/improve-summary', improveSummaryRoute);
app.route('/process/job-analysis', jobAnalysisRoute);
app.route('/process/generate-summary', generateSummaryRoute);
app.route('/health-check', healthCheckRoute);

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

export default app;
