---
control_id: S2P-approval-authority
domain: Shared Services / Finance (S2P)
journey_stage: Source-to-Pay
owner: CFO
authored_by: Head of Procurement
baseline: true
c2md_confidence: 0.91
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
expires: null
customer: citizenM Hotels
---

## Procurement Approval Authority — Baseline

All citizenM procurement follows the tiered approval
matrix below. Thresholds apply per purchase order.

### Approval Thresholds

| Amount        | Authority Required        |
|---------------|---------------------------|
| Up to €10k    | Department Head           |
| €10k – €50k   | Operations Director       |
| €50k – €250k  | CFO sign-off required     |
| Above €250k   | CFO + Board notification  |

Three competitive quotes required for all purchases
above €10,000 unless supplier holds current Preferred
Supplier List status.

### Agent Rules

- MUST NOT process PO above requestor's authority level
- MUST verify three-quote compliance above €10k
- MUST flag any non-Approved-Vendor supplier
- MUST confirm valid budget code before committing

### Violation Definition

PO without appropriate authority or required competitive
quotes = procurement violation → CFO notification.
