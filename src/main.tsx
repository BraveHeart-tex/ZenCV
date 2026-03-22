import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './app/globals.css';
import '@/styles/shepherd.css';
import '@/styles/tiptap.css';
import 'shepherd.js/dist/css/shepherd.css';
import * as Sentry from '@sentry/react';
import { GlobalErrorBoundary } from './components/ErrorBoundary';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: import.meta.env.PROD,
});

window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </GlobalErrorBoundary>
  </StrictMode>
);
