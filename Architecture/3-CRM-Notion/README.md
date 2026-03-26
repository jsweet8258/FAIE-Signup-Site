# Phase 3 — CRM (Notion)

The registration database where faculty sign-ups are stored and managed. This is the final destination of the data pipeline.

## What it is

A Notion database in the **AI@DRI Learning Space** workspace. Each row represents one faculty registration. The n8n workflow (Phase 2) writes new rows here automatically when a form submission arrives. Project administrators read and manage the registrations directly in Notion.

## Where it lives

- **Workspace**: AI@DRI Learning Space on Notion
- **Database**: FAIE Registration (to be created — see `Control/IMPLEMENTATION_PLAN.md`, Step 2)

## How to develop it

Claude will shape the Notion database through the **@notionhq/notion-mcp-server** — a local MCP server that translates Claude's tool calls into Notion API requests. Same pattern as the n8n bridge, different target.

| Component | Status |
|-----------|--------|
| Notion integration (TT3OC) | Created — internal integration with read + update content capabilities |
| `@notionhq/notion-mcp-server` | Not yet configured in `.claude/` |
| `NOTION_API_TOKEN` | Not yet stored |
| Registration database | Not yet created |

Once the MCP server is configured, Claude can:

- Create the database and define its properties
- Adjust the schema as needs evolve (add columns, change types)
- Query records for testing and verification
- Update entries programmatically

## Database schema (planned)

| Property | Type | Notes |
|----------|------|-------|
| Name | Title | Faculty member's name |
| Email | Email | Contact email |
| Department | Select | OSU department |
| Research Area | Rich text | Free-form research description |
| Goals | Rich text | What they hope to get from the workshop |
| Preferred Date | Date | Preferred workshop session |
| Submitted At | Date | Timestamp from form submission |
| Status | Select | Registration status (New, Confirmed, etc.) |

## Two Notion integrations, two purposes

The Notion database has two consumers, and each needs its own integration:

1. **TT3OC** (Claude's development-time access) — Used via notion-mcp to create and shape the database. This is the integration whose secret becomes the `NOTION_API_TOKEN` in `.claude/`.

2. **n8n's Notion credentials** (production-time access) — Used by the n8n workflow to write new rows when form submissions arrive. This is configured inside n8n Cloud, not in this repo.

Both integrations must be connected to the database (Notion page menu → Add connections → select integration). If an integration isn't connected to a specific page or database, it can't see or modify it, even with a valid token.

## Interface in

Notion API calls from two sources:

- **Production**: The n8n workflow's Notion node creates a new page (row) for each form submission
- **Development**: Claude via notion-mcp creates and modifies the database structure

## How to replicate this for a different project

1. Create a Notion workspace (or use an existing one)
2. Create an internal integration at notion.so/profile/integrations — give it read + update content capabilities
3. Install `@notionhq/notion-mcp-server` and configure it in your Claude Code MCP settings with the integration token
4. Tell Claude to create a database with the properties you need — Claude does this via natural language commands that become Notion API calls
5. Connect the integration to the database (page menu → Add connections)
6. If another service also writes to the database (like n8n), create a separate integration for it and connect that too
