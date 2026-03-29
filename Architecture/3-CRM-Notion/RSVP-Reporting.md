# Phase 5 — RSVP Reporting

Generating on-demand lists of faculty who have signed up for each FAIE workshop session.

## Context

Phases 1 through 4 build a write pipeline: a faculty member fills out the registration form on the landing page, the form POSTs to n8n, n8n writes a row to the Notion CRM. Once that pipeline is working end-to-end, the CRM will accumulate registrations — one row per faculty member, each tagged with a preferred workshop date.

Phase 5 inverts the direction. Instead of writing data *into* the CRM, we read data *out of* it. The goal: generate a list of everyone who has RSVP'd for a given workshop session, on demand.

## What it will be

A Notion database view (or set of views) on the FAIE Registration database that filters and groups registrations by preferred date. When an administrator needs to know who is coming to the March 15 session, they open the view, select the date, and get the list — names, emails, departments, research areas.

This is not a separate application. It is a read interface on a resource that already exists (the registration database from Phase 3). Notion's built-in database views — filtered, sorted, grouped — are the right tool. No additional code, no additional services, no additional integrations.

## How Claude develops it

Same interface as Phase 3: Claude connects to Notion through **notion-mcp** and creates or configures database views programmatically. The TT3OC integration already has read + update content capabilities, which includes creating and modifying views.

Possible views to create:

```
┌─────────────────────┬─────────┬──────────────────────────────────┬─────────────────────┬────────────────────────────────────────────────┐
│ View                │ Type    │ Filter                           │ Sort                │ Purpose                                        │
├─────────────────────┼─────────┼──────────────────────────────────┼─────────────────────┼────────────────────────────────────────────────┤
│ All Registrations   │ Table   │ None                             │ Submitted At (desc) │ Master list                                    │
│ By Session Date     │ Table   │ Preferred Date = [selected]      │ Name (asc)          │ RSVP list for a specific workshop              │
│ By Department       │ Board   │ Group by Department              │ Name (asc)          │ Cross-departmental participation overview       │
│ New / Unconfirmed   │ Table   │ Status = New                     │ Submitted At (asc)  │ Triage queue for follow-up                     │
└─────────────────────┴─────────┴──────────────────────────────────┴─────────────────────┴────────────────────────────────────────────────┘
```

The exact views will be determined once the database is populated and real usage patterns emerge.

## Interface

- **In**: Reads from the FAIE Registration database (Phase 3). No write operations — this is a read-only consumer.
- **Out**: Notion database views rendered in the Notion UI. Administrators consume these views directly; no data leaves Notion.

## Dependencies

Phase 5 cannot begin until:

1. **Phase 3 is complete** — The registration database must exist with the correct schema
2. **Phase 4 is proven** — The end-to-end pipeline must be working so that registrations are actually flowing into the database
3. **Real data exists** — Views are best designed against real records, not empty schemas

## How to replicate this for a different project

If you have a Notion database being populated by an automated pipeline:

1. Define what questions you need to answer from the data (who signed up, when, for what)
2. Create filtered/sorted/grouped views on the database — one view per question
3. If you need the views created programmatically (e.g., via Claude), use the Notion MCP server; otherwise, build them in the Notion UI directly
4. Share the database (or specific views) with the people who need to read the reports
