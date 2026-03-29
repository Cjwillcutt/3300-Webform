# College Student Lifestyle Survey

## Description

A full-stack web application that collects and visualizes lifestyle data from college students. Built as a course project for BAIS:3300, the app presents a six-question survey covering after-class habits, home state, academic year, extracurricular activities, study hours, and study preferences. Responses are stored in a cloud PostgreSQL database and displayed as interactive charts on a live results dashboard. The app is designed for students and researchers who want a real-time snapshot of how college students spend their time.

---

## Badges

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Features

- **Take the Survey** — A clean, accessible six-question form that validates every field before submission
- **Live Results Dashboard** — Five interactive Recharts visualizations update in real time as new responses come in
- **Fully Accessible** — Form and navigation meet WCAG 2.1 AA standards including keyboard navigation and screen-reader labels
- **All 50 States Covered** — State-of-origin dropdown includes every U.S. state for nationwide data collection
- **Multi-Select Activities** — Respondents can check all extracurricular activities that apply, producing rich overlap data
- **No Account Required** — Anonymous submissions via Supabase Row Level Security — no login needed to participate or view results
- **Mobile-First Design** — Responsive layout works on phones, tablets, and desktops out of the box
- **Azure-Deployed** — Production build is automatically published to Azure Static Web Apps via GitHub Actions on every push to `main`

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI component library |
| TypeScript 5.9 | Static typing across frontend and backend |
| Vite 6 | Frontend build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | Accessible, pre-built UI components |
| react-hook-form | Form state management and validation |
| Zod | Schema-based input validation |
| Recharts | Charting library for the results dashboard |
| Supabase (PostgreSQL) | Cloud database and anonymous data API |
| @supabase/supabase-js | HTTPS client for direct browser-to-database calls |
| Express 5 | Backend API server (scaffolded; not used in production) |
| Drizzle ORM | Database schema definition and type safety |
| pnpm workspaces | Monorepo package management |
| GitHub Actions | CI/CD pipeline |
| Azure Static Web Apps | Production hosting |

---

## Getting Started

### Prerequisites

| Tool | Version | Link |
|---|---|---|
| Node.js | 24+ | https://nodejs.org |
| pnpm | 10+ | https://pnpm.io/installation |
| Supabase account | — | https://supabase.com |

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Create your Supabase project** at https://supabase.com/dashboard, then copy your Project URL and anon key.

4. **Create the environment file** at `artifacts/survey-app/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. **Set up the database** — Open the Supabase dashboard, go to **SQL Editor**, paste the contents of `supabase-setup.sql`, and click **Run**.

6. **Start the development server**

```bash
pnpm --filter @workspace/survey-app run dev
```

---

## Usage

Open the URL printed in your terminal (e.g. `http://localhost:5173`).

- Click **Take the Survey** to fill out and submit the form
- Click **View Results** to see all aggregated responses as charts
- All data is written to and read from Supabase in real time — no page reload needed after submission

### Configuration Options

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project's REST API URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase project's public anon key |
| `PORT` | No | Dev server port (auto-assigned by Replit; defaults to 3000) |
| `BASE_PATH` | No | URL base path (auto-assigned by Replit; defaults to `/`) |

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD: build and deploy to Azure on push to main
├── artifacts/
│   ├── api-server/                    # Express API server (scaffolded, not used in production)
│   │   └── src/
│   │       └── routes/
│   │           └── survey.ts          # REST endpoints for survey submit and results
│   └── survey-app/                    # React + Vite frontend (the deployed app)
│       ├── public/
│       │   └── staticwebapp.config.json  # Azure client-side routing fallback config
│       ├── src/
│       │   ├── components/
│       │   │   └── layout.tsx         # Shared navigation bar and footer
│       │   ├── lib/
│       │   │   └── supabase.ts        # Supabase JS client initialization
│       │   └── pages/
│       │       ├── home.tsx           # Landing page with CTAs
│       │       ├── survey.tsx         # Six-question survey form with validation
│       │       └── results.tsx        # Results dashboard with five Recharts charts
│       ├── vite.config.ts             # Vite config (compatible with Replit and Azure)
│       └── package.json
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml               # OpenAPI 3.0 spec for the survey API
│   ├── api-client-react/              # Auto-generated React Query hooks from OpenAPI spec
│   ├── api-zod/                       # Auto-generated Zod schemas from OpenAPI spec
│   └── db/
│       └── src/
│           └── schema/
│               └── survey.ts          # Drizzle ORM table schema for survey_responses
├── supabase-setup.sql                 # One-time SQL to create table and RLS policies
├── README.md                          # This file
├── WORKING_NOTES.md                   # Technical decisions, known issues, and deployment log
├── LICENSE                            # MIT License
├── pnpm-workspace.yaml                # pnpm monorepo workspace config
└── package.json                       # Root package — workspace scripts
```

---

## Changelog

### v1.0.0 — 2026-03-29

- Initial release
- Home, Survey, and Results pages fully implemented
- Six accessible survey questions with full form validation
- Five Recharts visualizations on the Results page
- Supabase JS client integrated for direct browser-to-database communication
- Azure Static Web Apps deployment via GitHub Actions
- WCAG 2.1 AA accessibility compliance
- Mobile-first responsive layout

---

## Known Issues / To-Do

- [ ] Results page aggregates all data client-side; performance may degrade with very large response counts (1,000+)
- [ ] No duplicate submission prevention — the same user can submit the survey multiple times
- [ ] The Express API server is scaffolded but unused; it should either be wired up or removed to clean up the repo
- [ ] No loading skeleton on the Results page while Supabase data is fetching
- [ ] Charts do not yet support filtering by year in college or state

---

## Roadmap

- **Response filtering** — Allow users to filter Results charts by academic year, state, or activity
- **Export to CSV** — Add a download button on the Results page to export raw response data
- **Duplicate prevention** — Use browser localStorage or a session token to limit one submission per user
- **Admin dashboard** — Password-protected page to view, filter, and delete individual responses
- **Expanded survey** — Add optional demographic questions (major, GPA range, campus type)

---

## Contributing

This project was created as a course assignment. Contributions, suggestions, and forks are welcome for educational purposes. To contribute:

1. Fork the repository on GitHub
2. Create a new feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `main` branch and describe your changes

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Author

**C. Willcutt**
University of Iowa — Tippie College of Business
BAIS:3300 — Spring 2026

---

## Contact

GitHub: [@your-username](https://github.com/your-username)

---

## Acknowledgements

- [Supabase Docs](https://supabase.com/docs) — for the JavaScript client and Row Level Security guides
- [Recharts](https://recharts.org) — charting library documentation and examples
- [shadcn/ui](https://ui.shadcn.com) — accessible component library
- [Vite](https://vitejs.dev) — build tool and dev server
- [Azure Static Web Apps documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/) — deployment and routing configuration
- [shields.io](https://shields.io) — badge generation
- [Replit](https://replit.com) — cloud development environment
- **Replit AI Agent** — assisted with scaffolding, debugging, and deployment configuration throughout development
