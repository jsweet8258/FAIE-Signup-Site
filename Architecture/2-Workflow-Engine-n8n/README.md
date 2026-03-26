# Phase 2 — Workflow Engine (n8n Cloud)

The middleware that receives form submissions and routes them to the CRM. This is the processing layer between the public-facing form and the internal database.

## What it is

An n8n workflow running on n8n Cloud (`osugenesis.app.n8n.cloud`). It exposes a webhook endpoint that the landing page POSTs to. When data arrives, the workflow parses the form fields, validates them, and writes a new record to a Notion database (Phase 3).

n8n is a workflow automation platform — think of it as a visual programming environment where you connect nodes (webhook trigger, code transform, API call, etc.) into a pipeline. Each node does one thing and passes its output to the next.

## Where it lives

- **Runtime**: n8n Cloud at `osugenesis.app.n8n.cloud` (the live workflow)
- **Archival snapshots**: `Workflow-Snapshots/` in this directory (JSON exports of the workflow at significant milestones)
- **Companion repo**: The MCP bridge tool (`n8n-mcp`) is cloned at `/Users/jsweet/Documents/GitHub/n8n-mcp` — see [Claude-n8n-MCP-Bridge.md](Claude-n8n-MCP-Bridge.md) for details

## How to develop it

Claude shapes the workflow programmatically through the **n8n-mcp** server. This is a local MCP server that translates Claude's tool calls into n8n REST API requests. See [Claude-n8n-MCP-Bridge.md](Claude-n8n-MCP-Bridge.md) for the full architecture of this bridge.

The development cycle:

1. Claude connects to n8n-mcp (auto-launched as a subprocess)
2. Claude creates or updates workflow nodes via the n8n REST API
3. Claude activates the workflow, making the webhook endpoint live
4. When the workflow is stable, export the JSON and save it to `Workflow-Snapshots/`

The MCP server is only needed during development. Once the workflow is built and activated, it runs autonomously on n8n Cloud with no local processes involved.

## Workflow structure

```
Webhook Trigger          ← receives POST from Vercel landing page
       │
       ▼
Code Node                ← parses and validates form fields
(Parse + Clean Data)        (name, email, department, researchArea, goals, preferredDate)
       │
       ▼
Notion Node              ← writes a new row to the registration database
(Create Database Item)      (Phase 2 → Phase 3 interface)
```

## Interface in

HTTPS POST from the Vercel-hosted form. The form sends JSON with these fields:

```json
{
  "name": "string",
  "email": "string",
  "department": "string",
  "researchArea": "string (optional)",
  "goals": "string (optional)",
  "preferredDate": "string"
}
```

## Interface out

Notion API call to create a page (row) in the registration database. This is the boundary between Phase 2 and Phase 3.

## Workflow-Snapshots/

This folder holds exported JSON files of the n8n workflow at significant points in time. These are not live — they are archival copies for documentation and disaster recovery. If the n8n Cloud instance were lost, you could import a snapshot to rebuild the workflow.

Naming convention: `<workflow-name>-v<date>[ (annotation)].json`

## How to replicate this for a different project

1. Sign up for n8n Cloud (or self-host n8n)
2. Create a workflow with a Webhook Trigger node as the entry point
3. Add downstream nodes for your processing logic (code transforms, API calls, notifications)
4. Install the `n8n-mcp` npm package and configure it in your Claude Code MCP settings with your n8n API URL and key
5. Claude can now build and manage the workflow programmatically — no manual UI work needed
6. Set your frontend's webhook URL environment variable to the production webhook URL that n8n generates
