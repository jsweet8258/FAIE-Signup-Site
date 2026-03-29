# Markdown Style Guide

## 1. Introduction

This guide defines formatting conventions for Markdown files.
Some project file types (e.g., READMEs) may have their own
conventions that take precedence where they conflict.
Project-specific exceptions are recorded in
`Project-Exceptions.md` alongside this file; when an exception
is declared there, it governs over this guide.

Markdown files are consumed in many contexts: by intelligent
agents, converted to other formats (DOCX, HTML), displayed in
IDEs with their own line wrapping, or read raw in a terminal.
The conventions here ensure files are legible in all of them.

## 2. Writing Philosophy

Write clearly, in the voice of a colleague sharing working
knowledge. Explain why, not just what. Do not announce that
you are teaching — just teach. If you cannot explain something
plainly without loss of meaning, revisit it until you can.

## 3. Formatting

### 3.1. Headings

Use ATX-style headings (`#`, `##`, `###`, etc.). Do not use
Setext-style (underline) headings.

### 3.2. Line Wrapping

Do not hard-wrap prose at a fixed column width (e.g., 72 or 80
characters).

Markdown renderers, IDEs, and LLM agents reflow text on their
own. Fixed-width wrapping produces ragged output in any display
context that uses a different width, and creates noisy diffs
when a mid-paragraph edit forces rewrapping of subsequent lines.

Write naturally. Let the editor handle display wrapping.

### 3.3. Block Spacing

Place one blank line before and after every block-level element:
headings, paragraphs, lists, fenced code blocks, and block
quotes.

### 3.4. Fenced Code Blocks

Use backtick fences (`` ``` ``), not indented code blocks.
Include a language tag when the content has a language
(`` ```python ``, `` ```yaml ``, etc.).

**Width exception.** Content inside fenced code blocks may
exceed any line-length guidance when the material cannot be
wrapped without breaking its meaning. Block diagrams, ASCII
art, wide tables, and similar visual structures are the typical
cases. Prose that happens to be inside a code fence is not
exempt; the exception is for content whose spatial layout is
the point.

### 3.5. Links

For files with many links, prefer reference-style links to keep
prose readable.

Inline style (fine for occasional links):
```markdown
See the [design rationale](design-rationale.md) for details.
```

Reference style (better when links are dense):
```markdown
See the [design rationale][dr] and the [setup guide][sg] for details.

[dr]: design-rationale.md
[sg]: setup-guide.md
```

Place reference definitions at the bottom of the file.

### 3.6. Tables

Use Unicode box tables inside fenced code blocks, not Markdown
pipe tables.

Unicode box table (preferred):

````
```
┌──────────┬──────────┐
│ Column A │ Column B │
├──────────┼──────────┤
│ value    │ value    │
└──────────┴──────────┘
```
````

Markdown pipe table (avoid):

```markdown
| Column A | Column B |
|----------|----------|
| value    | value    |
```

**Why.** Markdown pipe tables depend on a renderer. In a shell,
a plain text editor, or a `cat` to stdout, the columns don't
align and the structure is hard to read. Unicode box tables are
self-contained — every character is fixed-width, the alignment
is baked into the characters themselves, and the table renders
identically in every context: terminal, GitHub, IDE preview, or
plain text.

The tradeoff is maintenance cost. Adjusting column widths in a
box table requires touching every row. This cost is acceptable
because tables that appear in documentation files change
infrequently, and the benefit — a table that is legible
everywhere — outweighs the editing overhead.

ASCII tables (`+`, `-`, `|`) are an acceptable alternative when
Unicode box-drawing characters are unavailable or impractical.
The same principle applies: the table must be inside a fenced
code block and must be self-aligning.

The box-drawing characters for reference:

```
┌ top-left       ─ horizontal     ┬ top-tee
┐ top-right      │ vertical       ┤ right-tee
└ bottom-left    ├ left-tee       ┼ cross
┘ bottom-right   ┴ bottom-tee
```

## 4. What This Guide Does Not Prescribe

The following are left to the author's judgment in context:

- Section numbering and heading depth
- Whether to use ordered or unordered lists
- Use of bold, italic, or other inline formatting
