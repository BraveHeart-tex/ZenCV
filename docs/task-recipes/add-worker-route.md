# Add A Worker Route

1. Add `worker/src/routes/[name].ts`.
2. Use `rateLimitMiddleware` for AI or expensive processing.
3. Validate request bodies with Zod/shared schemas before doing work.
4. Create service clients inside the route handler from `c.env`; do not use Cloudflare bindings at module scope.
5. Use `getLogger(c)` and structured metadata objects for important events.
6. Wrap route logic in `try/catch`, call `await captureError(error, c, context)`, then return an error response.
7. Mount the route in `worker/src/index.ts`.
8. Add the frontend endpoint to `src/lib/endpoints.ts`.
9. Run `pnpm worker:typecheck`; add/adjust tests when the behavior has branching or shared contracts.
