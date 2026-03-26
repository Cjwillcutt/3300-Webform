# Workspace

## Overview

pnpm workspace monorepo using TypeScript. College Student Lifestyle Survey app built with React + Vite frontend, Express API backend, and PostgreSQL database.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Forms**: react-hook-form + zod

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── survey-app/         # React + Vite survey frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Application

### Survey App (`artifacts/survey-app`)
College student lifestyle survey with 3 pages:
- **Home** (`/`): Welcome page with "Take the Survey" and "View Results" CTAs
- **Survey** (`/survey`): 6-question form with full validation and accessibility
- **Results** (`/results`): Aggregated data visualizations using Recharts

### API Endpoints
- `POST /api/survey/submit` — Submit a survey response
- `GET /api/survey/results` — Get aggregated results

### Database Schema
- `survey_responses` table: after_class_activity, state, year_in_college, activities (array), other_activity, study_hours, study_preference

## Design
- Primary accent: `#2563EB`
- Light neutral backgrounds, dark body text
- WCAG 2.1 AA accessible
- Mobile-first responsive

## Deployment
- Azure Static Web Apps config: `artifacts/survey-app/public/staticwebapp.config.json`
- Footer: "Survey by C. Willcutt, BAIS:3300 - spring 2026."
