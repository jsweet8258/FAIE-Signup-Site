# Phase 1 — Landing Page (Vercel)

The registration form that faculty see and fill out. This is the entry point of the entire system.

## What it is

A single-page Next.js application hosted on Vercel. A faculty member visits the page, reads about the FAIE Workshop, and submits a registration form. The form collects six fields: name, email, department, research area, goals, and preferred date.

When the user submits, client-side JavaScript sends a POST request to an n8n webhook URL. The landing page has no backend of its own — it is a static page with a form that talks to an external service.

## Where it lives

- **Source code**: `FAIE_Signup_Page_Frontend/` in this repo (do not rename — Vercel deploys from this path)
- **Production URL**: Hosted on Vercel (Hobby tier), auto-deploys from the `main` branch
- **GitHub**: `jsweet8258/FAIE-Signup-Site`

## How to develop it

Claude edits files in `FAIE_Signup_Page_Frontend/`, pushes to GitHub, and Vercel auto-deploys. No MCP server is involved — this is ordinary code-edit-push development.

```bash
cd FAIE_Signup_Page_Frontend
npm install          # first time only
npm run dev          # local dev server on port 3000
npm run build        # verify production build before pushing
```

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) with React 19 and TypeScript 5 |
| UI components | shadcn/ui (new-york style) with Radix UI primitives |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Form handling | React Hook Form + Zod validation |
| Notifications | Radix UI Toast |

## Key files

| File | What it does |
|------|-------------|
| `src/app/page.tsx` | The entire landing page — hero, features, FAQ, form (~630 lines) |
| `src/app/layout.tsx` | Root layout, fonts (Geist, Open Sans), metadata, Toaster |
| `src/components/ui/` | shadcn/ui components (button, input, textarea, label, select, toast) |
| `src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `src/hooks/` | Custom hooks (toast trigger, mobile breakpoint detection) |

Path alias: `@/*` maps to `./src/*`.

## Interface out

The form POSTs to `NEXT_PUBLIC_N8N_WEBHOOK_URL`, an environment variable set in Vercel. This is the boundary between Phase 1 and Phase 2. The landing page knows nothing about what happens after the POST — it shows a success or error toast based on the HTTP response, and that's it.

## Conventions

- All components use the `'use client'` directive (client-side rendering)
- OSU brand color `#D73F09` is used inline in styles
- ESLint is intentionally permissive (most strict rules disabled)
- `next.config.ts` ignores TypeScript build errors to avoid blocking deploys during rapid iteration

## How to replicate this for a different project

1. Create a new Next.js app with `npx create-next-app@latest`
2. Install shadcn/ui (`npx shadcn-ui@latest init`) and add the components you need
3. Build your form, wire it to POST to a webhook URL via an environment variable
4. Deploy to Vercel, connect your GitHub repo, and set the env var in the Vercel dashboard
5. Every push to `main` auto-deploys — no CI/CD configuration needed
