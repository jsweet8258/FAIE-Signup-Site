# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FAIE Signup Site — a registration system for the Faculty Advisor for Industry Engagement (FAIE) Workshop at Oregon State University. Faculty fill out a form on Vercel; their registration lands in a Notion CRM. Between those endpoints, data crosses three system boundaries, each of which Claude develops through a dedicated interface.

The documentation in this repo is load-bearing, not decorative. The live system is a set of hosted services connected by URLs and API keys — without the architectural documentation, MCP bridge designs, and implementation plan, the system would be opaque and brittle. Treat every document as part of the system's resilience layer. See "Why the Documentation Is the System" in README.md for the full rationale.

## The Five Phases

This project is not a single application. It is four services connected at well-defined interfaces, plus a reporting layer that reads from the CRM. Claude touches each one differently.

### Phase 1 — Frontend (code → git push → Vercel auto-deploy)

Edit the Next.js app. Push to GitHub. Vercel pulls and deploys. No MCP.

- **Stack**: Next.js 16 App Router, React 19, TypeScript 5, shadcn/ui, Tailwind CSS 4, Radix UI, Lucide icons
- **Forms**: React Hook Form + Zod validation
- **Entry point**: `FAIE_Signup_Page_Frontend/src/app/page.tsx` (single-page app with registration form)
- **UI components**: `FAIE_Signup_Page_Frontend/src/components/ui/` (shadcn/ui)
- **Utilities**: `FAIE_Signup_Page_Frontend/src/lib/utils.ts` (`cn()` class merge)
- **Hooks**: `FAIE_Signup_Page_Frontend/src/hooks/` (toast, mobile detection)
- **Path alias**: `@/*` → `./src/*`
- **Interface out**: Form POSTs to `NEXT_PUBLIC_N8N_WEBHOOK_URL`

### Phase 2 — Workflow Engine (Claude → n8n-mcp → n8n Cloud)

Claude shapes n8n workflows programmatically through the **n8n-mcp** server. The MCP server translates tool calls into n8n REST API requests.

- **n8n instance**: `osugenesis.app.n8n.cloud`
- **MCP config**: `.claude/n8n-mcp.json` (gitignored; contains API key)
- **What Claude does here**: Create/update workflows, configure nodes, activate/deactivate webhooks
- **Reference copies**: Workflow JSON saved to `Architecture/2-Workflow-Engine-n8n/Workflow-Snapshots/` after significant changes
- **Companion repo**: n8n-mcp itself is third-party (`czlonkowski/n8n-mcp`); local clone at `/Users/jsweet/Documents/GitHub/n8n-mcp`
- **Interface in**: HTTPS POST from the Vercel form
- **Interface out**: Notion API call to write registration to CRM

See `Architecture/2-Workflow-Engine-n8n/Claude-n8n-MCP-Bridge.md` for the full design of this bridge.

### Phase 3 — CRM (Claude → notion-mcp → Notion)

Claude will shape the Notion CRM database through the **@notionhq/notion-mcp-server**. Same MCP pattern as n8n: local server, Notion API token, Claude issues natural-language commands that become API calls.

- **Workspace**: AI@DRI Learning Space
- **Integration**: TT3OC (internal integration, read + update content)
- **MCP server**: `@notionhq/notion-mcp-server` (npm package, not yet configured)
- **What Claude will do here**: Create the registration database, define properties (Name, Email, Department, Research Area, Goals, Preferred Date, Submitted At), query records, adjust schema as needs evolve
- **Status**: Integration created in Notion; MCP server config pending in `.claude/`

### Phase 4 — Runtime (no Claude, no MCP, no local machine)

The production pipeline once all development is wired:

```
Faculty member → Vercel form → n8n webhook → Notion CRM
```

No development tools involved. The three services communicate over HTTPS autonomously.

### Phase 5 — RSVP Reporting (read interface on the CRM)

Once the pipeline is proven and registrations are accumulating, build Notion database views that let administrators generate on-demand RSVP lists filtered by workshop session date.

- **What Claude does here**: Create filtered/sorted/grouped database views via notion-mcp
- **No new services**: This is a read interface on the existing Phase 3 database
- **Depends on**: Phases 3 and 4 complete (database must exist and be receiving data)

See `Architecture/3-CRM-Notion/RSVP-Reporting.md` for the full design.

## Repo Structure

```
FAIE_Signup_Page_Frontend/          Phase 1 live code (do not rename — Vercel deployment target)
Architecture/
  1-Landing-Page-Vercel/            Phase 1 documentation
  2-Workflow-Engine-n8n/            Phase 2 documentation + workflow snapshots
    Claude-n8n-MCP-Bridge.md        n8n MCP bridge architecture
    Workflow-Snapshots/              Archival workflow JSON exports
  3-CRM-Notion/                     Phase 3 + Phase 5 documentation
    Claude-Notion-MCP-Bridge.md      Notion MCP bridge architecture
    RSVP-Reporting.md                Phase 5: RSVP list generation
Control/
  IMPLEMENTATION_PLAN.md            Step-by-step wiring plan
  URLs/                             Project bookmarks
  z-obsolete/                       Retired control files
  Systems-Knowledge/                Knowledge architecture standards
    knowledge-architecture-guidelines.md
    STYLE_GUIDE_Markdown.md
    Project-Exceptions.md
```

## Commands

All commands run from `FAIE_Signup_Page_Frontend/`:

```bash
npm install              # Install dependencies
npm run dev              # Dev server on port 3000
npm run build            # Production build
npm run start            # Run production server
npm run lint             # ESLint
```

No test framework is configured. No local database — form data flows to n8n, then to Notion.

## Conventions

- Client components use `'use client'` directive
- OSU brand color: `#D73F09` (used inline in styles)
- ESLint config is intentionally permissive (most strict rules disabled)
- `next.config.ts` ignores TypeScript build errors and disables strict mode

## MCP Servers

| Server | Purpose | Status |
|--------|---------|--------|
| `n8n-mcp` | Manage n8n workflows on osugenesis.app.n8n.cloud | Configured in `.claude/n8n-mcp.json` |
| `@notionhq/notion-mcp-server` | Manage Notion CRM in AI@DRI Learning Space | Integration (TT3OC) created; MCP config pending |

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Vercel | n8n webhook URL for form submissions |
| `N8N_API_KEY` | `.claude/n8n-mcp.json` | n8n REST API access |
| `NOTION_API_TOKEN` | `.claude/` (pending) | Notion API access |

## Systems knowledge standard

All systems integration work follows the knowledge architecture standard defined in `Control/Systems-Knowledge/`. The entry point is `Control/Systems-Knowledge/knowledge-architecture-guidelines.md`.

- **`Control/Systems-Knowledge/knowledge-architecture-guidelines.md`** defines how to structure a project so that its operational understanding is transferable: repo organization (Architecture/, Control/, live code), README orientation, subsystem documentation for replication, interface scorecards, and the greenfield/retrofit procedure.
- **`Control/Systems-Knowledge/STYLE_GUIDE_Markdown.md`** defines formatting conventions for all Markdown files: ATX headings, no hard-wrap, Unicode box tables, fenced code blocks with language tags.
- **`Control/Systems-Knowledge/Project-Exceptions.md`** records project-specific overrides to the standards above. This file is owned by the project, not the template.

**Standing directive:** When building, extending, or documenting any system in this project, Claude applies the knowledge architecture guidelines. Every system must have documentation that is load-bearing infrastructure, not a supplement. Document the *why*, not just the *what* or *how*: design rationale, dependency order, tradeoffs, and the constraints that shaped the architecture. The project is not done when the system works; it is done when someone who has never seen it can read the documentation and understand it well enough to maintain it, extend it, or replicate it from scratch. Before acting on an instruction, give a brief first-principles reflection: verify the reasoning holds, and say so directly if an instruction conflicts with another directive or rests on a flawed assumption.

Key principles (see knowledge-architecture-guidelines.md for the full set):

1. **Separate architecture from operations from code.** Architecture/ teaches. Control/ governs. Live code runs. Do not mix them.
2. **Orient before you explain.** A reader should know within thirty seconds what a system is, whether it works, and where to look for depth.
3. **Document for replication.** If the documentation does not teach someone to rebuild the subsystem from scratch, it teaches operation, not understanding.
4. **State the why.** Knowing how enables operation. Knowing why enables understanding. Both are required.
5. **The written requirement.** The builder owes a duty to externalize what they learned. A system that ships without teaching what the builder understood is incomplete.
6. **First-principles reflection.** Before acting on a directive, verify that its reasoning holds. If it does not, say so directly.
