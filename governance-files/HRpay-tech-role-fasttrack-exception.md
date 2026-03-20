---
control_id: HRpay-tech-role-fasttrack-exception
exception_to: HRpay-onboarding-system-access
applies_to: Digital and Technology roles — all citizenM properties
conditions:
  - Role classified as Digital/Tech in Workday
  - Head of Tech submits fast-track request
  - CISO sign-off required per individual request
  - Maximum 5 working days before start date
approved_by: CISO
consulted: [CPO]
approved_date: 2026-02-15
expires: 2026-12-31
risk_level: medium
customer: citizenM Hotels
---

## Tech Role Fast-Track Access Exception

Digital and Technology roles may have access provisioned
up to 5 working days before the start date — with
individual CISO sign-off on each request.

### Exception Conditions

- Role must be formally classified as Digital/Tech
  in Workday (not self-declared)
- Head of Tech must submit the fast-track request
- CISO must provide sign-off for each individual request
- Maximum pre-provisioning window: 5 working days

### Agent Rules (Override)

- MAY provision access up to 5 days before start date
  for eligible tech roles WITH CISO sign-off documented
- MUST verify Tech role classification in Workday first
- MUST confirm documented CISO sign-off exists
- MUST flag and NOT provision if CISO sign-off missing

### What Reverts to Baseline

- Non-Digital/Tech roles → baseline applies strictly
- Fast-track requests without CISO sign-off → FAIL
- Pre-provisioning beyond 5 working days → FAIL
