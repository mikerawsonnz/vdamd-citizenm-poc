# VDA-MD Architecture

## Current State

Single-file prototype (vdamd-template.jsx) for rapid demo. See full architecture below.

## Target Structure

- /config/industries.js
- /config/oscal.js
- /config/seed-log.js
- /components/Directory.jsx
- /components/Wizard.jsx
- /components/JourneyMap.jsx
- /components/AgentDrawer.jsx
- /components/C2MDStudio.jsx
- /components/ExceptionEngine.jsx
- /components/WitnessAgent.jsx
- /api/anthropic/route.js (CRITICAL - secure API key proxy)
- /lib/ingestion.js
- App.jsx

## Security

API key currently exposed in browser. /api/anthropic/route.js moves it server-side.

## Industries

Hospitality, Financial Services, Healthcare, Retail, Professional Services, Manufacturing.

## Regulatory Coverage

NIST SP 800-53 + GDPR + EU AI Act on every file. Industry frameworks (SOX, HIPAA, PCI DSS, IEC 62443) per config.

## C2MD IP

Original concept, no prior art as of March 2026. Commit c40641c = prior art record.
