# Claude-to-Notion MCP Bridge

How Claude Code will use the Model Context Protocol (MCP) to create and manage the FAIE registration database in Notion.

## Status

**Not yet operational.** The Notion integration exists; the MCP server is not yet configured.

```
┌──────────────────────────────────┬───────────────────────────────────────────────────────────────┐
│ Component                        │ Status                                                        │
├──────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ Notion integration (TT3OC)       │ Created in AI@DRI Learning Space, read + update content        │
│ @notionhq/notion-mcp-server      │ Not yet added to .claude/ MCP config                          │
│ NOTION_API_TOKEN                 │ Not yet stored in .claude/                                    │
│ Registration database            │ Not yet created                                               │
└──────────────────────────────────┴───────────────────────────────────────────────────────────────┘
```

## The Two Systems

Same pattern as the [Claude-to-n8n MCP bridge](../2-Workflow-Engine-n8n/Claude-n8n-MCP-Bridge.md), different target. One is permanent infrastructure (Notion). One is a development-time tool (notion-mcp).

```
                YOUR MACHINE (local, development only)
           ┌──────────────────────────────────────────┐
           │                                          │
           │  Claude Code          notion-mcp server  │
           │  (MCP client)  ─────► (runs locally)     │
           │                stdio   │                 │
           │                        │ Translates      │
           │                        │ tool calls to   │
           │                        │ Notion API      │
           └────────────────────────┼─────────────────┘
                                    │
                                    │ HTTPS (Notion API)
                                    │ create/query/update pages & databases
                                    ▼
                           ┌──────────────────────────┐
                           │                          │
                           │  Notion                  │
                           │  AI@DRI Learning Space   │
                           │                          │
                           │  FAIE Registration DB    │
                           │  (to be created)         │
                           │                          │
                           └──────────────────────────┘
                                    ▲
                                    │ HTTPS (Notion API)
                                    │ production writes
                           ┌────────┴─────────────────┐
                           │                          │
                           │  n8n Cloud               │
                           │  (workflow Notion node)  │
                           │                          │
                           └──────────────────────────┘
```

### 1. Notion (AI@DRI Learning Space) — permanent

The workspace where the registration database will live. Notion exposes a single API that serves both development-time and production-time traffic. Two separate integrations access it:

- **TT3OC** — Claude's development-time integration (read + update content). Its secret becomes the `NOTION_API_TOKEN` for the MCP server.
- **n8n's Notion credentials** — Production-time integration used by the n8n workflow's Notion node to write new registrations. Configured inside n8n Cloud, not in this repo.

Each integration must be explicitly connected to every page or database it needs to access (page menu → Add connections → select integration).

### 2. notion-mcp (local MCP server) — development tool only

The bridge between Claude Code and the Notion API. Same architecture as n8n-mcp: Claude Code launches it as a subprocess, communicates over stdio via JSON-RPC.

**Provenance:** `@notionhq/notion-mcp-server` is Notion's official MCP server, published as an npm package ([makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server) on GitHub).

**What notion-mcp will provide Claude Code:**

- Create pages and databases
- Define and modify database properties (columns, types, options)
- Query, filter, and sort database records
- Update existing pages and properties
- Add comments to pages

## Configuration

Once the `NOTION_API_TOKEN` is available, add this to `.claude/n8n-mcp.json` (which will need renaming to a general MCP config) or to a separate `.claude/notion-mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_TOKEN": "<TT3OC integration secret>"
      }
    }
  }
}
```

After adding the config, restart Claude Code to pick up the new MCP server.

## Setup Checklist

1. **Copy the TT3OC integration secret** from notion.so/profile/integrations → TT3OC → Show secret
2. **Store the token** in `.claude/` MCP config with the configuration above
3. **Restart Claude Code** to load the new MCP server
4. **Verify connectivity** — Claude lists accessible pages/databases in AI@DRI Learning Space
5. **Create the registration database** — Claude builds the schema defined in the [implementation plan](../../Control/IMPLEMENTATION_PLAN.md)
6. **Connect both integrations** — Share the database with TT3OC (for Claude) and with n8n's Notion integration (for production writes)

## Runtime vs. Development Traffic

```
┌───────────────┬───────────────────────────────────────────────┬──────────────────────────────────────────────────┐
│ When          │ Flow                                          │ Purpose                                          │
├───────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────────────┤
│ Development   │ Claude Code → notion-mcp → Notion API         │ Create/modify database schema, query records     │
│ Production    │ n8n workflow → Notion API                      │ Write new registration rows                      │
└───────────────┴───────────────────────────────────────────────┴──────────────────────────────────────────────────┘
```

The MCP server is never involved in production traffic. Once the database is created and the n8n Notion node is configured, the production pipeline writes directly to Notion without any local processes.
