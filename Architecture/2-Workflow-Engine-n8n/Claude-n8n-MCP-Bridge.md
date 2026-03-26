# Claude-to-n8n MCP Bridge

How Claude Code uses the Model Context Protocol (MCP) to build and manage n8n workflows for the FAIE registration form.

## The Three Systems

There are three distinct systems involved. Two are permanent infrastructure (the landing page and n8n cloud). One is a development-time tool (n8n-mcp).

```
                    YOUR MACHINE (local, development only)
               ┌──────────────────────────────────────────┐
               │                                          │
               │  Claude Code          n8n-mcp server     │
               │  (MCP client)  ─────► (runs locally)     │
               │                stdio   │                 │
               │  "The AI               │ Knows all 1,084 │
               │   developer"           │ n8n nodes and   │
               │                        │ their schemas   │
               └────────────────────────┼─────────────────┘
                                        │
                                        │ HTTPS (n8n REST API)
                                        │ create/update/manage workflows
                                        ▼
┌──────────────────┐           ┌──────────────────────────┐
│                  │           │                          │
│  Vercel          │           │  n8n Cloud               │
│  (landing page)  │           │  osugenesis.app.n8n.cloud│
│                  │  HTTPS    │                          │
│  User fills out  │──────────►│  Webhook Trigger         │
│  form, browser   │  POST     │  receives form data,     │
│  sends POST      │           │  runs workflow            │
│                  │           │                          │
└──────────────────┘           └──────────────────────────┘
```

### 1. Landing Page (Vercel) — permanent

The Next.js registration page hosted on Vercel. When a visitor submits the form, client-side JavaScript sends a `POST` request directly to an n8n webhook URL. The page has no backend — it is a static landing page with a form. The webhook URL comes from the `NEXT_PUBLIC_N8N_WEBHOOK_URL` environment variable set in Vercel.

The landing page never talks to n8n-mcp. It only talks to the n8n webhook.

### 2. n8n Cloud (osugenesis.app.n8n.cloud) — permanent

The workflow automation engine. Workflows are built from nodes (a Webhook Trigger node receives form data, then downstream nodes can send emails, log to a spreadsheet, generate documents, etc.).

n8n cloud exposes two interfaces:

- **Webhook URLs** — public endpoints that the form POSTs to. This is production traffic.
- **REST API** — an administrative API for creating, updating, and managing workflows programmatically. This is development-time traffic and requires an API key.

### 3. n8n-mcp (local MCP server) — development tool only

This is the bridge between Claude Code and the n8n cloud REST API. It runs locally on your machine as a subprocess of Claude Code.

**What MCP is:** Model Context Protocol is a standard that lets AI assistants call external tools. Claude Code is an MCP *client* (built in, no code needed). n8n-mcp is an MCP *server* (already built, published as an npm package). They communicate over stdio (standard input/output) — Claude Code launches n8n-mcp as a child process and sends it JSON-RPC messages.

**What n8n-mcp provides Claude Code:**

- **Documentation tools** — Claude can look up any n8n node's properties, required fields, valid options, and working examples. This means workflows are built with correct schemas.
- **Management tools** — Given the n8n API URL and API key, Claude can create workflows, update them, activate/deactivate them, and validate them — all through the n8n REST API.

**In plain terms:** n8n-mcp gives Claude the ability to build and manage n8n workflows programmatically. Without it, you'd build workflows manually in the n8n web UI. With it, Claude does it from the terminal.

**Provenance:** n8n-mcp is a third-party open-source project by czlonkowski ([czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) on GitHub). It is not ours — we use it as a component of our solution. A local clone lives at `/Users/jsweet/Documents/GitHub/n8n-mcp` as a companion repository for reference and inspection, but it remains freestanding and should not be merged into this repo.

## Development Stages

### Stage 1: Build the webhook workflow (MCP needed)

Claude Code uses n8n-mcp to create a Webhook Trigger workflow on n8n cloud. The first version is a no-op — it receives form data and logs it, nothing more. This proves connectivity.

```
Claude Code ──MCP──► n8n-mcp ──REST API──► n8n Cloud
                                           (creates workflow)
```

### Stage 2: Connect the form to the webhook (no MCP)

Set `NEXT_PUBLIC_N8N_WEBHOOK_URL` in Vercel to point to the webhook's production URL. Test end-to-end: submit the form on the live site, verify data appears in n8n execution logs.

```
Browser ──POST──► n8n Cloud webhook
                  (form data arrives)
```

### Stage 3: Workflow is live (MCP not needed)

Once the webhook workflow is built and the environment variable is set, the MCP infrastructure is no longer involved. The form POSTs directly to n8n cloud. The landing page and n8n cloud operate independently — no local processes required.

```
Vercel landing page ──POST──► n8n Cloud webhook ──► downstream processing
```

### Stage 4: Future changes (MCP needed again)

Any time we want to modify the n8n workflow — add email confirmation, IEP generation, new routing logic — we spin up the MCP infrastructure again. Claude Code connects to n8n-mcp, makes the changes via the REST API, and then the MCP server goes dormant until the next change.

## Runtime vs. Development Traffic

| When | Flow | Purpose |
|------|------|---------|
| **Development** | Claude Code → n8n-mcp → n8n REST API | Build/update workflows |
| **Production** | User browser → Vercel → n8n webhook | Process form submissions |

The MCP server is never involved in production traffic. It is purely a development convenience.

## Configuration (no code required)

Claude Code does not need any interfacing software written in this repo to use n8n-mcp. The n8n-mcp server is a pre-built npm package (`npx n8n-mcp`). The only configuration needed is a `.mcp.json` file that tells Claude Code how to launch it:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_API_URL": "https://osugenesis.app.n8n.cloud",
        "N8N_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

This file can live in the project root (project-scoped) or in `~/.claude/` (global). When Claude Code starts a session, it reads this config, launches `npx n8n-mcp` as a subprocess, and gains access to the n8n documentation and management tools.

## Setup Checklist

1. **Generate an n8n API key** — Log into osugenesis.app.n8n.cloud → Settings → API → Create API key
2. **Create `.mcp.json`** — Add the configuration above with the real API key
3. **Verify connectivity** — Claude Code lists existing workflows to confirm the connection
4. **Build webhook workflow** — Claude Code creates a Webhook Trigger workflow on n8n cloud
5. **Set Vercel env var** — Point `NEXT_PUBLIC_N8N_WEBHOOK_URL` to the webhook's production URL
6. **Test end-to-end** — Submit form on live site, verify data in n8n execution logs
