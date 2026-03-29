# FAIE Signup Site — Implementation Plan

## Context

This system has five phases (see README.md). Phase 1 (frontend) is complete and deployed. Phases 2 and 3 are partially built but not connected. The goal is to wire every interface so that a faculty member submits the form on Vercel and their registration arrives in a Notion CRM — with no manual steps in between. Once that write pipeline is proven (Phase 4), Phase 5 adds a read interface: on-demand RSVP lists for each workshop session.

## Current State by Phase

### Phase 1 — Frontend (Vercel) — DONE

- Landing page is deployed and live on Vercel
- Form collects `name`, `email`, `department`, `researchArea`, `goals`, `preferredDate`
- Form POSTs to `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- **Gap**: The env var is not set in Vercel, so form submissions go nowhere

### Phase 2 — Workflow Engine (n8n Cloud) — PARTIAL

- Template workflow exists on `osugenesis.app.n8n.cloud` (`9vWdyVxZfeMmHMlW`)
- n8n-mcp is configured in `.claude/n8n-mcp.json` with API key
- **Gaps**:
  - MCP connectivity unverified (Claude Code may need restart to pick up MCP config)
  - Code node expects wrong fields (`businessName`, `message`, `timeline`, `budget` instead of the form's actual schema)
  - Notion node is unconfigured (no database ID, no field mapping)
  - Workflow is inactive (webhook endpoint not live)

### Phase 3 — CRM (Notion) — SCAFFOLDING ONLY

- Notion integration "TT3OC" created in AI@DRI Learning Space with read + update content capabilities
- **Gaps**:
  - `@notionhq/notion-mcp-server` not yet configured in `.claude/`
  - `NOTION_API_TOKEN` not yet stored
  - Registration database does not exist yet
  - n8n's own Notion credentials are not connected to TT3OC (n8n needs its own Notion integration for production writes; TT3OC is for Claude's development-time access)

### Phase 4 — Runtime — NOT YET POSSIBLE

All three upstream phases must be connected before the runtime pipeline works.

### Phase 5 — RSVP Reporting — NOT STARTED

Depends on Phase 4 being proven. Cannot begin until registrations are flowing into the Notion database. See `Architecture/3-CRM-Notion/RSVP-Reporting.md` for the design.

---

## Plan

The phases must be wired in dependency order. Phase 3 (Notion CRM) comes before Phase 2 (n8n workflow) because the workflow's Notion node needs a database to write to.

### Step 1: Stand up the Notion MCP bridge

**Phase 3 — development interface**

Configure the notion-mcp server so Claude can create and manage Notion resources directly.

1. Add `NOTION_API_TOKEN` (from the TT3OC integration secret) to `.claude/` config
2. Add `@notionhq/notion-mcp-server` entry to the MCP config alongside the existing n8n-mcp entry
3. Restart Claude Code to pick up the new MCP server
4. Verify connectivity: list accessible pages/databases in AI@DRI Learning Space

### Step 2: Create the registration database in Notion

**Phase 3 — CRM structure**

Use notion-mcp to create the FAIE Registration database with these properties:

```
┌─────────────────┬───────────┬────────────────────────────────────────────────┐
│ Property        │ Type      │ Notes                                          │
├─────────────────┼───────────┼────────────────────────────────────────────────┤
│ Name            │ Title     │ Faculty member's name                          │
│ Email           │ Email     │ Contact email                                  │
│ Department      │ Select    │ OSU department                                 │
│ Research Area   │ Rich text │ Free-form research description                 │
│ Goals           │ Rich text │ What they hope to get from the workshop        │
│ Preferred Date  │ Date      │ Preferred workshop session                     │
│ Submitted At    │ Date      │ Timestamp from form submission                 │
│ Status          │ Select    │ Registration status (New, Confirmed, etc.)     │
└─────────────────┴───────────┴────────────────────────────────────────────────┘
```

Confirm the database is shared with the TT3OC integration (required for Claude visibility) and with whatever Notion integration n8n uses for production writes.

### Step 3: Verify n8n MCP connectivity

**Phase 2 — development interface**

1. Use n8n-mcp tools to list workflows on `osugenesis.app.n8n.cloud`
2. Confirm we can read/update the template workflow (`9vWdyVxZfeMmHMlW`)
3. If MCP isn't working, fall back to manual n8n API calls or guide through the n8n UI

### Step 4: Rewrite the n8n Code node

**Phase 2 — fix the schema mismatch**

The existing "Parse + Clean Lead Data" node expects the wrong fields. Rewrite it to match the frontend's form schema:

```js
const { name, email, department, researchArea, goals, preferredDate } = item.json.body;
return {
  json: {
    name,
    email,
    department,
    researchArea: researchArea || '',
    goals: goals || '',
    preferredDate,
    submittedAt: new Date().toISOString()
  }
};
```

### Step 5: Configure the n8n Notion node

**Phase 2 → Phase 3 interface**

This is the critical bridge between the workflow engine and the CRM. Using the database created in Step 2:

1. Set the Notion database ID in the workflow's Notion node
2. Map parsed fields to database properties (name → Name, email → Email, etc.)
3. Ensure n8n has its own Notion credentials configured for this database (this is separate from TT3OC — n8n needs its own integration token for production writes)

### Step 6: Activate the workflow and capture the webhook URL

**Phase 2 → Phase 1 interface**

1. Activate the workflow via n8n-mcp so the webhook endpoint goes live
2. Capture the production webhook URL that n8n generates

### Step 7: Set the webhook URL in Vercel

**Phase 1 — close the loop**

1. Set `NEXT_PUBLIC_N8N_WEBHOOK_URL` in Vercel project environment variables to the URL from Step 6
2. Trigger a redeploy (push a commit or manual redeploy in Vercel dashboard)
3. Remove the `// TODO: Replace with n8n webhook URL` comment in `page.tsx`

### Step 8: Save workflow snapshot

**Phase 2 — archival**

Export the finalized workflow JSON from n8n Cloud and save it to `Architecture/2-Workflow-Engine-n8n/Workflow-Snapshots/`. This is the documentary record of what the live workflow looks like at the point it was proven to work end-to-end.

### Step 9: End-to-end test

**Phase 4 — prove the runtime pipeline**

(Run this before and after Step 8 — first to prove the pipeline works, then to confirm the snapshot didn't introduce regressions.)

1. Submit a test registration on the live Vercel site
2. Verify the n8n workflow triggers (check execution log)
3. Verify the record appears in the Notion database
4. Confirm the success toast shows on the frontend
5. Submit a second test with edge cases (empty optional fields, long text) to verify parsing

### Step 10: Build RSVP reporting views

**Phase 5 — read interface on the CRM**

Once the end-to-end pipeline is proven and real registrations are accumulating in Notion, use notion-mcp to create database views that let administrators generate RSVP lists:

1. Create a "By Session Date" filtered view — select a preferred date, see everyone who signed up for that session
2. Create an "All Registrations" view sorted by submission date
3. Create any additional views that emerge from actual usage (by department, by status, etc.)

This step should be done against real data, not empty schemas — views are best designed when you can see what the data actually looks like.

---

## Blockers / Decisions Needed

1. **Notion API token**: Need the TT3OC integration secret stored in `.claude/` before Step 1 can begin
2. **n8n Notion credentials**: n8n Cloud needs its own Notion integration for production writes. Is there an existing n8n-to-Notion connection on osugenesis.app.n8n.cloud, or does one need to be created?
3. **Database location**: Where in the AI@DRI Learning Space should the registration database live? Top level, or under a specific page?
4. **Email confirmation**: The landing page says "We'll send you workshop details via email soon." Should an email node be added to the n8n workflow now, or deferred to a later iteration?
5. **MCP restart**: Claude Code needs to be restarted after MCP config changes to pick up new servers. Plan accordingly around Steps 1 and 3.

## What Gets Modified Where

```
┌──────────────────────────────┬────────────────────────────────────────┬─────────────────────────┬──────┐
│ Resource                     │ Location                               │ How Claude reaches it   │ Step │
├──────────────────────────────┼────────────────────────────────────────┼─────────────────────────┼──────┤
│ MCP config                   │ .claude/ (local, gitignored)           │ Direct file edit        │ 1    │
│ Registration database        │ Notion (AI@DRI Learning Space)         │ notion-mcp              │ 2    │
│ n8n workflow (Code node)     │ n8n Cloud (remote)                     │ n8n-mcp                 │ 4    │
│ n8n workflow (Notion node)   │ n8n Cloud (remote)                     │ n8n-mcp                 │ 5    │
│ n8n workflow (activation)    │ n8n Cloud (remote)                     │ n8n-mcp                 │ 6    │
│ Vercel env var               │ Vercel dashboard (manual)              │ Browser / Vercel CLI    │ 7    │
│ page.tsx TODO comment        │ Local repo → git push                  │ Direct file edit        │ 7    │
│ Notion database views        │ Notion (AI@DRI Learning Space)         │ notion-mcp              │ 10   │
└──────────────────────────────┴────────────────────────────────────────┴─────────────────────────┴──────┘
```
