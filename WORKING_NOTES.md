# Working Notes — College Student Lifestyle Survey

**BAIS:3300 — Spring 2026 | C. Willcutt**

---

## Architecture Decisions

### Why Supabase instead of the Express API backend?

Replit's development network blocks outbound TCP connections to external PostgreSQL hosts (ports 5432 and 6543). This made it impossible to connect the Express backend to a remote Supabase database during development.

**Solution:** Use the Supabase JavaScript client (`@supabase/supabase-js`) directly from the React frontend. It communicates over HTTPS (port 443), which is not blocked. The Express API server still exists in the repo but is not used by the frontend for survey data.

### Why Azure Static Web Apps?

The frontend is a purely static build (no server-side rendering). Azure Static Web Apps is a free tier hosting service designed exactly for this — it serves static files and handles client-side routing rewrites via `staticwebapp.config.json`.

### Why client-side aggregation on the Results page?

Since the frontend calls Supabase directly, all raw rows are fetched and aggregated in the browser using JavaScript. This avoids needing a backend `GROUP BY` query and keeps the architecture simple (no API server needed in production).

---

## Known Issues & Fixes

### Supabase RLS policy conflict
**Error:** `ERROR: 42710: policy "allow_public_insert" for table "survey_responses" already exists`

**Cause:** The `supabase-setup.sql` script was run more than once.

**Fix:** Added `DROP POLICY IF EXISTS` statements before each `CREATE POLICY` in the SQL script. Safe to re-run.

### Vite crashes during Azure build
**Error:** Vite config threw on missing `PORT` and `BASE_PATH` env vars, which Replit sets but Azure does not.

**Fix:** Made both vars optional in `vite.config.ts`. `BASE_PATH` defaults to `/` (correct for Azure root deployment). `PORT` is only used by the dev/preview server, not the build step.

### React Router routes return 404 on Azure
**Cause:** Azure serves static files; navigating directly to `/survey` or `/results` returns a 404 because those files don't exist on disk.

**Fix:** `staticwebapp.config.json` with a `navigationFallback` pointing all routes to `/index.html`, letting React Router handle routing client-side.

### `VITE_` prefix required for env vars
Vite only exposes environment variables prefixed with `VITE_` to browser code. Variables without this prefix are available only in Node.js build scripts. Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must use the prefix.

---

## Deployment Checklist

- [ ] Run `supabase-setup.sql` in Supabase SQL Editor (one time)
- [ ] Push code to GitHub
- [ ] Create Azure Static Web App and link to GitHub repo
- [ ] Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to GitHub Secrets
- [ ] Add `VITE_SUPABASE_URL` to GitHub Secrets
- [ ] Add `VITE_SUPABASE_ANON_KEY` to GitHub Secrets
- [ ] Push to `main` to trigger first deployment

---

## Environment Variables

| Variable | Where set | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Replit env / GitHub Secret | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Replit env / GitHub Secret | Supabase public anon key |
| `PORT` | Replit env (auto) | Dev server port (Replit only) |
| `BASE_PATH` | Replit env (auto) | URL base path (Replit only, defaults to `/`) |

---

## File Reference

| File | Purpose |
|---|---|
| `artifacts/survey-app/src/lib/supabase.ts` | Supabase JS client initialization |
| `artifacts/survey-app/src/pages/survey.tsx` | Survey form — submits to Supabase |
| `artifacts/survey-app/src/pages/results.tsx` | Results page — reads from Supabase, renders charts |
| `artifacts/survey-app/src/components/layout.tsx` | Shared nav + footer |
| `artifacts/survey-app/public/staticwebapp.config.json` | Azure routing config |
| `artifacts/survey-app/vite.config.ts` | Vite build config (works in Replit and Azure) |
| `.github/workflows/azure-static-web-apps.yml` | CI/CD pipeline |
| `supabase-setup.sql` | One-time DB setup script |
| `lib/db/src/schema/survey.ts` | Drizzle ORM schema (reference only) |
