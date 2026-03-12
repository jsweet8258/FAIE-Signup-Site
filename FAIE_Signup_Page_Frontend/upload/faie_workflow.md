**FAIE Master Cycle Workflow**

*Comprehensive Guide for Driving the FAIE Cycle*

**Orientation**\
This guide defines the end‑to‑end process for executing the FAIE system.
It is written for Human Operators who organize inputs, run model
prompts, and assemble a tailored Industry Engagement Plan (IEP) for each
faculty member. All steps are modular, prompt‑driven, and support
precision, adaptability, and human oversight. This version incorporates
clear operator setup, artifact handling, and stage‑by‑stage prompts that
align with your master source.

## [1. Introduction: The FAIE Cycle]{.mark}

## 

### 1.1 Macro view -- how FAIE works

FAIE converts **faculty inputs → standardized intermediates (Derivative
Products, DP.0--DP.5) → core staged outputs (S3.1--S3.7) → a final IEP
summary**.

-   **Inputs:** CV, website, publications, preferences, goals.

-   **Intermediates:** Canonical Derivative Products that normalize
    inputs and define the model's role context.

-   **Core stages:** Seven prompts that produce the industry‑facing
    summary, vertical map, company matches, outreach assets, visibility
    plan, web updates, and then the **IEP summary sheet**.

-   **Final outputs:** A one‑page IEP summary sheet plus separate S3
    artifacts saved as their own files inside the faculty's S3 folder --
    not a concatenation into one document.

### 

### 1.2 The role of the Human Operator

The Human operator **does not draft content**. The Human will:

-   Prepare the folder structure and filenames before you begin.

-   Attach source files and prior artifacts to each step.

-   Run the provided prompts in order.

-   Save returned files using the canonical names.

-   Re‑attach prior artifacts when later steps require them. Do not rely
    on model memory unless you verify it.

### 

### 1.3 Preflight -- set up the workspace **before** you run FAIE

Create a root folder and subfolders for the faculty member:

FAIE/\<FacultyLast\>\_\<FacultyFirst\>/

inputs_raw/

artifacts_dp/ (DP.1--DP.5 files)

artifacts_s3/ (S3.1--S3.7 files)

final/ (Final IEP summary + manifest)

Use canonical filenames:\
\<Last\>\_\<First\> -- \<ArtifactCode\> \<ShortName\> -- vYYYYMMDD.ext

Example: *Feng_Zhenxing -- DP1 Faculty Profile Sheet -- v20251005.md*.

Maintain a simple manifest that lists each artifact, its filename,
version, and folder.

### 

### 1.4 What to expect in the rest of this document

-   **Section 2 -- Data Preparation & Digestion Steps:** Builds
    DP.0--DP.5. Each subpart shows **Required Inputs**, a **Human
    Prompt** that tells you exactly what to attach, and a **GPT Prompt**
    that defines the model's output and file returns.

-   **Section 3 -- FAIE Core Output Execution:** Runs S3.1--S3.7. Each
    stage consumes specific DPs and prior S3 outputs and returns new
    artifacts.

-   **Section 4 -- Final IEP Assembly & Review:** Wrap‑up that produces
    the final IEP **summary** and a file manifest. S3 artifacts remain
    separate files inside artifacts_s3/.

### 

### 1.5 Operator checklist -- at every step

1.  Attach required artifact files -- or paste full labeled content
    blocks.

2.  Run the step's GPT Prompt.

3.  Download and save the returned file using the canonical filename.

4.  Verify the receipt line -- title, filename, counts.

5.  Update your manifest in artifacts_dp/ or artifacts_s3/ before you
    move on.

## 

## [2. Discovery & Planning -- Data Preparation & Digestion]{.mark} 

**Purpose** -- Ensure reliable handoff of inputs and outputs across all
steps. Do not assume the model can recall prior artifacts by name. When
a step needs an earlier artifact, **attach the file** or **paste the
labeled content block** again.

### *Notes on Operator Orchestration & Artifact Handling Protocol:*

-   **Attachment / Paste instructions -- append to every Human Prompt**

    -   If available, attach the prior artifact file(s) named in
        Required Inputs.

    -   If attachment is not possible, paste the **full labeled content
        block(s)** beginning with the artifact title line (for example,
        DP.2 -- Research Focus Summary).

    -   Only rely on filename recall if the model already confirmed that
        capability in this chat.

### DP.0 -- FAIE Input Checklist -- review for completeness

**Human Prompt**\
Complete the checklist and mark each row **Received**, **Inferred**, or
**Pending**. When each row is Received or Inferred, proceed to DP.1.

**Checklist Table -- DP.0**

  ------------------------------------------------------------------------
  **Input Type**        **Status (Received / **Description**
                        Inferred /           
                        Pending)**           
  --------------------- -------------------- -----------------------------
  Research Area(s)                           Topical keywords, domain
                                             focus, SDG or industry tags

  Faculty Bio or CV                          Background, appointments,
                                             affiliations, career stage

  Recent Publications                        Representative outputs that
                                             show depth, novelty, impact

  Faculty Website                            Profile with summaries,
                                             contact info, lab or group
                                             details

  Company Interests /                        Companies engaged or avoided
  Industry Verticals                         -- areas of interest

  Engagement Goals                           Desired outcomes -- joint
                                             research, licensing,
                                             internships
  ------------------------------------------------------------------------

-   **Initialization**.

> To initiate the FAIE Cycle, the FAIE Assistant should instruct the
> Operator to:

a.  prepare all faculty inputs and attach them into the chat; and

b.  enter the following GPT Prompt:

+---+------------------------------------------------------------------+
|   | \<**GPT_Prompt**\>                                               |
|   |                                                                  |
|   | We are running this FAIE Cycle for faculty member **\[Name\]**.  |
|   |                                                                  |
|   | Please see the faculty member's inputs attached to the chat,     |
|   | including the following:                                         |
|   |                                                                  |
|   | -   Statement of goals and interests                             |
|   |                                                                  |
|   | -   CV                                                           |
|   |                                                                  |
|   | -   Examples of manuscripts and published papers                 |
|   |                                                                  |
|   | -   Other reference documents.                                   |
|   |                                                                  |
|   | Analyze these sources and let me know what is our next step in   |
|   | the FAIE Cycle. (Remember to always give me operator prompts     |
|   | each time so I know how to correctly prompt the FAIE Assistant   |
|   | at each step of the FAIE Cycle.)                                 |
|   |                                                                  |
|   | \</**GPT_Prompt**\>                                              |
|   |                                                                  |
|   | \>\> \[*attachments*\]                                           |
+===+==================================================================+
+---+------------------------------------------------------------------+

When the checklist table is complete (**Checklist Table -- DP.0**), we
will be ready to proceed to DP.1.

### DP.1 -- Faculty Profile Sheet

**Required Inputs**\
CV file; faculty website URL.

**Human Prompt**\
Attach the CV and include the website URL. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
From the attached CV and website URL, generate a **5--7 sentence**
profile in plain English with light industry framing. Preserve facts,
remove jargon, and make it skimmable.

**Outputs:**

1.  Labeled block **"DP.1 -- Faculty Profile Sheet."**

2.  Downloadable file **"\<Last\>\_\<First\> -- DP1 Faculty Profile
    Sheet -- vYYYYMMDD.md."**

3.  **Receipt** line with title, filename, and word count.

### DP.2 -- Research Focus Summary

**Required Inputs**\
Publication titles and abstracts or links; research statements or grant
summaries (optional).

**Human Prompt**\
Attach publication information and any research statements. Run the GPT
Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**

From the materials provided, extract **3--5** distinct research focus
areas. For each, include **1--2 keywords** and **a one‑sentence lay
explanation**. Avoid overlap across areas.

**Outputs:**

1.  Labeled block **"DP.2 -- Research Focus Summary."**

2.  Downloadable file **"\<Last\>\_\<First\> -- DP2 Research Focus
    Summary -- vYYYYMMDD.md."**

3.  **Receipt** line with item count and filename.

### DP.3 -- Clean Publication Highlights

**Required Inputs**\
Full publication list or bibliography links.

**Human Prompt**\
Attach the most complete publication list available. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
From the publication list, select **3--5** items that best demonstrate
impact or industry relevance. Format a table with columns: **Year \|
Journal \| 1‑line topic summary (≤ 16 words) \| Link**.

**Outputs:**

1.  Labeled block **"DP.3 -- Clean Publication Highlights."**

2.  Downloadable **CSV** **"\<Last\>\_\<First\> -- DP3 Publication
    Highlights -- vYYYYMMDD.csv."**

3.  **Receipt** line with row count and filename.

### DP.4 -- Faculty Stated Preferences (Company Interests & Engagement Goals)

**Required Inputs**\
Emails or notes that mention company interests or aversions; desired
outcomes.

**Human Prompt**\
Attach the relevant messages. If none exist, write "No preference
information provided." Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
Normalize the inputs into two bullet lists:\
A) company or vertical interests and any aversions;\
B) desired engagement outcomes (for example joint research, internships,
licensing, sponsored projects).\
Each bullet ≤ 12 words. If no data, state "No preference stated."

**Outputs:**

1.  Labeled block **"DP.4 -- Preferences."**

2.  Downloadable file **"\<Last\>\_\<First\> -- DP4 Preferences --
    vYYYYMMDD.md."**

3.  **Receipt** line with bullet counts and filename.

### DP.5 -- FAIE GPT Role Definition

**Required Inputs**\
DP.1, DP.2, DP.3, DP.4.

**Human Prompt**\
Attach DP.1--DP.4 files exactly as produced. If attachments are not
possible, paste each full labeled content block. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
Using DP.1--DP.4, generate a **single‑paragraph role prompt** that
causes the FAIE GPT to act in a dual role: **(1)** expert industry and
market analyst with specific expertise in the fields identified in DP.2;
**(2)** industry engagement specialist who serves both audiences by
translating faculty research into industry value for faculty
stakeholders and mapping industry needs to faculty capabilities for
industry stakeholders. Require plain English, active voice, no invented
facts, and skimmable outputs per the Core FAIE Cycle.\
Then perform a **Deep Research** assignment scoped to DP.2. If browsing
is available, favor authoritative sources from the last 24 months.
Produce a brief that includes: **sector map**; **6--10** current
technology needs matched to DP.2; **near‑term drivers**; a **watchlist**
of companies, labs, or consortia with one‑line rationales; expected
**TRLs and evidence norms**; common **engagement modes**; and **3--5**
visibility venues. **Flag assumptions and uncertainties.**

**Outputs:**

1.  Labeled block **"DP.5 -- Role Definition."**

2.  Labeled block **"DP.5 -- Deep Research Brief."**

3.  Two downloadable files named with the canonical DP.5 pattern.

4.  **Receipt** lines for each file.

## [3. FAIE Core Output Execution]{.mark}

### 

### Stage 3.1 -- Faculty Summary (Industry‑Facing Value Summary)

**Required Inputs**\
DP.1 -- Faculty Profile Sheet; DP.2 -- Research Focus Summary; DP.5 --
Deep Research Brief.

**Human Prompt**\
Attach DP.1, DP.2, and the Deep Research Brief. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
Create a **3‑paragraph** industry‑facing summary.\
• Paragraph 1 -- identity, role, core capabilities.\
• Paragraph 2 -- industry problems the faculty can address, grounded in
DP.2 and the Deep Research Brief.\
• Paragraph 3 -- proof points and a suggested next conversation.

**Outputs:**

1.  Labeled block **"S3.1 -- Industry‑Facing Summary."**

2.  Downloadable file **"\<Last\>\_\<First\> -- S3.1 Summary --
    vYYYYMMDD.md."**

3.  **Receipt** line with word count and filename.

### Stage 3.2 -- Industry Vertical Mapping

**Required Inputs**\
DP.2 -- Research Focus Summary; DP.5 -- Deep Research Brief.

**Human Prompt**\
Attach DP.2 and the Deep Research Brief. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
List **5--7** relevant industry verticals that align with DP.2. For
each, provide a one‑sentence justification that references needs or
drivers where useful. Avoid redundancy.

**Outputs:**

1.  Labeled block **"S3.2 -- Vertical Map."**

2.  Downloadable file **"\<Last\>\_\<First\> -- S3.2 Vertical Map --
    vYYYYMMDD.md."**

3.  **Receipt** line with item count and filename.

### Stage 3.3 -- Company Match List

**Required Inputs**\
DP.2 -- Research Focus Summary; DP.4 -- Preferences; DP.5 watchlist
entities (optional).

**Human Prompt**\
Attach DP.2, DP.4, and any watchlist entities. Highlight exclusions from
DP.4. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**

**Web search or deep research encouraged.** Generate **10--15**
companies aligned to DP.2 and consistent with DP.4 preferences. For each
company, provide a one‑line rationale tied to a concrete need or product
area and a suggested entry point (for example partnerships office,
corporate lab, or program).

**Outputs:**

1.  Labeled block **"S3.3 -- Company Matches."** Table schema: **Company
    \| Why it aligns \| Suggested entry point.**

2.  Downloadable **CSV** **"\<Last\>\_\<First\> -- S3.3 Company Matches
    -- vYYYYMMDD.csv."**

3.  **Quality Gate** -- remove duplicates, exclude avoid‑list firms,
    flag inferred matches.

4.  **Receipt** line with row count and filename.

### Stage 3.4 -- Outreach Message Draft

**Required Inputs**\
S3.1 -- Industry‑Facing Summary; one selected company row from S3.3;
desired outcome from DP.4.

**Human Prompt**\
Attach S3.1, paste one target company row, and paste the desired
outcome. Run the GPT Prompt.

**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
Draft a concise outreach email to the selected company that references
the alignment in S3.3 and targets the specified outcome. Include **three
subject lines**, a **short LinkedIn message** variant, and a
**two‑sentence P.S.** that proposes an easy next step.

**Outputs:**

1.  Labeled block **"S3.4 -- Outreach Pack."**

2.  Downloadable file **"\<Last\>\_\<First\> -- S3.4 Outreach Pack --
    vYYYYMMDD.md."**

3.  **Quality Gate** -- confirm the message references correct company
    facts, aligns with DP.4 desired outcome, and avoids over‑claims.

4.  **Receipt** line with filename and word count.

### Stage 3.5 -- Event and Visibility Recommendations

**Required Inputs**\
DP.2 -- Research Focus Summary; DP.5 -- Deep Research Brief; constraints
(time, travel, budget) if any.

**Human Prompt**\
Attach DP.2 and the Deep Research Brief. Add constraints if known. Run
the GPT Prompt.\
**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
**Web search or calendar awareness encouraged.** Recommend **3--5**
relevant events or visibility venues aligned with DP.2. For each,
include typical timing or next edition, why it matters, and a suggested
action -- submit abstract, schedule partner meetings, propose a panel.\
**Outputs:**

1.  Labeled block **"S3.5 -- Visibility Plan."**

2.  Downloadable file **"\<Last\>\_\<First\> -- S3.5 Visibility Plan --
    vYYYYMMDD.md."**

3.  **Receipt** line with item count and filename.

### Stage 3.6 -- Web Presence Optimization

**Required Inputs**\
Current website URL; copied web text for relevant page sections; S3.1 --
Industry‑Facing Summary.

**Human Prompt**\
Attach the URL and paste the relevant web text. Attach S3.1. Run the GPT
Prompt.\
**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
Propose **3--5** specific improvements to make the faculty page clearer
for industry audiences. Include replacement snippets where relevant -- a
3‑line industry summary, featured projects, collaboration
call‑to‑action, downloadable one‑pager blurb, and a contact box.\
**Outputs:**

1.  Labeled block **"S3.6 -- Web Updates."**

2.  Downloadable file **"\<Last\>\_\<First\> -- S3.6 Web Updates --
    vYYYYMMDD.md."**

3.  **Receipt** line with item count and filename.

### Stage 3.7 -- IEP Summary Compilation

**Required Inputs**\
S3.1--S3.6 outputs; DP.4 -- Preferences.

**Human Prompt**\
Attach S3.1--S3.6 and DP.4. Note any must‑keep items or constraints. Run
the GPT Prompt.\
**Attachment / Paste instructions** -- apply DP.0a.

**GPT Prompt**\
Integrate the materials into a **one‑page "S3.7 -- Industry Engagement
Plan (IEP) Summary Sheet."** This is a stand‑alone summary that
**outlines** the S3 outputs and points to them by filename -- it does
**not** concatenate their full text. Include sections: **1)** Faculty
summary; **2)** Target verticals; **3)** Company shortlist with entry
points; **4)** Outreach assets summary; **5)** Visibility plan; **6)**
Web updates; **7)** Next 90‑day actions. Add **Risks & Assumptions**.\
**Outputs:**

1.  Labeled block **"S3.7 -- IEP Summary Sheet."**

2.  Downloadable **DOCX** **"\<Last\>\_\<First\> -- S3.7 IEP Summary --
    vYYYYMMDD.docx."**

3.  **Quality Gate** -- verify each section traces to prior artifacts
    and no claims exceed evidence.

4.  **Receipt** line with page or word count and filename.

5.  **Appendix manifest** listing the separate S3 files that reside in
    artifacts_s3/ (S3.3, S3.4, S3.5, S3.6, etc.).

## 4. Final IEP Assembly & Review

**Required Inputs**\
S3.7 -- IEP Summary Sheet; separate S3 artifacts stored in artifacts_s3/
(do not concatenate):

-   S3.1 Summary

-   S3.2 Vertical Map

-   S3.3 Company Matches (CSV)

-   S3.4 Outreach Pack

-   S3.5 Visibility Plan

-   S3.6 Web Updates

**Human Prompt**\
Attach the S3.7 IEP Summary Sheet and confirm that all referenced S3
files exist in artifacts_s3/. Run the GPT Prompt.

**GPT Prompt**\
Review the IEP Summary Sheet for clarity, internal consistency, and
actionability. Confirm that each referenced S3 artifact exists by
filename and appears in the Appendix manifest. Output a short **Punch
List** of any corrections needed. Then output a clean, copy‑ready
**Final IEP Summary** and a one‑line **Appendix manifest** that lists S3
filenames as separate documents in artifacts_s3/.\
**Outputs:**

1.  Labeled block **"Final IEP -- Punch List."**

2.  Labeled block **"Final IEP -- Summary Sheet (Clean)."**

3.  Downloadable **DOCX** **"\<Last\>\_\<First\> -- Final IEP Summary --
    vYYYYMMDD.docx."**

4.  **Receipt** line with filename and page count.

  --------------------------------------------------------------------------
  \>\>   
  ------ -------------------------------------------------------------------

  --------------------------------------------------------------------------

**\* \* \***

  -------------------------------------------------------------------------
  \>\>   
  ------ ------------------------------------------------------------------

  -------------------------------------------------------------------------

\-\-\-\--

*Sources:*

-   [*https://chatgpt.com/g/g-67c565b4a5b08191b9f110ce830a0e44-innovation-evangelist-and-ip-advisor-ieia/c/68c7d730-a894-832c-80dc-09d150f764d0?model=gpt-5-thinking*](https://chatgpt.com/g/g-67c565b4a5b08191b9f110ce830a0e44-innovation-evangelist-and-ip-advisor-ieia/c/68c7d730-a894-832c-80dc-09d150f764d0?model=gpt-5-thinking)

\-\-\-\--

#eof#
