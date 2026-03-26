# FAIE Signup Site

Registration and CRM system for the **Faculty Advisor for Industry Engagement (FAIE) Workshop** at Oregon State University.

## What This Is

A registration system built from distinct services that Claude Code shapes through dedicated development interfaces. A faculty member fills out a form; their registration lands in a Notion CRM; administrators generate RSVP lists on demand. Between those endpoints, data crosses system boundaries, each of which Claude develops and maintains through its own channel.

This repo is primarily documentary, secondarily functional. The live system is distributed across Vercel, n8n Cloud, and Notion — three services that talk to each other over HTTPS with no local processes involved. We pull archival copies of all components here, along with teaching and reference material, so that anyone can read this repo and learn how to replicate the entire system in their own context.

## Current Status

**The end-to-end system is not yet working.** Phase 1 (the landing page) is live. The remaining interfaces are in various stages of scaffolding. See the interface scorecard below for the exact state of each connection.

```
┌────────────────────────────────────┬────────────────────────┬────────────────────────────┬───────────────────────────────────────────┐
│ Interface                          │ Dev-time               │ Production                 │ Status                                    │
├────────────────────────────────────┼────────────────────────┼────────────────────────────┼───────────────────────────────────────────┤
│ Claude → GitHub → Vercel           │ git push               │ auto-deploy on push        │ WORKING                                   │
│ Vercel → n8n (webhook POST)        │ —                      │ form submits to webhook    │ Not wired (env var unset)                 │
│ Claude → n8n (MCP bridge)          │ n8n-mcp                │ —                          │ Configured, unverified                    │
│ n8n → Notion (workflow write)      │ —                      │ Notion node creates row    │ Not wired (no DB, no node config)         │
│ Claude → Notion (MCP bridge)       │ notion-mcp             │ —                          │ Integration created, MCP not configured   │
│ Notion CRM (the resource)          │ Claude defines schema  │ n8n writes, humans read    │ Does not exist yet                        │
│ Notion RSVP views (reporting)      │ Claude creates views   │ administrators read        │ Not started (depends on working pipeline) │
└────────────────────────────────────┴────────────────────────┴────────────────────────────┴───────────────────────────────────────────┘
```

For the step-by-step plan to wire the remaining interfaces, see `Control/IMPLEMENTATION_PLAN.md`.

## Architecture

The system has four phases. Each phase is a separate service with its own hosting, its own runtime, and its own interface for development.

```
  DEVELOPMENT TIME                              PRODUCTION RUNTIME
  (Claude Code on local machine)                (no local processes involved)

  ┌─────────────────────────────┐
  │                             │
  │  1. git push                │               User visits Vercel landing page
  │     Claude edits code,      │               and submits registration form
  │     pushes to GitHub        │                        │
  │            │                │                        │ HTTPS POST
  │            ▼                │                        ▼
  │       GitHub ──auto-deploy──┼──────────►  Vercel (landing page)
  │                             │                        │
  │  2. n8n-mcp                 │                        │ POST to webhook
  │     Claude shapes           │                        ▼
  │     workflow via MCP ───────┼──────────►  n8n Cloud (workflow engine)
  │                             │             osugenesis.app.n8n.cloud
  │  3. notion-mcp              │                        │
  │     Claude shapes           │                        │ Notion API
  │     CRM via MCP ────────────┼──────────►  Notion (CRM database)
  │                             │             AI@DRI Learning Space
  └─────────────────────────────┘
```

### Phase 1 — Frontend (Code → GitHub → Vercel)

Claude edits the Next.js app locally. Pushing to GitHub triggers Vercel to auto-deploy. No MCP involved — this is ordinary code-edit-push development.

- **What lives here**: Landing page with hero, workshop details, FAQ, and registration form
- **Interface out**: The form POSTs to an n8n webhook URL (configured via `NEXT_PUBLIC_N8N_WEBHOOK_URL` in Vercel)

### Phase 2 — Workflow Engine (Claude → n8n-mcp → n8n Cloud)

Claude connects to n8n Cloud through the **n8n-mcp** server (local MCP, runs as a subprocess). Claude can create workflows, update node configurations, activate/deactivate — all programmatically via the n8n REST API.

- **What lives here**: A webhook-triggered workflow that receives form data, parses it, and ships it to Notion
- **Interface in**: HTTPS POST from the Vercel-hosted form
- **Interface out**: Notion API call to write a row to the CRM database
- **Reference copy**: Workflow JSON snapshots are saved to `Architecture/2-Workflow-Engine-n8n/Workflow-Snapshots/`

### Phase 3 — CRM (Claude → notion-mcp → Notion)

Claude will connect to Notion through the **@notionhq/notion-mcp-server** (local MCP, same pattern as n8n-mcp). Claude can create databases, define properties, add pages, and query records — all programmatically via the Notion API.

- **What lives here**: A registration database in the AI@DRI Learning Space workspace
- **Interface in**: Notion API calls from the n8n workflow (production) and from Claude via notion-mcp (development)
- **Notion integration**: TT3OC (internal integration with read + update content capabilities)
- **Status**: Integration created; MCP server not yet configured in this project

### Phase 4 — Runtime (no development tools involved)

Once all three development phases are wired up, the production pipeline runs without any local processes:

```
Faculty member → Vercel form → n8n webhook → Notion CRM
```

No MCP servers, no local machine, no Claude involvement. The three services talk to each other over HTTPS.

### Phase 5 — RSVP Reporting (read interface on the CRM)

Once the write pipeline is proven and registrations are flowing into Notion, we build filtered database views so administrators can generate on-demand lists of faculty who have RSVP'd for each workshop session. This is a read interface on the same Notion database — no new services, just Notion views created via notion-mcp.

See `Architecture/3-CRM-Notion/RSVP-Reporting.md` for the full design.

## Repo Structure

```
FAIE_Signup_Page_Frontend/          Phase 1 LIVE CODE — do not rename (Vercel deployment target)

Architecture/
  1-Landing-Page-Vercel/            Phase 1 documentation
  2-Workflow-Engine-n8n/            Phase 2 documentation + archival workflow JSON
    Claude-n8n-MCP-Bridge.md        How Claude reaches n8n via MCP
    Workflow-Snapshots/              Exported workflow JSON at significant milestones
  3-CRM-Notion/                     Phase 3 + Phase 5 documentation
    Claude-Notion-MCP-Bridge.md      How Claude reaches Notion via MCP
    RSVP-Reporting.md                Phase 5: on-demand RSVP list generation

Control/                            Operational control files
  IMPLEMENTATION_PLAN.md            Step-by-step wiring plan
  URLs/                             Project bookmarks (GitHub, Vercel, Notion)
  z-obsolete/                       Retired control files
```

This repo is primarily documentary, secondarily functional. The live system is distributed across Vercel, n8n Cloud, and Notion. We pull archival copies of all components here — along with teaching and reference material — so that anyone can read this repo and learn how to replicate the entire system in their own context.

## Setup

```bash
cd FAIE_Signup_Page_Frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

## Deployment

```
┌─────────────────┬──────────────────────────────────────────────┬───────────────────────────────────────────┐
│ Service         │ Host                                         │ How Claude reaches it                      │
├─────────────────┼──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ Frontend        │ Vercel (Hobby tier, auto-deploys from main)  │ git push                                  │
│ Workflow engine │ n8n Cloud (osugenesis.app.n8n.cloud)         │ n8n-mcp (local MCP server)                │
│ CRM             │ Notion (AI@DRI Learning Space)               │ notion-mcp (local MCP server, setup pending) │
│ Source          │ GitHub (jsweet8258/FAIE-Signup-Site)          │ git push                                  │
└─────────────────┴──────────────────────────────────────────────┴───────────────────────────────────────────┘
```

## Environment Variables

```
┌───────────────────────────────┬──────────────────────────────────┬────────────────────────────────────┐
│ Variable                      │ Where                            │ Purpose                            │
├───────────────────────────────┼──────────────────────────────────┼────────────────────────────────────┤
│ NEXT_PUBLIC_N8N_WEBHOOK_URL   │ Vercel                           │ n8n webhook URL for form submissions │
│ N8N_API_KEY                   │ .claude/n8n-mcp.json (gitignored)│ n8n REST API access for MCP        │
│ NOTION_API_TOKEN              │ .claude/ (gitignored, pending)   │ Notion API access for MCP          │
└───────────────────────────────┴──────────────────────────────────┴────────────────────────────────────┘
```
