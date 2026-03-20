const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

export const endpoints = {
  auth: {
    deleteAccount: `${API_BASE}/auth/delete-account`,
  },
  process: {
    improveSummary: `${API_BASE}/process/improve-summary`,
    jobAnalysis: `${API_BASE}/process/job-analysis`,
    generateSummary: `${API_BASE}/process/generate-summary`,
  },
  healthCheck: `${API_BASE}/health-check`,
} as const;
