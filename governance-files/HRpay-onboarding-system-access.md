---
control_id: HRpay-onboarding-system-access
domain: HR / Onboarding-to-Final-Pay
journey_stage: HRpay — Onboarding
owner: Chief People Officer
authored_by: Head of HR
baseline: true
c2md_confidence: 0.94
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
expires: null
customer: citizenM Hotels
---

## Staff System Access Provisioning — Baseline

All citizenM employee accounts require a formal manager
request in Workday before any access is granted.

### Timing Rules

- Provisioning may NOT begin before the employee's
  confirmed start date under any circumstances
- Provisioning must be completed within 48 hours of
  the confirmed start date
- Early provisioning (before start date) is NOT
  permitted under this baseline policy

### Agent Rules

- MUST NOT activate any account without a logged
  manager request in Workday (system of record)
- MUST verify start date and cost centre before
  initiating provisioning
- MUST confirm access level matches role requirements
- MUST send confirmation to manager + employee
  within 24 hours of provisioning

### Violation Definition

Account activated without Workday manager request, or
provisioned before start date = access control violation
→ immediate CISO notification required.
