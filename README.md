# College Student Lifestyle Survey

**BAIS:3300 — Spring 2026 | C. Willcutt**

A full-stack web application for collecting and visualizing college student lifestyle data. Built with React + Vite, Supabase (PostgreSQL), and deployed to Azure Static Web Apps.

---

## Features

- **Home page** — Introduction and navigation
- **Survey page** — 6-question accessible form (WCAG 2.1 AA compliant)
- **Results page** — 5 live Recharts visualizations of aggregated responses

### Survey Questions

1. What do you usually do after classes? (free text)
2. What state are you from? (dropdown — all 50 states)
3. What year are you in college? (radio — 1st–4th Year)
4. What activities do you participate in? (checkboxes — multiple select)
5. How many hours per week do you study? (radio)
6. Where do you prefer to study? (radio)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, shadcn/ui |
| Charts | Recharts |
| Forms | react-hook-form + Zod |
| Database | Supabase (PostgreSQL) |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions |

---

## Local Development

### Prerequisites

- Node.js 24+
- pnpm 10+

### Setup

```bash
# Install dependencies
pnpm install
```

Create a `.env` file in `artifacts/survey-app/`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

```bash
# Start the dev server
pnpm --filter @workspace/survey-app run dev
```

The app will be available at `http://localhost:PORT`.

---

## Supabase Setup

Run the SQL in `supabase-setup.sql` via the Supabase dashboard → SQL Editor.

This creates the `survey_responses` table and sets Row Level Security policies that allow anonymous users to submit responses and view results.

---

## Deploying to Azure Static Web Apps

### 1. GitHub Secrets

Add these secrets to your GitHub repo (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | From Azure portal when creating the Static Web App |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 2. Create Azure Static Web App

1. Go to the [Azure portal](https://portal.azure.com)
2. Create a new **Static Web App**
3. Connect it to your GitHub repo, select the `main` branch
4. Azure will provide the deployment API token — add it as `AZURE_STATIC_WEB_APPS_API_TOKEN` in GitHub Secrets

### 3. Deploy

Push to `main`. The GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`) will automatically build and deploy.

**Build details:**
- Build command: `pnpm --filter @workspace/survey-app run build`
- Output directory: `artifacts/survey-app/dist/public`

---

## Project Structure

```
artifacts-monorepo/
├── artifacts/
│   ├── api-server/              # Express API server (not used in production)
│   └── survey-app/              # React + Vite frontend
│       ├── src/
│       │   ├── pages/
│       │   │   ├── home.tsx
│       │   │   ├── survey.tsx
│       │   │   └── results.tsx
│       │   ├── components/
│       │   │   └── layout.tsx
│       │   └── lib/
│       │       └── supabase.ts  # Supabase client init
│       └── public/
│           └── staticwebapp.config.json
├── lib/
│   ├── api-spec/                # OpenAPI spec
│   ├── api-client-react/        # Generated React Query hooks
│   ├── api-zod/                 # Generated Zod schemas
│   └── db/                      # Drizzle ORM schema
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml
└── supabase-setup.sql           # Run once in Supabase SQL Editor
```
