# AppGenieX — Natural Language → Code

![CI](https://github.com/nihal07g/AppGenieX-Natural-Language-to-Applications/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/Stack-React%20(Vite)%20%7C%20Express%20%7C%20FastAPI-00a)

Convert natural language into working apps — React (Vite) + Express + Python FastAPI ML, powered by Gemini 2.5-flash.

AppGenieX is a multi-service toolkit that turns natural-language app descriptions into code using Google Gemini (2.5-flash). It includes:
- Frontend: React 18 (Vite) + Tailwind CSS (JavaScript only)
- Backend: Node.js (Express) — server-side Gemini calls only
- ML Service: Python FastAPI — lightweight analysis/metrics
- Quality: ESLint + Prettier (JS), black + ruff (Python)

No database or auth required to run. Optional stubs are provided with clear TODOs.

## Prerequisites
- Node.js 18+
- npm 9+
- Python 3.10+
- pip

## Quick Start
1) Copy environment examples and set your values

- Root/Backend envs (root `.env` and `backend/.env` both supported):
```
GOOGLE_GENERATIVE_AI_API_KEY=<replace>
GEMINI_API_KEY=<optional fallback>
GOOGLE_AI_API_KEY=<optional fallback>
PORT=5000
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

- Frontend (`frontend/.env`):
```
VITE_BACKEND_URL=http://localhost:5000
```

- ML Service (`ml-service/.env`):
```
PYTHONUNBUFFERED=1
```

2) Install and run everything

```
npm install
npm run dev
```

This starts:
- Frontend at http://localhost:5173
- Backend at http://localhost:5000
- ML Service at http://localhost:5001

Open http://localhost:5173 and try a prompt.

## Services

- Frontend (Vite + Tailwind):
  - Clean UI with Prompt, FileTree, LivePreview, and Quality Panel.
  - No API keys in the client. Uses `VITE_BACKEND_URL` to talk to the backend.

- Backend (Express):
  - Proxies all calls to Google Gemini. Keys are read from env only.
  - Endpoints return JSON with `{ ok: boolean, data, error }`.
  - Routes:
    - POST `/api/generate-code` — generate files from a prompt
    - POST `/api/modify-code` — patch existing files from a feature request
    - GET/POST `/api/projects` — in-memory stub
    - POST `/api/feedback` — in-memory stub
    - POST `/api/package-zip` — returns a ZIP of provided files
    - GET `/health` — health check

- ML Service (FastAPI):
  - GET `/health` — health check
  - POST `/analyze` — returns naive metrics (complexity, maintainability, size)
  - CORS only allows backend origin.

## Features
- Natural language → code generation (client-only React, full-stack React+Express, or Streamlit)
- Safe server-side Gemini calls (no keys on client)
- Quality metrics via FastAPI service
- Live sandbox preview for client-only templates
- Download result as a ZIP

## Development

Useful root scripts:
- `npm run dev` — run frontend, backend, and ML service concurrently
- `npm run lint` — run linters across all services
- `npm run format` — format all services
- `npm run test` — run tests (Python ML tests included)

You can also run per-service scripts, e.g.:
```
npm --prefix backend run dev
npm --prefix frontend run dev
npm --prefix ml-service run dev
```

## Environment Variables
Documented in `.env.example` files in root, `frontend/`, `backend/`, and `ml-service/`.

- Backend key precedence: `GOOGLE_GENERATIVE_AI_API_KEY` → `GEMINI_API_KEY` → `GOOGLE_AI_API_KEY`.
- Frontend must only call `VITE_BACKEND_URL`.

## Live Preview
- Client-only templates render in a sandboxed iframe using CDN React + Tailwind.
- Full-stack templates show run instructions (not previewed inline).
- Streamlit templates show run instructions.

## Monorepo Layout
See the full tree in the repository. Top-level structure:

appgeniex/
- frontend/ — React 18 (Vite) + Tailwind (JS)
- backend/ — Node.js 18+ Express API (JS)
- ml-service/ — Python FastAPI (analysis)
- scripts/ — dev helper
- .github/ — CI and templates
- docs/ — demo assets (placeholders)

## Architecture
See docs/architecture.png (placeholder) for a high-level diagram.

## Troubleshooting
- Port in use: change the port in corresponding `.env` or config.
- Invalid API key: ensure a valid key in `.env`. The backend will fall back to deterministic templates if the AI call fails or no key is provided.
- CORS: Backend allows `http://localhost:5173`. ML service allows only `http://localhost:5000` (change via env/service config if needed).
- No secrets in browser: All AI calls happen on the backend. The client only talks to `VITE_BACKEND_URL`.

## Optional Stubs
- Supabase (Auth/Storage): TODOs and placeholders are in backend routes for future integration, but not required to run.

## Scripts
- Root: `npm install`, `npm run dev`, `npm run lint`, `npm run format`, `npm run test`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`
- Backend: `npm run dev`, `npm run start`
- ML Service: `npm run dev`, `npm run test`

## Security
- Keys live ONLY in `backend/.env`. Never commit secrets.
- Backend proxies all AI calls.

## Roadmap
- Template library expansion
- Optional Supabase integration (auth/storage)
- Project persistence

## Contributing
Please see CONTRIBUTING.md and CODE_OF_CONDUCT.md. PRs welcome!

## License
MIT © 2025 Nihal (nihal07g)