---
control_id: hospitality-stay-VIP-checkout-exception
exception_to: hospitality-stay-checkout
applies_to: citizenM Black membership tier
conditions:
  - EMEA properties only
  - Checkout time must not exceed 14:00
  - Active Black status verified in CRM
approved_by: COO
approved_date: 2026-01-15
expires: 2026-12-31
risk_level: low
customer: citizenM Hotels
---

## VIP Late Checkout — citizenM Black Exception

Active citizenM Black members receive automatic late
checkout to 14:00 at EMEA properties — no fee, no
availability check required.

### Exception Conditions

- Active (not suspended/expired) Black status in CRM
- Checkout MUST NOT exceed 14:00 under any circumstance
- EMEA properties only — not Americas or APAC
- Limited to the member's own booked room only

### Agent Rules (Override)

- MAY grant checkout to 14:00 without fee
- MAY skip availability check for verified Black members
- MUST verify active Black status in CRM before applying
- MUST NOT extend this exception beyond 14:00
- MUST log exception application in the Witness trail

### What Reverts to Baseline

- Any request beyond 14:00 → standard fee + approval
- Expired or suspended membership → baseline applies immediately
