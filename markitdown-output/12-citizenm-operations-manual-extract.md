citizenM Property Operations Manual — AI
Governance Extract
Operations Domain | Operations Director | March 2026 | v4.1

Scope

This extract covers the AI-governed operational procedures for citizenM properties. All ambassadors

and Operations Leads must understand which decisions are made by AI agents, what governing files

apply, and when human override is required.

Check-in & Checkout — AI Agent Responsibilities

The Stay Agent governs checkout time decisions. The agent operates under

hospitality-stay-checkout.md (baseline) and hospitality-stay-VIP-checkout-exception.md (citizenM Black
exception).

Situation

Agent Decision

Governing File

Human Override?

Standard guest, 11:00 checkoutPASS — standard

hospitality-stay-checkout.md

Not required

Standard guest, requests 13:30 PASS — 20 EUR fee if capacity

hospitality-stay-checkout.md

Required if no capacity

citizenM Black, requests 13:30 (EMEA)

PASS — no fee

VIP-checkout-exception.md

Not required

citizenM Black, requests 15:00 FAIL — reverts to baselinehospitality-stay-checkout.md

Ops Lead discretion

Any guest, requests 15:00+

FAIL — additional night hospitality-stay-checkout.md

Required

cloudM PMS — Logging Requirements

Every checkout modification request must be logged in cloudM within 30 minutes of the agent decision.

The Witness Agent automatically logs the governance decision. Ambassadors log guest communication

separately in cloudM.

When to Override the Agent

Ambassadors may escalate to an Operations Lead who can override any agent decision within their

P&L; authority. The override must be:

(cid:127) Logged in cloudM with a reason code within 2 hours

(cid:127) Consistent with service recovery authority limits

(cid:127) Not a pattern — repeated overrides of the same rule trigger a governance file review

Regulatory Notes for Property Teams

Guest data handled during check-in/checkout is processed under GDPR Article 6(b) — contractual

necessity. Automated checkout decisions are subject to GDPR Article 22 — guests may request human

review at any time. The Witness Agent log is the evidence trail for any such request.

