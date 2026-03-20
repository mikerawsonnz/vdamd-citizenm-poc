# citizenM Technology Stack — Apaleo API Architecture
## Source: Goodbits/Sunrise API Overview (internal tech sheet, MarkItDown processed, Amadeus excluded)
## Status: 100% Apaleo — migration complete

---

## CRITICAL: citizenM System Architecture

citizenM runs entirely on Apaleo as its PMS. All reservation, guest, room, payment and finance
operations go through a Goodbits API gateway layer that wraps Apaleo's native endpoints.

### Core Systems
- **Apaleo** — Property Management System (PMS). The single source of truth for all reservations
- **Goodbits** — citizenM's internal API gateway layer over Apaleo. All agents call Goodbits, not Apaleo directly
- **Goodbits endpoints** use the pattern: `reservations/v2/...` and `invoices/v2/...`
- **Underlying Apaleo endpoints** follow: `/booking/v1/...`, `/inventory/v1/...`, `/finance/v1/...`, `/profile/v0-nsfw/...`
- **Auth0** — Identity and authentication provider
- **Adyen** — Payment processor (credit card, iDEAL, 3DS)
- **Contentful** — Configuration store for VCI room thresholds and operational parameters
- **Jira (Atlassian)** — All API work tracked under BAC tickets at citizenm.atlassian.net
- **Mamba** — Internal hotel operations BFF used by property staff

---

## DOMAIN: Operations / Stay (Check-in, Checkout, Room)

### Check-in Flow
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Check if check-in is allowed (VCI threshold) | GET reservations/v2/reservations/{reservationCode}/checkin-allowed | /inventory/v1/units — VCI threshold from Contentful |
| Get available VCI rooms | GET reservations/v2/reservations/{reservationCode}/available-rooms | /availability/v1/reservations/{id}/units |
| Assign room to reservation | PUT reservations/v2/reservations/{reservationCode}/actions/assign-room/{roomNumber} | /booking/v1/reservation-actions/{id}/assign-unit/{unitid} |
| Get room status for reservation | GET reservations/v2/reservations/{reservationCode}/room | /inventory/v1/units/{id} |
| Check in a reservation | PUT reservations/v2/reservations/{reservationCode}/actions/checkin | /booking/v1/reservation-actions/{id}/checkin |

### Checkout Flow
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Checkout a reservation | PUT reservations/v2/reservations/{reservationCode}/actions/checkout | /booking/v1/reservation-actions/{id}/checkout |
| Get amount due | GET reservations/v2/reservations/{reservationCode}/amount-due | /finance/v1/invoices/preview |

### Room Keys
| Action | Goodbits Endpoint |
|--------|-------------------|
| Get access keys for reservation | GET reservations/v2/reservations/{reservationCode}/keycards |
| Add access key | POST reservations/v2/reservations/{reservationCode}/keycards |
| Remove access key | DELETE reservations/v2/reservations/{reservationCode}/keycards/{id} |

### Agent Rules implication for Stay Agent:
- The Stay Agent calls Goodbits `reservations/v2/reservations/{reservationCode}/actions/checkout`
  which maps to Apaleo `/booking/v1/reservation-actions/{id}/checkout`
- Checkout time modifications are governed by hospitality-stay-checkout.md
- Late checkout to 14:00 for citizenM Black: the agent must verify Black status BEFORE
  calling Goodbits checkout — CRM verification precedes the Apaleo write
- VCI room threshold is configured in Contentful — the checkin-allowed endpoint checks this automatically

---

## DOMAIN: Business / Book (Booking Engine, Booking Management)

### Booking Engine
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Get availability / offers | GET reservations/v2/availability | /booking/v1/offers |
| Create booking | POST reservations/v2/bookings | /booking/v1/bookings |

### Booking Management
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Get single booking | GET reservations/v2/bookings/{bookingCode} | /booking/v1/bookings/{id} |
| Get reservation details | GET reservations/v2/reservations/{reservationCode} | /booking/v1/reservations/{id} |
| Search reservation by code | GET reservations/v2/search?code={code}&lastname={name} | — |
| Amend reservation (room type / dates / adults) | PUT reservations/v2/reservations/{reservationCode}/actions/amend | /booking/v1/reservation-actions/{id}/amend |
| Get offers for amendment | GET reservations/v2/reservations/{reservationCode}/offers | /booking/v1/reservations/{id}/offers |
| Cancel booking | PUT reservations/v2/reservations/{reservationCode}/actions/cancel | /booking/v1/reservation-actions/{id}/cancel |
| Calculate cancellation cost | GET reservations/v2/reservations/{reservationCode}/cancellation-calculation | /booking/v1/reservations/{id} |

### Extra Services
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Get available services | GET reservations/v2/reservations/{reservationCode}/services/offers | /booking/v1/reservations/{id}/service-offers |
| Add service | POST reservations/v2/reservations/{reservationCode}/services | /booking/v1/reservation-actions/{id}/book-service |
| Remove service | DELETE reservations/v2/reservations/{reservationCode}/services/{serviceId} | /booking/v1/reservations/{id}/services |

### Guest Management
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Replace primary guest | PUT reservations/v2/reservations/{reservationCode}/guests/primary | /booking/v1/reservations/{id} |
| Add additional guest | POST reservations/v2/reservations/{reservationCode}/guests/additional | /booking/v1/reservations/{id} |
| Remove additional guest | DELETE reservations/v2/reservations/{reservationCode}/guests/additional/{guestIndex} | /booking/v1/reservations/{id} |

### Agent Rules implication for Book Agent (Rate Override):
- Rate decisions are amendments: Goodbits PUT reservations/v2/reservations/{reservationCode}/actions/amend
  → Apaleo /booking/v1/reservation-actions/{id}/amend
- The Book Agent MUST NOT call the amend endpoint with a discount above the authority level in the
  rate override governance file
- Tier 1 Key Account exception: agent verifies Salesforce CRM tier BEFORE writing to Apaleo
- All rate decisions are logged to Witness Agent with the Goodbits endpoint called + Apaleo mapping

---

## DOMAIN: Shared Services / Finance (S2P, Invoice)

### Invoice & Finance
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Amount due | GET reservations/v2/reservations/{reservationCode}/amount-due | /finance/v1/invoices/preview |
| Get PDF invoice | GET invoices/v2/reservations/{reservationCode}/invoices/{invoiceId}/pdf | /finance/v1/invoices/{id}/pdf |
| Get proforma invoice PDF | GET invoices/v2/reservations/{reservationCode}/invoices/{invoiceId}/preview-pdf | /finance/v1/invoices/preview-pdf |

### Payment (via Adyen)
All payment processing is handled via Adyen. Payments are posted to Apaleo folios.
- Add payment to folio: POST /finance/v1/folios/{folioid}/payments (Apaleo native)
- Payment methods: credit card, iDEAL, Sofort, 3DS — all via Adyen
- Payment gateway: Goodbits → Adyen direct (not proxied through legacy systems)

### Company / Corporate Account
| Action | Goodbits Endpoint | Apaleo Endpoint |
|--------|-------------------|-----------------|
| Get company by code | GET reservations/v2/company/{id} | /profile/v0-nsfw/companies/{id} |
| Attach company to reservation | PATCH reservations/v2/reservations/{reservationCode}/company | /booking/v1/reservations/{id} |
| Remove company from reservation | DELETE reservations/v2/reservations/{reservationCode}/company | /booking/v1/reservations/{id} |

### S2P Agent implication:
- Procurement decisions result in SAP purchase orders — Apaleo is not in the S2P chain directly
- However, F&B and property services purchased through the Goodbits services endpoint
  (reservations/v2/reservations/{reservationCode}/services) DO trigger folio charges in Apaleo
- Budget codes in SAP must be validated BEFORE any Apaleo folio charge is committed

---

## DOMAIN: Shared Services / HRpay (Access, Identity)

### System Access & Identity
- **Auth0** handles authentication for all citizenM staff and guest digital touchpoints
- Passport data: POST reservations/v2/reservations/{reservationCode}/passport → /api/identitydocument/post
- Housekeeping attributes: PATCH reservations/v2/reservations/{reservationCode}/attributes
- Staff system access is managed via Workday (HR system of record) — Apaleo access is provisioned
  separately per property assignment

### HRpay Agent implication:
- New staff accessing cloudM (Goodbits/Apaleo) need property-level access configured in Apaleo
- The Workday manager request triggers access provisioning in BOTH Apaleo AND Auth0
- The CISO fast-track exception covers Digital/Tech staff who need Apaleo dev environment access
  before their start date — this is specifically the Apaleo sandbox, not the production tenant
- Deactivation on departure: Auth0 account disabled + Apaleo user access revoked same day

---

## AUTH MODEL (citizenM Goodbits API)

Three authentication levels govern which endpoints each caller can access:

| Auth Level | Who | Access |
|------------|-----|--------|
| all/trusted environment | Server-to-server, Operations systems | Full read/write |
| Booker | Authenticated booker via citizenM App or Web | Own bookings only |
| PrimaryGuest | Authenticated primary guest | Own reservation |
| SecondaryGuest | Secondary guest on a reservation | Limited own-reservation access |

### Implication for AI Agent governance:
- AI agents operating in trusted environment have elevated access
- Governance files MUST specify which auth level the agent operates at
- MUST NOT use trusted environment credentials for operations that should be guest-authenticated
- Witness Agent logs MUST record the auth level used for each API call

---

## KEY API PATTERNS

- All reservation IDs use {reservationCode} in Goodbits (maps to Apaleo {id})
- All booking IDs use {bookingCode} in Goodbits
- Actions (checkin, checkout, amend, cancel) all follow the pattern:
  PUT reservations/v2/reservations/{reservationCode}/actions/{action-name}
  → Apaleo: /booking/v1/reservation-actions/{id}/{action-name}
- Finance operations: /finance/v1/folios/{folioid}/... (Apaleo native)
- Inventory/rooms: /inventory/v1/units/{id} (Apaleo native)
- Profiles/companies: /profile/v0-nsfw/... (Apaleo native)
