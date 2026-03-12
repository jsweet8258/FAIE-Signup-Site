# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FAIE Signup Site — a Next.js 16 landing page for registering OSU faculty for the Foundation for AI Excellence (FAIE) Workshop. Hosted on Vercel. Form submissions are sent to an n8n cloud webhook (TBD).

### Repo structure

- `FAIE_Signup_Page_Frontend/` — Next.js app (registration site)
- `FAIE_N8N_Service/` — n8n workflow definitions (reference)
- `URLs/` — Project bookmarks (GitHub, Vercel, Notion)

## Commands

All commands should be run from the `FAIE_Signup_Page_Frontend/` directory:

```bash
cd FAIE_Signup_Page_Frontend
npm install              # Install dependencies
npm run dev              # Dev server on port 3000
npm run build            # Production build
npm run start            # Run production server
npm run lint             # ESLint
```

No test framework is configured. No database — form data goes to n8n.

## Architecture

- **Framework**: Next.js 16 App Router with React 19 and TypeScript 5
- **UI**: shadcn/ui (new-york style) with Tailwind CSS 4, Radix UI primitives, Lucide icons
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel (Hobby tier, personal repo under jsweet8258)
- **Backend**: n8n cloud webhook receives form submissions (env var: `NEXT_PUBLIC_N8N_WEBHOOK_URL`)

### Key paths

- `FAIE_Signup_Page_Frontend/src/app/page.tsx` — Main landing page with registration form (single-page app)
- `FAIE_Signup_Page_Frontend/src/components/ui/` — shadcn/ui components (button, input, textarea, label, select, toast, toaster)
- `FAIE_Signup_Page_Frontend/src/lib/utils.ts` — `cn()` class merge utility
- `FAIE_Signup_Page_Frontend/src/hooks/` — Custom React hooks (toast, mobile detection)

### Path alias

`@/*` maps to `./src/*` (configured in `FAIE_Signup_Page_Frontend/tsconfig.json`).

## Conventions

- Client components use `'use client'` directive
- OSU brand color: `#D73F09` (used inline in styles)
- ESLint config is intentionally permissive (most strict rules disabled)
- `next.config.ts` ignores TypeScript build errors and disables strict mode
