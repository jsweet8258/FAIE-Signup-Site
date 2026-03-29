# Knowledge Architecture Guidelines

How to structure a project so that its operational understanding is transferable — to the next maintainer, the next agent, or anyone replicating the system in a different context.

These guidelines apply in two situations:

1. **Greenfield.** You are starting a new project and plan to build the knowledge architecture alongside the system from the beginning.

2. **Retrofit.** You have an existing project — working, partly working, or stalled — and you need to add a knowledge architecture layer to make it maintainable and teachable.

The same structures apply in both cases. The difference is that a greenfield project builds them incrementally as the system takes shape, while a retrofit builds them all at once from accumulated knowledge that exists only in the builder's head (or in scattered artifacts).

## 1. Separate architecture from operations from code

A project's files serve three distinct purposes. Mixing them in a flat directory makes the repo opaque — a newcomer cannot tell what is documentation, what is configuration, and what is live code. Separate them:

```
Architecture/                  Teaching and reference material
  <subsystem>/                 One directory per subsystem or phase
    README.md                  What this subsystem is, how it works, how to replicate it

Control/                       Operational files
  IMPLEMENTATION_PLAN.md       Step-by-step plan with dependency order
  URLs/                        Bookmarks to external services
  z-obsolete/                  Retired files (kept for reference, clearly marked)

<live-code-directory>/         The actual running code (if any)
```

**Architecture/** is the teaching layer. Every subsystem gets its own directory with a README that answers: what is this, where does it live, how does Claude (or a human) develop it, what are its interfaces in and out, and how would someone replicate it from scratch.

**Control/** is the operational layer. Implementation plans, project bookmarks, deployment tracking, and anything that governs how work is done but is not itself part of the system being built.

**Live code directories** are left at the root, named to match their deployment target. Do not rename them to fit a documentation scheme — deployment platforms (Vercel, Heroku, etc.) often depend on the directory name.

## 2. Write a README that orients before it explains

The repo README is the orientation layer. A reader should know within thirty seconds: what this system is, whether it works yet, and where to look for depth.

Structure the README in this order:

1. **One-liner** — what the system does, in one sentence
2. **What This Is** — the system described in terms of its boundaries and interfaces, not its implementation
3. **Why the documentation exists** — explicitly state that the documentation is load-bearing infrastructure, not a supplement. Name the risk: without it, the system is a set of black boxes that no one can maintain
4. **Current Status** — an interface scorecard showing what is working, what is partially wired, and what does not exist yet. A newcomer's first question is "does this work?" Answer it immediately and honestly
5. **Architecture overview** — phases or subsystems, with a diagram showing how they connect. Point to Architecture/ for depth
6. **Repo structure** — a tree showing where everything lives and what it is for
7. **Setup / Deployment / Environment** — operational details at the bottom, not the top

The README does not teach the system's internals. It teaches where to find the teaching.

## 3. Document every subsystem for replication

Each subsystem directory in Architecture/ gets a README that answers five questions:

1. **What is it?** — what this subsystem does, in plain language
2. **Where does it live?** — runtime location (URL, service, host), archival location (this repo), companion repos
3. **How do you develop it?** — the interface Claude or a human uses to shape this subsystem (git push, MCP bridge, API calls, manual UI)
4. **What are its interfaces?** — what comes in, what goes out, what format, what protocol
5. **How would you replicate it?** — step-by-step instructions for someone building the same kind of subsystem in a different project

The fifth question is the one most documentation skips. It is also the one that most directly satisfies the written requirement (see [SYSTEMS_FOUNDATIONS.md](../../SYSTEMS_FOUNDATIONS.md)). If your documentation does not teach replication, it teaches operation — which is necessary but not sufficient.

## 4. Document development interfaces explicitly

When Claude (or another agent) reaches an external service through an MCP bridge, API, or other programmatic interface, that interface deserves its own document. The document should cover:

- What the bridge is (MCP server name, npm package, API)
- How it connects (stdio, HTTPS, authentication method)
- What credentials it needs and where they are stored
- What Claude can do through this bridge (create, read, update, activate, etc.)
- What Claude cannot do (limitations, manual-only operations)
- Provenance: who maintains the bridge tool, where the source lives, whether it is first-party or third-party

These documents are not operational guides. They are knowledge architecture: they ensure that the next person understands how the builder reached the system, not just that the system exists.

## 5. Build an implementation plan that teaches

An implementation plan is not a task list. It is a teaching document that explains the dependency order and the reasoning behind it.

A good implementation plan contains:

- **Current state by phase** — what exists, what is partially built, and what the gaps are. Be specific: name the missing configuration, the wrong field mapping, the unconfigured node
- **Steps in dependency order** — each step names what it does, which phase it belongs to, and why it comes at this point in the sequence (not earlier, not later)
- **Blockers and decisions** — open questions that require human input before work can proceed. Name what is blocked and why
- **What gets modified where** — a table showing which resources are touched, where they live, and how Claude reaches them. This prevents the next person from wondering "where do I make this change?"

The plan should be readable as a narrative: if you read it top to bottom, you understand not just what to do but why the steps are ordered the way they are.

## 6. Use an interface scorecard

For systems with multiple subsystems or services, maintain a scorecard in the README that shows the status of every interface at a glance. Each row names:

- The interface (what connects to what)
- The development-time channel (how Claude shapes it)
- The production channel (how data flows at runtime)
- The current status (working, not wired, configured but unverified, does not exist yet)

The scorecard is the fastest way for a newcomer to answer "what works and what doesn't?" It is also the fastest way for the builder to track progress across a multi-phase project.

## 7. State the why, not just the what

Every document in the knowledge architecture should answer *why* at least as often as it answers *what* or *how*:

- Why are the phases ordered this way? (dependency)
- Why does the workflow use a Code node instead of a direct mapping? (schema mismatch between form and database)
- Why is the Notion integration separate from the n8n integration? (development-time access vs. production-time writes)
- Why is this directory named this way? (deployment target constraint)

The *what* and *how* enable operation. The *why* enables understanding. Both are required. See "How is necessary. Why is sufficient." in [SYSTEMS_FOUNDATIONS.md](../../SYSTEMS_FOUNDATIONS.md).

## Greenfield vs. retrofit

**Greenfield:** Build these structures from the first commit. Create Architecture/ and Control/ before you write code. Write the subsystem README as you build the subsystem — not after. The act of writing it will surface gaps in your understanding (this is the Feynman Technique applied to system design). The implementation plan evolves as you work; start it as a sketch and refine it as decisions are made.

**Retrofit:** You are looking at a working (or partly working) system that has no knowledge architecture. The refactoring process is:

1. **Inventory** — list every subsystem, service, interface, and credential. You are mapping what exists.
2. **Reorganize** — move files into Architecture/ and Control/. Rename for clarity. Consolidate scattered notes into proper documents. Delete stale artifacts (or move them to z-obsolete/ if they have reference value).
3. **Write the missing documents** — subsystem READMEs, bridge designs, implementation plan. Each one externalizes knowledge that currently exists only in the builder's head.
4. **Add the README orientation layer** — rewrite the root README to orient before it explains. Add the interface scorecard. Add the philosophy section.
5. **State the why** — go back through every document and ask: does this explain *why*, or only *what*? Add the reasoning wherever it is missing.

The retrofit is harder than the greenfield because you must reconstruct understanding that was never written down. That difficulty is itself the proof of why the knowledge architecture matters: if it were easy to reconstruct, you would not need it.
