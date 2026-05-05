# Working Notes — College Student Lifestyle Survey

> **Internal document. Not public-facing. Do not commit sensitive credentials.**
> Update this file at the end of every development session before closing.

---

## How to Use This File (For AI Assistants)

1. **Read this entire file first** before taking any action or making any suggestion. Context here overrides assumptions.
2. **Read `README.md`** for public-facing project context, tech stack summary, and deployment instructions.
3. **Do not change the folder structure or package conventions** without first discussing the change and getting explicit approval.
4. **Follow all conventions exactly** as described in the Conventions section — naming, code style, commit format, and framework patterns.
5. **Do not suggest anything listed in "What Was Tried and Rejected."** Those approaches were evaluated and discarded for documented reasons.
6. **Ask before making large structural changes** — e.g. swapping libraries, reorganizing directories, changing the database client, or modifying the build pipeline.
7. **Refactor conservatively.** This project was AI-assisted from the start. Prefer targeted edits over wholesale rewrites. When in doubt, make the smallest change that fixes the problem.

---

## Current State

**Last Updated:** 2026-03-29

The app is functionally complete and ready for production deployment. The frontend communicates directly with Supabase over HTTPS. The GitHub Actions workflow is in place. The only remaining manual step before deployment is linking the repo to Azure Static Web Apps in the Azure portal and adding the three required GitHub Secrets.

### What Is Working

- [x] Home page with "Take the Survey" and "View Results" CTAs
- [x] Survey form — all 6 questions, full Zod validation, conditional "Other" activity field
- [x] Survey submission — inserts a row into Supabase `survey_responses` table via JS client
- [x] Results page — fetches all rows from Supabase and aggregates client-side
- [x] Five Recharts visualizations on Results page
- [x] WCAG 2.1 AA accessibility (labels, keyboard nav, error messaging)
- [x] Mobile-first responsive layout
- [x] Footer on all pages: "Survey by C. Willcutt, BAIS:3300 - spring 2026."
- [x] `staticwebapp.config.json` for Azure client-side routing fallback
- [x] GitHub Actions CI/CD workflow (`.github/workflows/azure-static-web-apps.yml`)
- [x] `supabase-setup.sql` — creates table and RLS policies (safe to re-run)
- [x] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as shared Replit env vars
- [x] Vite config works in both Replit dev environment and Azure build environment

### What Is Partially Built

- [ ] Express API server (`artifacts/api-server`) — scaffolded, routes exist, but **not connected to the frontend** and not needed in production
- [ ] Drizzle ORM schema (`lib/db/src/schema/survey.ts`) — defined but not used at runtime (Supabase JS client used instead)
- [ ] OpenAPI spec (`lib/api-spec/openapi.yaml`) — exists and generated React Query hooks, but those hooks are no longer used

### What Is Not Started

- [ ] Duplicate submission prevention
- [ ] Admin / data management dashboard
- [ ] Results filtering by year, state, or activity
- [ ] CSV export of responses
- [ ] Any form of authentication

---

## Current Task

The app is fully built. The last session focused on Azure Static Web Apps deployment prep: updating `vite.config.ts` to not crash during Azure builds, cleaning up `staticwebapp.config.json`, and writing the GitHub Actions workflow. Documentation (`README.md`, `WORKING_NOTES.md`, `LICENSE`) was also written.

**Next step:** Push the repo to GitHub, create an Azure Static Web App in the portal, link it to the repo, and add the three GitHub Secrets (`AZURE_STATIC_WEB_APPS_API_TOKEN`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19.1.0 | Component-based UI; required by course tooling |
| TypeScript | ~5.9.2 | Type safety across the monorepo |
| Vite | ^7.3.0 | Fast HMR in dev; clean static build output for Azure |
| Tailwind CSS | ^4.1.14 | Utility-first; rapid styling without a CSS file per component |
| shadcn/ui | latest | Pre-built accessible components (Select, RadioGroup, Checkbox) |
| react-hook-form | ^7.71.2 | Minimal re-renders; integrates cleanly with Zod |
| Zod | 3.25.76 | Schema-first validation; same schema used for form and type inference |
| Recharts | ^2.15.4 | React-native charting; simple API for bar, pie, and line charts |
| @supabase/supabase-js | ^2.100.1 | HTTPS client — only way to reach Supabase from Replit dev environment |
| Supabase (PostgreSQL) | cloud | Free tier, built-in RLS, no server needed for anonymous read/write |
| pnpm workspaces | 10+ | Monorepo management; shared catalog for dependency versions |
| Express 5 | ^5.2.1 | Scaffolded by the monorepo template; present but unused in production |
| Drizzle ORM | ^0.45.1 | Scaffolded by the monorepo template; schema defined but unused at runtime |
| Azure Static Web Apps | — | Free static hosting with built-in routing config support |
| GitHub Actions | — | CI/CD; builds and deploys on push to `main` |

---

## Project Structure Notes

```
.
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml   # Do not rename — Azure portal may reference this file
├── artifacts/
│   ├── api-server/                     # Unused in production — do not delete, but do not wire up without discussion
│   └── survey-app/                     # The entire deployed product lives here
│       ├── public/
│       │   └── staticwebapp.config.json  # Must stay in public/ — Vite copies it to dist root
│       ├── src/
│       │   ├── components/
│       │   │   └── layout.tsx          # Shared nav + footer — footer text is hardcoded here
│       │   ├── lib/
│       │   │   └── supabase.ts         # Single Supabase client instance — import from here only
│       │   └── pages/
│       │       ├── home.tsx
│       │       ├── survey.tsx          # All form logic, Zod schema, and submit handler
│       │       └── results.tsx         # Fetches raw rows; all aggregation done in-component
│       ├── vite.config.ts              # PORT and BASE_PATH are optional — safe for Azure build
│       └── package.json
├── lib/
│   ├── api-spec/openapi.yaml           # Kept for reference; generated clients not used by frontend
│   ├── api-client-react/               # Generated — do not hand-edit
│   ├── api-zod/                        # Generated — do not hand-edit
│   └── db/src/schema/survey.ts        # Drizzle schema — kept as source of truth for field names
├── supabase-setup.sql                  # Re-runnable; always includes DROP POLICY IF EXISTS
├── README.md
├── WORKING_NOTES.md                    # This file
├── LICENSE
├── pnpm-workspace.yaml                 # Dependency version catalog lives here
└── package.json                        # Root scripts only — no app code here
```

### Non-obvious decisions

- **`supabase.ts` is the only place the Supabase client is initialized.** All pages import from `@/lib/supabase`. Never instantiate a second client.
- **`dist/public`** is the build output directory (not `dist`). This is intentional — the monorepo template uses this convention. The GitHub Actions workflow references it explicitly.
- **`lib/api-client-react` and `lib/api-zod` are auto-generated.** Running `pnpm codegen` from the api-spec package overwrites them. Do not hand-edit these files.

### Files and folders that must not be changed without discussion

- `pnpm-workspace.yaml` — changing the catalog breaks all workspace packages
- `artifacts/survey-app/public/staticwebapp.config.json` — must stay in `public/` and must contain `navigationFallback`
- `.github/workflows/azure-static-web-apps.yml` — changing build paths or secret names breaks deployment
- `supabase-setup.sql` — always test against a staging Supabase project before re-running in production

---

## Data / Database

**Database:** Supabase (PostgreSQL), cloud-hosted. Accessed via HTTPS using `@supabase/supabase-js`. Row Level Security is enabled.

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `SERIAL` | auto | Primary key, auto-incremented |
| `after_class_activity` | `TEXT` | yes | Free-text response to question 1 |
| `state` | `TEXT` | yes | One of the 50 U.S. state names |
| `year_in_college` | `TEXT` | yes | One of: `1st Year`, `2nd Year`, `3rd Year`, `4th Year`, `5th Year or More` |
| `activities` | `TEXT[]` | yes | Array; at least one value required; options: `Exercise`, `Watch TV/Movies`, `Socialize`, `Study`, `Play Video Games`, `Other` |
| `other_activity` | `TEXT` | no | Only present when `activities` includes `"Other"` |
| `study_hours` | `TEXT` | yes | One of: `0–5 hours`, `6–10 hours`, `11–15 hours`, `16+ hours` |
| `study_preference` | `TEXT` | yes | One of: `Alone`, `With Others`, `Both` |
| `created_at` | `TIMESTAMPTZ` | auto | Set by PostgreSQL default `NOW()` |

### RLS Policies

- `allow_public_insert` — grants `anon` role INSERT with no restrictions
- `allow_public_select` — grants `anon` role SELECT with no restrictions

Both policies must be present for the app to function. Do not add UPDATE or DELETE policies without implementing authentication first.

---

## Conventions

### Naming Conventions

- **Files:** `kebab-case` for all files (e.g. `survey.tsx`, `supabase.ts`)
- **Components:** `PascalCase` named exports (e.g. `export default function Survey()`)
- **Variables and functions:** `camelCase`
- **Database fields:** `snake_case` (matches Supabase column names exactly)
- **Zod schemas:** suffix with `Schema` (e.g. `surveySchema`)
- **Inferred types from Zod:** suffix with `Data` (e.g. `SurveyFormData`)

### Code Style

- **Formatter:** Prettier (root `package.json` devDependency)
- **No semicolons** — Prettier config enforces this
- **2-space indentation**
- **Single quotes** for strings in TypeScript
- Imports ordered: external packages → internal `@/` aliases → relative paths
- All form fields must have an explicit `aria-label` or associated `<label>` element

### Framework Patterns

- **Forms:** Always use `react-hook-form` with `zodResolver`. Never use uncontrolled inputs or manual `useState` for form fields.
- **Supabase calls:** Always `await` and always destructure `{ data, error }`. Check `error` before using `data`.
- **Page components:** One default export per file. No named page exports.
- **Routing:** Uses `wouter` (not React Router). Routes defined in `src/main.tsx` or `src/app.tsx`.
- **Styling:** Tailwind utility classes only. No inline `style` props. No external CSS files per component.

### Git Commit Style

Use imperative mood, present tense. Keep the subject line under 72 characters.

```
Add validation for other_activity conditional field
Fix Supabase RLS policy conflict on re-run
Update vite.config to support Azure build environment
```

---

## Decisions and Tradeoffs

- **Supabase JS client instead of Express API:** The Express backend cannot reach Supabase over TCP from the Replit dev environment. The JS client uses HTTPS and works in both Replit and Azure. Do not suggest switching back to a REST API backend without a clear solution to the TCP blocking issue.
- **Client-side aggregation on Results page:** Fetching all rows and aggregating in the browser avoids a backend and keeps the architecture flat. Acceptable for a course project with low response counts. Do not move aggregation server-side unless response counts exceed ~1,000 rows.
- **Anonymous RLS only:** No authentication is implemented. The anon key is safe to expose in the browser as long as RLS policies restrict operations correctly (insert and select only). Do not add UPDATE or DELETE RLS policies for the anon role.
- **`dist/public` as build output:** This is a monorepo template convention. The GitHub Actions workflow and Azure deployment are both configured for this path. Do not change it without updating both.
- **pnpm catalog for dependency versions:** All shared dependency versions are pinned in `pnpm-workspace.yaml` under `catalog:`. Do not add version specifiers directly to `package.json` for catalogued packages.
- **`BASE_PATH` defaults to `/`:** For Azure, the app is served from root. Replit overrides this with its own path prefix via env var. The fallback ensures the build does not fail in Azure's environment.

---

## What Was Tried and Rejected

- **Direct PostgreSQL connection from Express to Supabase:** Replit's network blocks outbound TCP on ports 5432 and 6543. Connection attempts time out. Do not suggest this approach.
- **Express API as a proxy between frontend and Supabase:** Still requires the server to reach Supabase over TCP. Same blocking issue applies. Do not suggest this.
- **Using `import.meta.env.PORT` for port assignment:** Vite exposes env vars prefixed with `VITE_` only. `PORT` is a server-side variable read in `vite.config.ts` via `process.env.PORT`, not in client code.
- **Hardcoding `PORT` as a fallback in vite.config:** This caused crashes when `PORT` was undefined during Azure builds. Replaced with a conditional that only requires `PORT` when the dev server is actually starting.
- **Running `supabase-setup.sql` without `DROP POLICY IF EXISTS`:** Caused `ERROR: 42710` on second run. All policy creation statements must be preceded by `DROP POLICY IF EXISTS`.

---

## Known Issues and Workarounds

### Issue: Results page has no loading skeleton

**Problem:** While Supabase data is fetching, the Results page shows a blank area with "0 Total Responses" before data arrives. There is no loading spinner or skeleton.

**Workaround:** None currently. The fetch is fast enough to be unnoticeable in most cases.

**Do not remove** the `isLoading` state variable in `results.tsx` — it is in place for when a skeleton is added.

---

### Issue: No duplicate submission prevention

**Problem:** A user can submit the survey multiple times. There is no fingerprinting, session tracking, or rate limiting.

**Workaround:** None. Accepted for a course project. Supabase's free tier anon key does not support per-user quotas without auth.

**Do not add** server-side rate limiting without first adding authentication — the anon role has no identity to rate-limit against.

---

### Issue: Express API server is scaffolded but unused

**Problem:** `artifacts/api-server` has working routes (`POST /api/survey/submit`, `GET /api/survey/results`) connected to Drizzle ORM, but the frontend no longer calls them. The server still runs in Replit but serves no traffic.

**Workaround:** The server runs silently in the background. It does not affect the frontend.

**Do not remove** the api-server without explicit instruction — it may be needed if the architecture ever reverts to a backend-driven approach.

---

## Browser / Environment Compatibility

### Frontend

| Browser | Status |
|---|---|
| Chrome 120+ | Tested, fully working |
| Firefox 120+ | Expected to work (not manually tested) |
| Safari 17+ | Expected to work (not manually tested) |
| Edge 120+ | Expected to work (not manually tested) |
| Mobile Safari (iOS) | Tested in Replit preview, responsive layout confirmed |

- No Internet Explorer support. IE is end-of-life and not a course requirement.
- App uses CSS Grid and Flexbox — no compatibility shims needed for target browsers.
- `VITE_` env vars are inlined at build time. No runtime env injection.

### Backend / Build Environment

| Requirement | Value |
|---|---|
| OS | Linux (Ubuntu — Replit; Ubuntu — GitHub Actions) |
| Node.js | 24+ |
| pnpm | 10+ |
| Environment | Replit (dev), GitHub Actions + Azure Static Web Apps (prod) |
| Required env vars (build) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Required env vars (Replit dev only) | `PORT`, `BASE_PATH` (auto-set by Replit) |

---

## Open Questions

- [ ] **Should the Express API server be kept or removed?** It is scaffolded, has working routes, but adds noise. Decision pending on whether the course requires a backend component.
- [ ] **Should `other_activity` be stored even when not selected?** Currently stored as `null` when "Other" is not checked. Confirm this is acceptable for data analysis.
- [ ] **What happens to data after the course ends?** Supabase free tier projects are paused after 1 week of inactivity. A data export strategy should be decided before the semester ends.
- [ ] **Should the GitHub repo be public or private?** Affects whether the Azure Static Web App needs a token or can use OAuth. Currently configured for a private repo with a token.

---

## Session Log

### 2026-03-29

**Accomplished:**
- Integrated `@supabase/supabase-js` — rewrote `survey.tsx` and `results.tsx` to call Supabase directly over HTTPS, bypassing the Express backend
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Replit shared env vars
- Created `supabase-setup.sql` with table DDL and RLS policies; updated to be re-runnable with `DROP POLICY IF EXISTS`
- Updated `vite.config.ts` to be compatible with Azure build environment (no hard requirement on `PORT` or `BASE_PATH`)
- Cleaned up `staticwebapp.config.json` — removed unused API rewrite, kept `navigationFallback`
- Created `.github/workflows/azure-static-web-apps.yml` for CI/CD
- Wrote `README.md` (public-facing), `WORKING_NOTES.md` (this file), and `LICENSE` (MIT)

**Left incomplete:**
- Azure portal setup (create Static Web App, get token, add GitHub Secrets) — must be done manually by the developer

**Decisions made:**
- Use Supabase JS client (HTTPS) instead of Express proxy — TCP is blocked in Replit
- Keep Express API server in the repo but do not use it in production
- Build output stays at `dist/public` per monorepo convention

**Next step:** Push to GitHub, create Azure Static Web App, add 3 GitHub Secrets, trigger first deployment.

### 2026-05-05

**Accomplished:**
- Connected Replit project to GitHub repo (`Cjwillcutt/3300-Webform`)
- Confirmed `README.md`, `WORKING_NOTES.md`, and `LICENSE` are committed locally
- Resolved folder rename issue (`CampusLife-Survey` → reverted to `survey-app`) that broke the dev server workflow
- Resolved port conflict (22596) caused by stale Vite process after folder rename

**Left incomplete:**
- GitHub push of all committed files (use Git panel → Commit & Push)
- Azure portal setup

**Next step:** Complete GitHub push via Replit Git panel, then set up Azure Static Web App.

> Note: Push attempted via Replit Git panel — retrying.

---

## Useful References

| Resource | URL | Notes |
|---|---|---|
| Supabase JS Client docs | https://supabase.com/docs/reference/javascript | Used for insert and select patterns |
| Supabase Row Level Security | https://supabase.com/docs/guides/auth/row-level-security | Used to configure anon access policies |
| Recharts docs | https://recharts.org/en-US/api | BarChart, PieChart, LineChart usage |
| shadcn/ui components | https://ui.shadcn.com/docs/components | Select, RadioGroup, Checkbox, Button |
| Azure Static Web Apps routing | https://learn.microsoft.com/en-us/azure/static-web-apps/configuration | `staticwebapp.config.json` reference |
| Azure Static Web Apps deploy action | https://github.com/Azure/static-web-apps-deploy | GitHub Actions workflow reference |
| Vite environment variables | https://vitejs.dev/guide/env-and-mode | `VITE_` prefix requirement |
| pnpm workspace catalog | https://pnpm.io/catalogs | Version pinning in `pnpm-workspace.yaml` |
| shields.io | https://shields.io/badges | Badge generation for README |
| **Replit AI Agent** | https://replit.com | Used throughout — scaffolding, debugging Supabase connectivity, deployment config, and documentation |
