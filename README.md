# FAIE Signup Site

Registration landing page for the **Faculty Advisor for Industry Engagement (FAIE) Workshop** at Oregon State University.

## What This Is

A Next.js landing page hosted on Vercel that collects workshop registration data and submits it to an n8n cloud workflow for processing.

## Architecture

```
                        LOCAL DEV MACHINE
                   ┌──────────────────────────┐
                   │                          │
                   │   Claude Code            │
                   │   (MCP client)           │
                   │        │                 │
                   │        ▼                 │
                   │   n8n-mcp               │
                   │   (MCP server)           │
                   │        │                 │
                   └────────┼─────────────────┘
                            │ n8n REST API
                            ▼
┌──────────────┐    ┌──────────────────┐
│              │    │                  │
│   Vercel     │    │   n8n Cloud      │
│   (hosting)  │    │   (workflows)    │
│              │    │                  │
│  Landing     │───▶│  Webhook         │
│  Page        │POST│  Trigger         │
│              │    │                  │
└──────────────┘    └──────────────────┘
       ▲                    ▲
       │                    │
    GitHub               n8n-mcp
    auto-deploy          manages
    on push              workflows
```

### Flow

1. **User** visits the landing page on Vercel and fills out the registration form
2. **Form** POSTs data to an n8n webhook URL
3. **n8n** receives the data and runs its workflow (logging, email confirmation, IEP generation, etc.)

### Development

- **Claude Code** connects to **n8n-mcp** (local MCP server) as a client
- **n8n-mcp** translates MCP tool calls into n8n REST API requests to manage workflows on **n8n cloud** remotely
- Pushing to **GitHub** triggers **Vercel** to auto-deploy the landing page

## Repo Structure

```
FAIE_Signup_Page_Frontend/   Next.js app (the landing page)
FAIE_N8N_Service/            n8n workflow definitions (reference)
URLs/                        Project bookmarks
```

## Setup

```bash
cd FAIE_Signup_Page_Frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

## Deployment

- **Hosting**: Vercel (Hobby tier) — auto-deploys from `main` branch
- **GitHub**: `jsweet8258/FAIE-Signup-Site` (personal repo)
- **n8n**: `osugenesis.app.n8n.cloud`

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Vercel | n8n webhook URL for form submissions |
