# VDA-MD Framework — citizenM POC

**Value-Driven AI with Markdowns** · AI Governance Transformation Framework  
Confidential POC · March 2026

---

## What This Is

VDA-MD is a transformation framework that governs AI agents using plain-text Markdown files. Every agent decision is evaluated against a `.md` governance file at runtime. Exceptions are formal overlays. Every decision is logged to a tamper-evident audit trail.

This repository contains the full citizenM Hotels proof-of-concept demo, including:
- The live React demo application
- All governance `.md` files (SOPs + Exception overlays)
- The 13 brand/tech source documents used for MarkItDown ingestion
- The MarkItDown-extracted `.md` context files

---

## Repository Structure

```
citizenm-vdamd-demo.jsx        ← Full React demo app (single file)
│
├── governance-files/           ← 8 VDA-MD governance .md files
│   ├── hospitality-stay-checkout.md
│   ├── hospitality-stay-VIP-checkout-exception.md
│   ├── S2P-approval-authority.md
│   ├── S2P-preferred-tech-supplier-exception.md
│   ├── hospitality-book-rate-override.md
│   ├── hospitality-book-key-account-exception.md
│   ├── HRpay-onboarding-system-access.md
│   └── HRpay-tech-role-fasttrack-exception.md
│
├── brand-sources/              ← 12 source documents (simulated citizenM corpus)
│   ├── 01–04  *.docx           ← Word: brand, people, digital strategy, guest standards
│   ├── 05–08  *.xlsx           ← Excel: procurement matrix, key accounts, HR access, Witness dashboard
│   └── 09–12  *.pdf            ← PDF: ESG policy, AI ethics charter, S2P policy, ops manual
│
└── markitdown-output/          ← Microsoft MarkItDown extracted .md files (13 total)
    ├── 01–12  *.md             ← Extracted from brand-sources/
    └── 13-citizenm-apaleo-tech-stack.md  ← Real Apaleo API architecture
```

---

## The Demo App

**`citizenm-vdamd-demo.jsx`** is a single-file React component. Load it in [Claude.ai](https://claude.ai) as an artifact, or in any React environment with the Anthropic API wired up.

### Five tabs:

| Tab | What it shows |
|-----|---------------|
| 🗺 Journey Map | Two-axis governance architecture. Click any agent to inspect its rules, exceptions, and compliance sources |
| 🔬 C2MD Studio | Live NIST SP 800-53 OSCAL → `.md` translation via Claude API, enriched with MarkItDown brand context |
| ⚡ Exception Engine | Baseline vs exception overlay — two parallel live API calls, side-by-side decisions |
| 🕵️ Witness Agent | Tamper-evident audit trail, pre-seeded with 10 realistic entries |
| 📁 Governance Files | All 8 `.md` files with NIST + GDPR + EU AI Act compliance sources |

---

## The C2MD Pipeline (Unique IP)

```
13 citizenM documents (Word, Excel, PDF)
        ↓
Microsoft MarkItDown
        ↓
Clean .md brand + tech context (38,000 chars)
        ↓
C2MD system prompt + NIST OSCAL source
        ↓
Claude API (claude-sonnet-4)
        ↓
Brand-flavoured, endpoint-accurate governance .md file
```

Document 13 (`13-citizenm-apaleo-tech-stack.md`) is derived from a real citizenM internal Apaleo API mapping sheet. It gives C2MD the actual Goodbits endpoint paths, Apaleo underlying calls, Auth0 identity layer, Adyen payment architecture, and Contentful configuration references — so governance files reference production systems, not generic descriptions.

---

## Governance File Format (VDA-MD Spec)

Every `.md` file follows this structure:

```markdown
---
control_id: [identifier]
domain: [domain]
journey_stage: [stage]
owner: [role title]
baseline: true | false
exception_to: [baseline control_id]  # exceptions only
---

## [Plain English Title]

[2–3 sentence summary]

### Apaleo & System Architecture  # domain-specific endpoints

### Agent Rules

- MUST ...
- MUST NOT ...
- MAY ...

### Violation Definition

[Single crisp sentence → immediate escalation action]
```

---

## Regulatory Coverage

Every governance file maps to:
- **NIST SP 800-53 Rev 5** — OSCAL source controls (AC-2, AU-2, SA-4, IR-4)
- **GDPR** — Articles 5, 6, 13, 22, 25, 32 as applicable per domain
- **EU AI Act** — Articles 9, 12, 13, 14, 17 (high-risk AI system requirements)

---

## Requirements

- Node.js 18+ (for running the demo)
- Anthropic API key (for live C2MD translations and Exception Engine decisions)
- React 18+ with default exports

---

## Framework Status

| Component | Status |
|-----------|--------|
| C2MD Translation Pipeline | ✅ Live — real NIST OSCAL → .md via Claude API |
| Exception Overlay Engine | ✅ Live — two parallel API calls |
| Witness Agent (in-app) | ✅ Live — in-memory, pre-seeded |
| Witness Agent (persistent) | 🔲 Requires database or Git-append backend |
| Governance files in Git | ✅ This repo |
| Cross-domain inheritance enforcement | 🔲 Requires resolver layer |
| Human CCO review workflow | 🔲 Requires product build |

---

## Author

VDA-MD Framework — Original concept, no prior art as of March 2026.  
C2MD (Compliance to Markdown) — Proprietary IP.
