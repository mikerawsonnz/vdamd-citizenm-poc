import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  bg:       "#07080a",
  surface:  "#0d0f12",
  card:     "#111418",
  border:   "#1e2229",
  borderHi: "#2e3340",
  orange:   "#FF6B2B",
  blue:     "#4A9EFF",
  purple:   "#A066FF",
  green:    "#22D47A",
  red:      "#FF4D6A",
  amber:    "#FFB020",
  teal:     "#00C9C8",
  text:     "#F0F2F5",
  muted:    "#CBD2E0",
  dim:      "#9AA3B5",
  mono:     "'IBM Plex Mono', 'Fira Code', 'Cascadia Code', monospace",
  sans:     "'Outfit', 'DM Sans', 'Segoe UI', sans-serif",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Outfit:wght@300;400;600;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.borderHi}; }
  select option { background: ${T.card}; color: ${T.text}; }
  @keyframes pulse-ring { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes slide-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,107,43,0); } 50% { box-shadow: 0 0 24px 4px rgba(255,107,43,0.25); } }
  @keyframes badge-in { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
  @keyframes tour-card-in { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes spotlight-pulse { 0%,100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.82), 0 0 0 2px #FF6B2B, 0 0 40px 6px rgba(255,107,43,0.35); } 50% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.82), 0 0 0 3px #FF6B2B, 0 0 70px 14px rgba(255,107,43,0.18); } }
  @keyframes welcome-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
  @keyframes progress-fill { from { width:0; } to { width:100%; } }
`;


// ─────────────────────────────────────────────
// GDPR & EU AI ACT COMPLIANCE SOURCES
// ─────────────────────────────────────────────
const GDPR = {
  "Art-5": {
    id: "Art-5",
    title: "Principles Relating to Processing of Personal Data",
    chapter: "Chapter II — Principles",
    summary: "Personal data shall be processed lawfully, fairly and transparently. Collected for specified, explicit and legitimate purposes. Adequate, relevant and limited to what is necessary (data minimisation). Accurate and kept up to date. Retained no longer than necessary (storage limitation). Processed with appropriate security (integrity and confidentiality).",
    prose: `Article 5 — Principles relating to processing of personal data

1. Personal data shall be:
(a) processed lawfully, fairly and in a transparent manner in relation to the data subject ('lawfulness, fairness and transparency');
(b) collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes ('purpose limitation');
(c) adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed ('data minimisation');
(d) accurate and, where necessary, kept up to date ('accuracy');
(e) kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed ('storage limitation');
(f) processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures ('integrity and confidentiality').

2. The controller shall be responsible for, and be able to demonstrate compliance with, paragraph 1 ('accountability').`
  },
  "Art-6": {
    id: "Art-6",
    title: "Lawfulness of Processing",
    chapter: "Chapter II — Principles",
    summary: "Processing is lawful only if at least one of the specified legal bases applies: consent, contractual necessity, legal obligation, vital interests, public task, or legitimate interests. The legal basis must be established before processing begins.",
    prose: `Article 6 — Lawfulness of processing

1. Processing shall be lawful only if and to the extent that at least one of the following applies:
(a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes;
(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract;
(c) processing is necessary for compliance with a legal obligation to which the controller is subject;
(d) processing is necessary in order to protect the vital interests of the data subject or of another natural person;
(e) processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;
(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject.`
  },
  "Art-13": {
    id: "Art-13",
    title: "Information to Be Provided — Data Collected from Data Subject",
    chapter: "Chapter III — Rights of the Data Subject",
    summary: "Where personal data are collected from the data subject, the controller must provide information including: identity and contact details of the controller, purposes and legal basis for processing, recipients, retention periods, and the existence of automated decision-making including profiling.",
    prose: `Article 13 — Information to be provided where personal data are collected from the data subject

1. Where personal data relating to a data subject are collected from the data subject, the controller shall, at the time when personal data are obtained, provide the data subject with all of the following information:
(a) the identity and the contact details of the controller;
(b) the contact details of the data protection officer, where applicable;
(c) the purposes of the processing for which the personal data are intended as well as the legal basis for the processing;
(d) where the processing is based on legitimate interests, the legitimate interests pursued;
(e) the recipients or categories of recipients of the personal data, if any;
(f) where applicable, the fact that the controller intends to transfer personal data to a third country.

2. In addition, the controller shall provide the data subject with the following information necessary to ensure fair and transparent processing:
(a) the period for which the personal data will be stored;
(b) the existence of the right to request from the controller access to and rectification or erasure of personal data;
(f) where the processing is based on consent, the existence of the right to withdraw consent at any time;
(h) the existence of automated decision-making, including profiling, and meaningful information about the logic involved and the significance and envisaged consequences of such processing for the data subject.`
  },
  "Art-22": {
    id: "Art-22",
    title: "Automated Individual Decision-Making, Including Profiling",
    chapter: "Chapter III — Rights of the Data Subject",
    summary: "The data subject has the right not to be subject to a decision based solely on automated processing which produces legal effects or similarly significantly affects them. Exceptions apply for contractual necessity, legal authorisation, or explicit consent — but suitable safeguards must include the right to obtain human intervention, express their point of view, and contest the decision.",
    prose: `Article 22 — Automated individual decision-making, including profiling

1. The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her.

2. Paragraph 1 shall not apply if the decision:
(a) is necessary for entering into, or performance of, a contract between the data subject and a data controller;
(b) is authorised by Union or Member State law to which the controller is subject and which also lays down suitable measures to safeguard the data subject's rights and freedoms and legitimate interests; or
(c) is based on the data subject's explicit consent.

3. In the cases referred to in points (a) and (c) of paragraph 2, the data controller shall implement suitable measures to safeguard the data subject's rights and freedoms and legitimate interests, at least the right to obtain human intervention on the part of the controller, to express his or her point of view and to contest the decision.`
  },
  "Art-25": {
    id: "Art-25",
    title: "Data Protection by Design and by Default",
    chapter: "Chapter IV — Controller and Processor",
    summary: "The controller shall implement appropriate technical and organisational measures designed to implement data-protection principles and integrate necessary safeguards into processing. By default, only personal data necessary for each specific purpose shall be processed.",
    prose: `Article 25 — Data protection by design and by default

1. Taking into account the state of the art, the cost of implementation and the nature, scope, context and purposes of processing as well as the risks of varying likelihood and severity for rights and freedoms of natural persons posed by the processing, the controller shall, both at the time of the determination of the means for processing and at the time of the processing itself, implement appropriate technical and organisational measures designed to implement data-protection principles and to integrate the necessary safeguards into the processing.

2. The controller shall implement appropriate technical and organisational measures for ensuring that, by default, only personal data which are necessary for each specific purpose of the processing are processed. That obligation applies to the amount of personal data collected, the extent of their processing, the period of their storage and their accessibility.`
  },
  "Art-32": {
    id: "Art-32",
    title: "Security of Processing",
    chapter: "Chapter IV — Controller and Processor",
    summary: "Taking into account the state of the art and costs, the controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk — including pseudonymisation, encryption, ongoing confidentiality, integrity, availability and resilience, and regular testing.",
    prose: `Article 32 — Security of processing

1. Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, the controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including inter alia as appropriate:
(a) the pseudonymisation and encryption of personal data;
(b) the ability to ensure the ongoing confidentiality, integrity, availability and resilience of processing systems and services;
(c) the ability to restore the availability and access to personal data in a timely manner in the event of a physical or technical incident;
(d) a process for regularly testing, assessing and evaluating the effectiveness of technical and organisational measures for ensuring the security of the processing.`
  },
};

const EU_AI_ACT = {
  "Art-9": {
    id: "Art-9",
    title: "Risk Management System",
    chapter: "Chapter 2 — Requirements for High-Risk AI Systems",
    riskClass: "High-Risk",
    summary: "A risk management system shall be established, implemented, documented and maintained for high-risk AI systems. It shall be a continuous iterative process run throughout the entire lifecycle, identifying and analysing known and foreseeable risks, estimating and evaluating risks that may emerge, and evaluating residual risks after mitigation measures.",
    prose: `Article 9 — Risk management system

1. A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.

2. The risk management system shall consist of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic review and updating. It shall comprise the following steps:
(a) identification and analysis of the known and reasonably foreseeable risks that the high-risk AI system can pose to health, safety or fundamental rights when used in accordance with its intended purpose;
(b) estimation and evaluation of the risks that may emerge when the high-risk AI system is used in accordance with its intended purpose, and under conditions of reasonably foreseeable misuse;
(c) evaluation of other risks possibly arising based on the analysis of data gathered from the post-market monitoring system;
(d) adoption of appropriate and targeted risk management measures designed to address the risks identified.

3. The risk management measures referred to in point (d) shall give due consideration to the effects and possible interactions resulting from the combined application of the requirements set out in this Chapter. They shall take into account the generally acknowledged state of the art, including as reflected in relevant harmonised standards or common specifications.`
  },
  "Art-12": {
    id: "Art-12",
    title: "Record-Keeping",
    chapter: "Chapter 2 — Requirements for High-Risk AI Systems",
    riskClass: "High-Risk",
    summary: "High-risk AI systems shall be designed and developed with capabilities enabling automatic recording of events ('logs') throughout their lifetime. The logging capabilities shall ensure a level of traceability appropriate to the intended purpose, enabling monitoring of the operation of the system, verification of correct functioning, and supporting post-market monitoring.",
    prose: `Article 12 — Record-keeping

1. High-risk AI systems shall be designed and developed with capabilities enabling the automatic recording of events ('logs') throughout the lifetime of the system.

2. In order to ensure a level of traceability of the AI system's functioning throughout its lifecycle that is appropriate to the intended purpose of the system, the logging capabilities shall enable the recording of events relevant for:
(a) identifying situations that may result in the AI system presenting a risk within the meaning of Article 79(1) or in a substantial modification;
(b) facilitating the post-market monitoring referred to in Article 72; and
(c) monitoring the operation of high-risk AI systems referred to in Article 26(5).

3. For high-risk AI systems referred to in Annex III, point 1(a), the logging capabilities shall provide, at a minimum:
(a) recording of the period of each use of the system (start date and time and end date and time of each use);
(b) the reference database against which the input data has been checked by the system;
(c) the input data for which the search has led to a match;
(d) the identity of the natural persons involved in the verification of the results.`
  },
  "Art-13": {
    id: "Art-13",
    title: "Transparency and Provision of Information to Deployers",
    chapter: "Chapter 2 — Requirements for High-Risk AI Systems",
    riskClass: "High-Risk",
    summary: "High-risk AI systems shall be designed and developed in a way that ensures that their operation is sufficiently transparent to enable deployers to interpret the system's output and use it appropriately. Instructions for use must include information about the intended purpose, level of accuracy, known limitations, human oversight measures, and expected lifetime.",
    prose: `Article 13 — Transparency and provision of information to deployers

1. High-risk AI systems shall be designed and developed in such a way to ensure that their operation is sufficiently transparent to enable deployers to interpret the system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured with a view to achieving compliance with the relevant obligations of the provider and deployer.

2. High-risk AI systems shall be accompanied by instructions for use in an appropriate digital format or otherwise that include concise, complete, correct and clear information that is relevant, accessible and comprehensible to deployers.

3. The information referred to in paragraph 2 shall specify:
(a) the identity and the contact details of the provider and, where applicable, of its authorised representative;
(b) the characteristics, capabilities and limitations of performance of the high-risk AI system, including:
    (i) its intended purpose;
    (ii) the level of accuracy, including its metrics, robustness and cybersecurity against which the high-risk AI system has been tested and validated and which can be expected, and any known and foreseeable circumstances that may have an impact on that expected level of accuracy;
    (iii) any known or foreseeable circumstance, related to the use of the high-risk AI system in accordance with its intended purpose or under conditions of reasonably foreseeable misuse, which may lead to risks to health, safety or fundamental rights;
(c) the human oversight measures referred to in Article 14, including the technical measures put in place to facilitate the interpretation of the outputs of high-risk AI systems by the deployers;
(d) the expected lifetime of the high-risk AI system and any necessary maintenance and care measures to ensure the proper functioning of that AI system.`
  },
  "Art-14": {
    id: "Art-14",
    title: "Human Oversight",
    chapter: "Chapter 2 — Requirements for High-Risk AI Systems",
    riskClass: "High-Risk",
    summary: "High-risk AI systems shall be designed and developed so that they can be effectively overseen by natural persons during the period of use. Human oversight measures shall prevent or minimise risks, allow humans to decide not to use the system in a given situation, allow humans to intervene on or interrupt the system, and ensure humans are aware of the tendency to over-rely on outputs.",
    prose: `Article 14 — Human oversight

1. High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which the AI system is in use.

2. Human oversight shall aim at preventing or minimising the risks to health, safety or fundamental rights that may emerge when a high-risk AI system is used in accordance with its intended purpose or under conditions of reasonably foreseeable misuse.

3. The oversight measures shall be commensurate with the risks, the level of autonomy and the context of use of the high-risk AI system. In particular, human oversight measures shall ensure that:
(a) individuals to whom human oversight is assigned have the necessary competence, training and authority to carry out that role;
(b) individuals referred to in point (a) are aware of the tendency of humans to automatically over-rely on or to unduly rely on the output produced by a high-risk AI system ('automation bias');
(c) individuals referred to in point (a) are able to correctly interpret the high-risk AI system's output, taking into account the characteristics of the system and the interpretation tools and methods available;
(d) individuals referred to in point (a) are able, through appropriate interfaces, to decide not to use the high-risk AI system in a given situation, to override a decision or recommendation produced by a high-risk AI system or to interrupt the operation of the system;
(e) individuals referred to in point (a) are able to intervene on the operation of the high-risk AI system or interrupt the system through a 'stop' button or a similar procedure.`
  },
  "Art-17": {
    id: "Art-17",
    title: "Quality Management System",
    chapter: "Chapter 3 — Obligations of Providers",
    riskClass: "High-Risk",
    summary: "Providers of high-risk AI systems shall put a quality management system in place that ensures compliance with this Regulation. The system shall be documented as policies, procedures and instructions covering: strategy for compliance, design and development procedures, monitoring and evaluation, post-market monitoring, and serious incident reporting.",
    prose: `Article 17 — Quality management system

1. Providers of high-risk AI systems shall put a quality management system in place that ensures compliance with this Regulation. That system shall be documented in a systematic and orderly manner in the form of written policies, procedures and instructions, and shall include at least the following aspects:
(a) a strategy for regulatory compliance, including compliance with conformity assessment procedures and procedures for the management of modifications to the high-risk AI system;
(b) techniques, procedures and systematic actions to be used for the design, design control and design verification of the high-risk AI system;
(c) techniques, procedures and systematic actions to be used for the development, quality control and quality assurance of the high-risk AI system;
(d) examination, test and validation procedures to be carried out before, during and after the development of the high-risk AI system, and the frequency with which they have to be carried out;
(e) technical specifications, including standards, to be applied and, where the relevant harmonised standards are not applied in full, the means to be used to ensure that the high-risk AI system complies with this Regulation;
(f) systems and procedures for data management, including data collection, data analysis, data labelling, data storage, data filtration, data mining, data aggregation, data retention and any other operation regarding the data that is performed before and for the purposes of the placing on the market or putting into service of high-risk AI systems;
(g) the risk management system referred to in Article 9;
(h) the setting-up, implementation and maintenance of a post-market monitoring system, in accordance with Article 72;
(i) procedures related to the reporting of serious incidents in accordance with Article 73;
(j) the handling of communication with national competent authorities and other relevant authorities.`
  },
};

// ─────────────────────────────────────────────
// NIST CONTROLS DATA — Real OSCAL source only.
// The .md output is generated live by Claude via C2MD pipeline.
// ─────────────────────────────────────────────
const NIST = {
  "AC-2": {
    title: "Account Management",
    family: "Access Control (AC)",
    description: "Manage information system accounts including types, roles, and access authorizations throughout the full account lifecycle.",
    domain: "HRpay",
    domainLabel: "Onboarding-to-Final-Pay",
    owner: "Chief People Officer",
    authored_by: "Head of HR",
    oscal: `{
  "id": "ac-2",
  "class": "SP800-53",
  "title": "Account Management",
  "props": [
    { "name": "label", "value": "AC-2" },
    { "name": "sort-id", "value": "ac-02" }
  ],
  "parts": [
    {
      "id": "ac-2_smt",
      "name": "statement",
      "prose": "Manage information system accounts, including:\\na. Identifying account types (individual, group, system, application, guest/anonymous, temporary, and emergency);\\nb. Establishing conditions for group and role membership;\\nc. Identifying authorized users and specifying access privileges;\\nd. Requiring approvals for requests to create accounts;\\ne. Creating, enabling, modifying, disabling, and removing accounts in accordance with account management policy;\\nf. Monitoring use of accounts;\\ng. Notifying account managers when accounts are no longer required, users are terminated, or system usage changes;\\nh. Authorizing access based on valid access authorization and intended system usage;\\ni. Reviewing accounts for compliance with account management requirements at least annually;\\nj. Establishing and implementing processes for employment termination, including disabling access on day of termination;\\nk. Auditing account creation, modification, disabling, and removal actions."
    },
    {
      "id": "ac-2_gdn",
      "name": "guidance",
      "prose": "Account management includes the identification and selection of appropriate information system account types to support the mission and business functions of the organization. Standard account types include individual, shared, group, system, application, guest/anonymous, temporary, and emergency. Temporary and emergency accounts are intended for short-term use and must be formally authorized and monitored."
    }
  ]
}`
  },
  "AU-2": {
    title: "Event Logging",
    family: "Audit & Accountability (AU)",
    description: "Identify the types of events that the system is capable of logging and coordinate the event logging function with other entities.",
    domain: "Witness Agent",
    domainLabel: "Cross-cutting / All Domains",
    owner: "CISO",
    authored_by: "CISO Office",
    oscal: `{
  "id": "au-2",
  "class": "SP800-53",
  "title": "Event Logging",
  "props": [
    { "name": "label", "value": "AU-2" },
    { "name": "sort-id", "value": "au-02" }
  ],
  "parts": [
    {
      "id": "au-2_smt",
      "name": "statement",
      "prose": "a. Identify the types of events that the system is capable of logging in support of the audit function;\\nb. Coordinate the event logging function with other entities requiring audit-related information to guide and inform the selection criteria for events to be logged;\\nc. Specify the following event types for logging: [successful and unsuccessful account logon events, account management events, object access, policy change, privilege functions, process tracking, system events. For web applications: all administrator activity, authentication checks, authorization checks, data deletions, data access, data changes, and permission changes];\\nd. Provide a rationale for why the event types selected for logging are deemed adequate to support after-the-fact investigations of security incidents;\\ne. Review and update the event types selected for logging annually or whenever there is a change in the threat environment."
    },
    {
      "id": "au-2_gdn",
      "name": "guidance",
      "prose": "An event is any observable occurrence in an organizational system. Organizations identify event types for which the system is capable of providing an audit record. The event types are balanced against log management capability, storage capacity, and information security objectives. Audit logging must be performed before system action is taken to ensure accountability."
    }
  ]
}`
  },
  "SA-4": {
    title: "Acquisition Process",
    family: "System & Services Acquisition (SA)",
    description: "Include security and privacy requirements and specifications in acquisition contracts for systems, components, and services.",
    domain: "S2P",
    domainLabel: "Source-to-Pay",
    owner: "CFO",
    authored_by: "Head of Procurement",
    oscal: `{
  "id": "sa-4",
  "class": "SP800-53",
  "title": "Acquisition Process",
  "props": [
    { "name": "label", "value": "SA-4" },
    { "name": "sort-id", "value": "sa-04" }
  ],
  "parts": [
    {
      "id": "sa-4_smt",
      "name": "statement",
      "prose": "Include the following requirements, descriptions, and criteria, explicitly or by reference, using [Assignment: standardized contract language] in the acquisition contract for the system, system component, or system service:\\na. Security and privacy functional requirements;\\nb. Strength of mechanism requirements;\\nc. Security and privacy assurance requirements;\\nd. Controls needed to satisfy security and privacy requirements;\\ne. Security and privacy documentation requirements;\\nf. Requirements for protecting security and privacy documentation;\\ng. Description of the system development environment and functions to be protected;\\nh. Allocation of responsibility or identification of parties responsible for addressing security and privacy requirements;\\ni. Acceptance criteria."
    },
    {
      "id": "sa-4_gdn",
      "name": "guidance",
      "prose": "Security and privacy requirements and controls can include supply chain risk management program requirements. Organizations define contractual requirements for system development in the system development life cycle. Contracts include provisions requiring developers to implement approved security and privacy assessment plans and execute security and privacy assessments during the development process."
    }
  ]
}`
  },
  "IR-4": {
    title: "Incident Handling",
    family: "Incident Response (IR)",
    description: "Implement an incident handling capability that includes preparation, detection, analysis, containment, eradication, and recovery.",
    domain: "Operations",
    domainLabel: "Stay / Cross-cutting",
    owner: "CISO",
    authored_by: "Head of Security Operations",
    oscal: `{
  "id": "ir-4",
  "class": "SP800-53",
  "title": "Incident Handling",
  "props": [
    { "name": "label", "value": "IR-4" },
    { "name": "sort-id", "value": "ir-04" }
  ],
  "parts": [
    {
      "id": "ir-4_smt",
      "name": "statement",
      "prose": "a. Implement an incident handling capability for incidents that includes preparation, detection and analysis, containment, eradication, and recovery;\\nb. Coordinate incident handling activities with contingency planning activities;\\nc. Incorporate lessons learned from ongoing incident handling activities into incident response procedures, training, and testing, and implement the resulting changes accordingly;\\nd. Ensure the rigor, intensity, scope, and results of incident handling activities are comparable and predictable across the organization."
    },
    {
      "id": "ir-4_gdn",
      "name": "guidance",
      "prose": "Organizations recognize that incident handling capability is dependent on the capabilities of organizational systems and the mission/business processes being supported by those systems. Incident-related information can be obtained from various sources, including audit records, intrusion detection and prevention systems, and network monitoring tools. Effective incident handling includes coordination among many organizational entities, including mission/business owners, system owners, authorizing officials, human resources, physical and personnel security, legal counsel, and operations personnel."
    }
  ]
}`
  }
};

// ─────────────────────────────────────────────
// SCENARIO GOVERNANCE FILES
// ─────────────────────────────────────────────
const SCENARIOS = {
  stay: {
    id: "stay", label: "VIP Late Checkout", icon: "🏨",
    domain: "Operations", journeyStage: "Stay", color: T.orange,
    description: "Operations agent handles a guest checkout time request",
    baselineFile: {
      name: "hospitality-stay-checkout.md", type: "SOP", owner: "Operations Director",
      content: `---
control_id: hospitality-stay-checkout
domain: Operations / Stay
journey_stage: Stay
owner: Operations Director
baseline: true
c2md_confidence: 0.96
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
expires: null
---

## Guest Checkout Policy — Baseline

Standard checkout at all citizenM properties: 11:00 AM.

### Late Checkout Rules

| Time Window   | Condition                          | Fee |
|---------------|------------------------------------|-----|
| Up to 13:00   | Subject to housekeeping capacity   | €20 |
| 13:00–15:00   | Operations Director authorisation  | €40 |
| After 15:00   | Additional night booking required  | —   |

### Agent Rules

- MUST check housekeeping availability before offering
  any late checkout
- MUST NOT waive the late checkout fee without
  Operations Director authorisation
- MUST log all checkout modification requests in PMS
- MUST confirm valid departure date before any modification

### Violation Definition

Late checkout granted without availability confirmation
or fee collection = revenue control violation.`
    },
    exceptionFile: {
      name: "hospitality-stay-VIP-checkout-exception.md", type: "EXCEPTION", owner: "COO",
      content: `---
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

### Apaleo Flow for Black Exception

1. Verify citizenM Black status in Salesforce CRM (BEFORE any Apaleo write)
2. Call Goodbits: PUT reservations/v2/reservations/{code}/actions/checkout
3. Goodbits writes to Apaleo: /booking/v1/reservation-actions/{id}/checkout
4. Witness Agent logs exception flag + Goodbits endpoint + Apaleo mapping

### Agent Rules (Override)

- MAY call Goodbits checkout endpoint for 14:00 departure without fee
- MAY skip VCI availability check (Contentful threshold) for verified Black members
- MUST verify active Black status in Salesforce CRM before calling any Goodbits endpoint
- MUST NOT call checkout endpoint with departure time beyond 14:00 under this exception
- MUST write Witness Agent entry with exception_applied: true before Goodbits call
- Auth level: trusted environment — same as baseline

### What Reverts to Baseline

- Any request beyond 14:00 → standard fee + approval
- Expired or suspended membership → baseline applies immediately`
    },
    params: [
      { id: "memberTier", label: "Membership Tier", options: ["Standard guest", "citizenM Black"] },
      { id: "checkoutTime", label: "Requested Checkout", options: ["12:00", "13:30", "14:00", "15:30"] },
      { id: "region", label: "Property Region", options: ["EMEA", "Americas", "APAC"] },
      { id: "memberStatus", label: "Membership Status", options: ["Active", "Expired", "Suspended"] },
    ],
    defaultParams: { memberTier: "citizenM Black", checkoutTime: "13:30", region: "EMEA", memberStatus: "Active" }
  },

  s2p: {
    id: "s2p", label: "Supplier Invoice", icon: "📋",
    domain: "Shared Services", journeyStage: "Source-to-Pay", color: T.green,
    description: "Procurement agent processes a supplier invoice — approval authority check",
    baselineFile: {
      name: "S2P-approval-authority.md", type: "SOP", owner: "CFO",
      content: `---
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

### Apaleo & System Architecture

- SAP = purchase orders and budget codes (system of record for spend)
- Apaleo/Goodbits = property service charges via POST reservations/v2/reservations/{code}/services
- Folio charges commit via Apaleo: POST /finance/v1/folios/{folioid}/payments
- SAP budget code MUST be validated before any Apaleo folio charge
- Preferred Tech status verified in SAP vendor master

### Agent Rules

- MUST NOT raise SAP PO above requestor's delegated authority level
- MUST NOT commit Apaleo folio charges without a valid SAP budget code
- MUST verify three-quote compliance above €10k (unless Preferred Tech EMEA exception applies)
- MUST flag any supplier not on the SAP Approved Vendor list
- MUST log decision to Witness Agent with SAP PO reference before committing

### Violation Definition

SAP PO or Apaleo folio charge committed without appropriate authority or required
competitive quotes = procurement control violation → CFO notification.`
    },
    exceptionFile: {
      name: "S2P-preferred-tech-supplier-exception.md", type: "EXCEPTION", owner: "CFO",
      content: `---
control_id: S2P-preferred-tech-supplier-exception
exception_to: S2P-approval-authority
applies_to: citizenM Preferred Tech Supplier List — EMEA
conditions:
  - Current Preferred Tech status (annual review)
  - EMEA invoices only
  - Invoice value must not exceed €75,000
  - Three-quote requirement waived for these suppliers
approved_by: CFO
consulted: [Legal, CISO]
approved_date: 2026-01-10
expires: 2026-12-31
risk_level: medium
---

## Preferred Tech Supplier Exception — EMEA

Suppliers on citizenM's Preferred Tech Supplier List
(EMEA) may be approved at Operations Director level up
to €75,000 — no three-quote requirement applies.

### Exception Conditions

- Supplier must appear on current Preferred Tech List
  (annual renewal — verify currency in Procurement system)
- Invoice must relate to EMEA operations
- Invoice value must not exceed €75,000

### Agent Rules (Override)

- MAY raise SAP PO up to €75,000 at Operations Director level for current Preferred Tech suppliers
- MAY waive three-quote requirement — verify status in SAP vendor master first
- MAY commit Apaleo folio charges for Preferred Tech services without three-quote evidence
- MUST verify current Preferred Tech status in SAP vendor master before applying exception
- MUST write Witness Agent entry with exception_applied: true + SAP vendor master reference
- CFO approval still required for any SAP PO above €75,000 — exception ceiling is hard

### What Reverts to Baseline

- Invoices above €75,000 → standard CFO approval required
- Non-EMEA invoices → standard thresholds apply
- Expired preferred status → full baseline immediately applies`
    },
    params: [
      { id: "supplierStatus", label: "Supplier Status", options: ["Standard vendor", "Preferred Tech (EMEA)"] },
      { id: "amount", label: "Invoice Amount", options: ["€30,000", "€60,000", "€80,000"] },
      { id: "region", label: "Invoice Region", options: ["EMEA", "Americas"] },
      { id: "quotes", label: "Competitive Quotes", options: ["3 quotes on file", "No quotes provided"] },
    ],
    defaultParams: { supplierStatus: "Preferred Tech (EMEA)", amount: "€60,000", region: "EMEA", quotes: "No quotes provided" }
  },

  book: {
    id: "book", label: "Rate Override", icon: "🛎️",
    domain: "Business", journeyStage: "Book", color: T.blue,
    description: "Sales agent requests a discount override for a corporate booking",
    baselineFile: {
      name: "hospitality-book-rate-override.md", type: "SOP", owner: "VP Revenue",
      content: `---
control_id: hospitality-book-rate-override
domain: Business / Book
journey_stage: Book
owner: VP Revenue
baseline: true
c2md_confidence: 0.93
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
expires: null
---

## Rate Override Authority — Baseline

All citizenM room rate discounts require authorisation
at the following thresholds.

### Discount Authority Matrix

| Discount Level | Authority Required      |
|----------------|-------------------------|
| Up to 10%      | Revenue Manager         |
| 10% – 20%      | VP Revenue sign-off     |
| 20% – 30%      | Chief Revenue Officer   |
| Above 30%      | CRO + CEO notification  |

Discounts apply to room rate only. F&B and ancillary
pricing are outside the scope of this policy.

### Apaleo Endpoint for Rate Amendments

- GET reservations/v2/reservations/{code}/offers → obtain valid offer for amendment
- PUT reservations/v2/reservations/{code}/actions/amend → writes to Apaleo /booking/v1/reservation-actions/{id}/amend
- Auth level: trusted environment required

### Agent Rules

- MUST NOT call Goodbits amend endpoint with a discount above the requestor's authority level
- MUST call the offers endpoint first to obtain a valid UpdateReservationOfferRequestModel
- MUST verify rate parity obligations before constructing the amend request
- MUST log business justification for any discount above 10% in Witness Agent entry
- MUST include Goodbits endpoint + Apaleo mapping in every Witness Agent log entry

### Violation Definition

Goodbits amend endpoint called with unapproved discount (Apaleo write committed without authority)
= revenue integrity violation → Apaleo write must be reversed, VP Revenue notified.`
    },
    exceptionFile: {
      name: "hospitality-book-key-account-exception.md", type: "EXCEPTION", owner: "VP Revenue",
      content: `---
control_id: hospitality-book-key-account-exception
exception_to: hospitality-book-rate-override
applies_to: citizenM Key Account Programme — Tier 1 corporates
conditions:
  - Active Key Account Tier 1 status in Salesforce CRM
  - Room bookings only (not F&B or events)
  - Maximum discount 18%
approved_by: VP Revenue
consulted: [CFO]
approved_date: 2026-02-01
expires: 2026-12-31
risk_level: low
---

## Key Account Rate Exception — Tier 1 Corporates

Accounts with citizenM Key Account Tier 1 status are
pre-approved for up to 18% room rate discount at
Revenue Manager authority — no VP Revenue sign-off needed.

### Exception Conditions

- Active Tier 1 status verified in Salesforce CRM
- Room bookings only — F&B explicitly excluded
- Maximum discount: 18% (exception does NOT extend beyond 18%)
- Rate parity obligations must still be verified

### Agent Rules (Override)

- MAY approve up to 18% for Tier 1 accounts at
  Revenue Manager authority
- MUST verify Tier 1 status in Salesforce before applying
- MUST still verify rate parity compliance
- Any request above 18% requires VP Revenue approval

### What Reverts to Baseline

- Discount requests above 18% → VP Revenue required
- Non-room rate overrides → baseline applies
- Accounts not on Tier 1 list → baseline applies`
    },
    params: [
      { id: "accountType", label: "Account Type", options: ["Standard corporate", "Key Account Tier 1"] },
      { id: "discount", label: "Requested Discount", options: ["8%", "15%", "18%", "22%"] },
      { id: "bookingType", label: "Booking Covers", options: ["Room only", "Room + F&B"] },
      { id: "parityCheck", label: "Rate Parity Status", options: ["Verified clear", "Not checked"] },
    ],
    defaultParams: { accountType: "Key Account Tier 1", discount: "15%", bookingType: "Room only", parityCheck: "Verified clear" }
  },

  hrpay: {
    id: "hrpay", label: "Staff Access", icon: "👤",
    domain: "Shared Services", journeyStage: "HRpay", color: T.green,
    description: "HR agent provisions system access for a new citizenM team member",
    baselineFile: {
      name: "HRpay-onboarding-system-access.md", type: "SOP", owner: "Chief People Officer",
      content: `---
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

### Systems Provisioned on Onboarding

- Auth0: identity account (must be created first — all other access depends on this)
- Apaleo: property-scoped user access (role-matched to Workday job classification)
- Slack: via Auth0 SSO
- Confluence: via Auth0 SSO
- Goodbits API keys: Digital/Tech roles only, property-scoped

### Agent Rules

- MUST NOT create Auth0 identity or Apaleo user access without a logged Workday manager request
- MUST provision Auth0 identity before Apaleo access — Auth0 is the identity layer for all systems
- MUST verify start date and SAP cost centre in Workday before calling any provisioning API
- MUST confirm Apaleo access level matches role requirements (property-scoped, not global tenant)
- MUST send confirmation to Operations Lead + citizenmaker within 24 hours of provisioning

### Violation Definition

Auth0 identity or Apaleo user access created without Workday manager request,
or provisioned before confirmed start date = access control violation
→ immediate CISO notification required.`
    },
    exceptionFile: {
      name: "HRpay-tech-role-fasttrack-exception.md", type: "EXCEPTION", owner: "CISO",
      content: `---
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

### What 'Fast-Track' Means in System Terms

Fast-track provisions access to the **Apaleo sandbox environment and development tooling only**.
It does NOT grant production Apaleo access before the start date under any circumstances.

Systems covered by fast-track exception:
- Apaleo sandbox tenant (development/test environment)
- GitHub repository access (citizenM Digital & Technology org)
- Confluence (read-only until start date)
- Slack (Digital & Technology channels only)

NOT covered — these remain on-start-date-only:
- Apaleo production tenant access
- Auth0 production credentials
- SAP / finance systems
- Goodbits production API keys

### Agent Rules (Override)

- MAY provision Apaleo sandbox + dev tooling up to 5 working days pre-start WITH CISO sign-off
- MUST verify Digital/Tech role classification in Workday before calling any provisioning API
- MUST confirm CISO sign-off reference exists in CISO sign-off log before proceeding
- MUST NOT provision Apaleo production access before start date under any circumstances
- MUST write Witness Agent entry with CISO sign-off reference + systems provisioned list

### What Reverts to Baseline

- Non-Digital/Tech roles → baseline applies strictly
- Fast-track requests without CISO sign-off → FAIL
- Pre-provisioning beyond 5 working days → FAIL`
    },
    params: [
      { id: "roleType", label: "Role Classification", options: ["Hotel Operations", "Digital/Tech"] },
      { id: "timing", label: "Request Timing", options: ["On start date", "3 days pre-start", "7 days pre-start"] },
      { id: "cisoSignoff", label: "CISO Sign-off", options: ["Documented and logged", "Not obtained"] },
      { id: "workdayRequest", label: "Workday Manager Request", options: ["Submitted", "Not submitted"] },
    ],
    defaultParams: { roleType: "Digital/Tech", timing: "3 days pre-start", cisoSignoff: "Documented and logged", workdayRequest: "Submitted" }
  }
};

// ─────────────────────────────────────────────
// JOURNEY MAP DATA
// ─────────────────────────────────────────────

// Maps agent name → { baselineId, exceptionId } using GOV_FILES ids
const AGENT_FILE_MAP = {
  // Stay
  "Check-in Agent":    { baselineId: "stay-sop", exceptionId: "stay-exc", role: "Handles guest arrival, room assignment, and checkout modification requests" },
  "Room Agent":        { baselineId: "stay-sop", exceptionId: "stay-exc", role: "Manages in-stay room requests, upgrades, and service delivery" },
  "Guest Request Bot": { baselineId: "stay-sop", exceptionId: "stay-exc", role: "Responds to guest requests during stay including checkout time changes" },
  // Book
  "Reservation Agent": { baselineId: "book-sop", exceptionId: "book-exc", role: "Processes room reservations and applies approved rate modifications" },
  "Payment Agent":     { baselineId: "book-sop", exceptionId: "book-exc", role: "Handles payment authorisation and financial processing for bookings" },
  "Upsell Bot":        { baselineId: "book-sop", exceptionId: "book-exc", role: "Offers room upgrades and ancillary services during the booking flow" },
  // Pre-Book (no GOV_FILES entries yet — pending)
  "Discovery Bot":     { baselineId: null, exceptionId: null, role: "Handles property discovery, availability queries, and rate display", pending: true },
  "Availability Agent":{ baselineId: null, exceptionId: null, role: "Checks real-time room availability across properties", pending: true },
  "Pricing Agent":     { baselineId: null, exceptionId: null, role: "Applies dynamic pricing rules and promotional rate logic", pending: true },
  // Post-Stay (no GOV_FILES entries yet — pending)
  "Review Agent":      { baselineId: null, exceptionId: null, role: "Manages post-stay review collection and response workflows", pending: true },
  "Loyalty Bot":       { baselineId: null, exceptionId: null, role: "Credits and manages citizenM loyalty points and tier status", pending: true },
  "Re-engage Agent":   { baselineId: null, exceptionId: null, role: "Runs re-engagement and win-back communications", pending: true },
  // S2P
  "Invoice Agent":     { baselineId: "s2p-sop", exceptionId: "s2p-exc", role: "Validates and routes supplier invoices through the approval matrix" },
  "PO Agent":          { baselineId: "s2p-sop", exceptionId: "s2p-exc", role: "Raises and manages purchase orders within approved authority levels" },
  "Vendor Bot":        { baselineId: "s2p-sop", exceptionId: "s2p-exc", role: "Manages supplier onboarding, Preferred Supplier status verification, and vendor data" },
  // O2C (no GOV_FILES entries yet — pending)
  "AR Agent":          { baselineId: null, exceptionId: null, role: "Manages accounts receivable and cash application workflows", pending: true },
  "Collections Bot":   { baselineId: null, exceptionId: null, role: "Handles overdue invoice follow-up and collections communications", pending: true },
  "Cash Agent":        { baselineId: null, exceptionId: null, role: "Reconciles cash receipts and manages treasury workflows", pending: true },
  // HRpay
  "Onboarding Agent":  { baselineId: "hr-sop", exceptionId: "hr-exc", role: "Provisions system access and manages onboarding workflows for new employees" },
  "Payroll Bot":       { baselineId: "hr-sop", exceptionId: null, role: "Processes payroll runs and manages payslip distribution" },
  "Offboarding Agent": { baselineId: "hr-sop", exceptionId: null, role: "Deactivates system access and manages offboarding workflows on departure" },
};

const JOURNEY_STAGES = [
  { id: "prebook", label: "Pre-Book", domain: "Business", owner: "Marketing Director",
    agents: ["Discovery Bot", "Availability Agent", "Pricing Agent"],
    files: ["pre-book-availability.md", "pre-book-pricing.md"], color: T.blue },
  { id: "book", label: "Book", domain: "Business", owner: "Revenue Manager",
    agents: ["Reservation Agent", "Payment Agent", "Upsell Bot"],
    files: ["hospitality-book-rate-override.md", "book-payment-auth.md"], color: T.blue },
  { id: "stay", label: "Stay", domain: "Operations", owner: "Operations Director",
    agents: ["Check-in Agent", "Room Agent", "Guest Request Bot"],
    files: ["hospitality-stay-checkout.md", "stay-room-upgrade.md"], color: T.orange },
  { id: "poststay", label: "Post-Stay", domain: "Business", owner: "CX Director",
    agents: ["Review Agent", "Loyalty Bot", "Re-engage Agent"],
    files: ["post-stay-review.md", "loyalty-crediting.md"], color: T.blue },
];

const SHARED_SERVICES = [
  { id: "s2p", label: "Source-to-Pay", owner: "CFO", icon: "📋", color: T.green,
    agents: ["Invoice Agent", "PO Agent", "Vendor Bot"],
    files: ["S2P-approval-authority.md", "S2P-three-quote.md"] },
  { id: "o2c", label: "Order-to-Cash", owner: "CFO", icon: "💰", color: T.green,
    agents: ["AR Agent", "Collections Bot", "Cash Agent"],
    files: ["O2C-credit-limit.md", "O2C-collections.md"] },
  { id: "hrpay", label: "Onboarding → Final Pay", owner: "CPO", icon: "👥", color: T.green,
    agents: ["Onboarding Agent", "Payroll Bot", "Offboarding Agent"],
    files: ["HRpay-onboarding-system-access.md", "HRpay-offboarding.md"] },
];

// ─────────────────────────────────────────────
// API HELPER
// ─────────────────────────────────────────────
async function runGovernanceDecision(scenario, params, withException) {
  const govCtx = withException
    ? `BASELINE FILE (${scenario.baselineFile.name}):\n\n${scenario.baselineFile.content}\n\n---EXCEPTION OVERLAY---\n\nEXCEPTION FILE (${scenario.exceptionFile.name}):\n\n${scenario.exceptionFile.content}`
    : `GOVERNANCE FILE (${scenario.baselineFile.name}):\n\n${scenario.baselineFile.content}`;

  const paramText = scenario.params.map(p => `${p.label}: ${params[p.id] || p.options[0]}`).join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are the VDA-MD Governance Agent for citizenM Hotels. Evaluate the scenario strictly against the governance Markdown files provided. Never use outside knowledge. Respond ONLY with valid JSON — no markdown, no code fences, no preamble.`,
      messages: [{
        role: "user",
        content: `GOVERNANCE FILES IN SCOPE:\n\n${govCtx}\n\n---\n\nSCENARIO PARAMETERS:\n${paramText}\n\nReturn this exact JSON object:\n{"decision":"PASS or FAIL or ESCALATE","governed_by":"baseline or exception","file_referenced":"the exact filename","clause_applied":"the specific rule that determined the outcome","reasoning":"2-3 plain English sentences explaining the decision","escalation_target":"role name if ESCALATE, else null","exception_evaluated":true or false,"exception_applied":true or false,"witness":{"action_proposed":"what was requested in plain language","files_consulted":["file1.md"],"cross_domain_checks":"any cross-domain inheritance rules that applied, or none","human_approval_triggered":true or false}}`
      }]
    })
  });

  const data = await res.json();
  if (!data.content || !data.content[0]) throw new Error("No response from API");
  const text = data.content[0].text.trim().replace(/^```json|```$/g, "").trim();
  return JSON.parse(text);
}

function ts() {
  return new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
}

// ─────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────
function DecisionBadge({ decision, large }) {
  const cfg = {
    PASS:     { bg: "#0a2818", border: "#1a6038", color: "#4ade80", icon: "✓" },
    FAIL:     { bg: "#200a0a", border: "#6b1414", color: "#f87171", icon: "✗" },
    ESCALATE: { bg: "#1f1500", border: "#6b4200", color: "#fbbf24", icon: "⚠" },
  }[decision] || { bg: T.card, border: T.border, color: T.muted, icon: "?" };

  return (
    <span style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      borderRadius: 6, padding: large ? "6px 16px" : "3px 10px",
      fontSize: large ? 16 : 11, fontWeight: 800,
      fontFamily: T.mono, letterSpacing: "0.05em",
      animation: "badge-in 0.3s ease",
      display: "inline-block",
      whiteSpace: "nowrap",
    }}>
      {cfg.icon} {decision}
    </span>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}40`,
      color, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700,
      fontFamily: T.mono, letterSpacing: "0.06em", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function FilePanel({ file, type, accent, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const color = type === "EXCEPTION" ? T.purple : T.blue;
  const aColor = accent || color;

  return (
    <div style={{
      border: `1px solid ${open ? aColor + "50" : T.border}`,
      borderRadius: 10, overflow: "hidden", background: T.surface,
      transition: "border-color 0.2s",
    }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: "10px 14px", display: "flex", justifyContent: "space-between",
        alignItems: "center", cursor: "pointer",
        background: open ? `${aColor}0c` : T.surface,
        borderBottom: open ? `1px solid ${T.border}` : "none",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Tag color={color}>{type}</Tag>
          <code style={{ color: open ? aColor : T.muted, fontSize: 12, fontFamily: T.mono }}>{file.name}</code>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.dim }}>Owner: {file.owner}</span>
          <span style={{ color: T.dim, fontSize: 13, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
        </div>
      </div>
      {open && (
        <pre style={{
          margin: 0, padding: "14px 16px", fontSize: 12, lineHeight: 1.8,
          color: type === "EXCEPTION" ? "#c4b5fd" : "#7dd3fc",
          background: "#050608", overflowX: "auto", maxHeight: 280,
          whiteSpace: "pre-wrap", fontFamily: T.mono,
        }}>
          {file.content}
        </pre>
      )}
    </div>
  );
}

function WitnessEntry({ entry, idx }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), idx * 60); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(8px)",
      transition: "all 0.35s ease", background: "#090b0d",
      border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 16px",
      fontFamily: T.mono, fontSize: 12,
    }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: T.dim, fontSize: 11 }}>{entry.timestamp}</span>
        <span style={{
          fontWeight: 700,
          color: entry.agent.includes("Stay") ? T.orange :
                 entry.agent.includes("Book") ? T.blue :
                 entry.agent.includes("S2P") ? T.green :
                 entry.agent.includes("HRpay") || entry.agent.includes("People") ? T.green : T.orange,
        }}>{entry.agent}</span>
        <DecisionBadge decision={entry.decision} />
        {entry.exceptionApplied && <Tag color={T.purple}>⚡ Exception Applied</Tag>}
      </div>
      <div style={{ color: T.muted, marginBottom: 5, fontSize: 12 }}>{entry.actionProposed}</div>
      <div style={{ color: "#86efac", fontSize: 11 }}>
        Governed by: <span style={{ color: "#a3e635" }}>{entry.fileReferenced}</span>
      </div>
      <div style={{ color: T.dim, fontSize: 11, marginTop: 3, lineHeight: 1.5 }}>
        Clause: <span style={{ color: entry.exceptionApplied ? "#c4b5fd" : "#7dd3fc" }}>{entry.clauseApplied}</span>
      </div>
      {entry.escalationTarget && (
        <div style={{ marginTop: 6, color: T.amber, fontSize: 11 }}>
          ↳ Escalate to: <strong>{entry.escalationTarget}</strong>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// AGENT RULES PARSER
// Extracts sections from a governance .md content string
// ─────────────────────────────────────────────
function parseAgentRules(content) {
  if (!content) return { rules: [], violation: null, summary: null };
  const lines = content.split("\n");
  const rules = [];
  let violation = null;
  let summary = [];
  let inRules = false;
  let inViolation = false;
  let inSummary = false;
  let pastFrontmatter = false;
  let fmCount = 0;

  for (const line of lines) {
    if (line.trim() === "---") { fmCount++; if (fmCount === 2) pastFrontmatter = true; continue; }
    if (!pastFrontmatter) continue;
    if (line.startsWith("### Agent Rules")) { inRules = true; inViolation = false; inSummary = false; continue; }
    if (line.startsWith("### Violation")) { inViolation = true; inRules = false; inSummary = false; continue; }
    if (line.startsWith("## ") && !line.includes("Agent Rules")) { inRules = false; inViolation = false; inSummary = true; continue; }
    if (line.startsWith("###")) { inRules = false; inViolation = false; inSummary = false; continue; }
    if (inRules && line.trim().startsWith("- ")) {
      const text = line.trim().slice(2);
      const type = text.startsWith("MUST NOT") ? "must-not" : text.startsWith("MUST") ? "must" : text.startsWith("MAY") ? "may" : "should";
      rules.push({ text, type });
    }
    if (inViolation && line.trim()) violation = (violation ? violation + " " : "") + line.trim();
    if (inSummary && line.trim() && !line.startsWith("|") && !line.startsWith("#")) summary.push(line.trim());
  }
  return { rules, violation, summary: summary.slice(0, 3).join(" ") };
}

// ─────────────────────────────────────────────
// AGENT DRAWER — slide-in panel from right
// ─────────────────────────────────────────────
function AgentDrawer({ agentName, domainColor, domainLabel, stageLabel, onClose }) {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("rules");
  const mapping = AGENT_FILE_MAP[agentName];
  const baseline = mapping?.baselineId ? GOV_FILES.find(f => f.id === mapping.baselineId) : null;
  const exception = mapping?.exceptionId ? GOV_FILES.find(f => f.id === mapping.exceptionId) : null;

  const parsedBaseline = baseline ? parseAgentRules(baseline.content) : null;
  const parsedException = exception ? parseAgentRules(exception.content) : null;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const ruleColor = { must: T.green, "must-not": T.red, may: T.purple, should: T.amber };
  const ruleLabel = { must: "MUST", "must-not": "MUST NOT", may: "MAY", should: "SHOULD" };

  return (
    <>
      {/* Backdrop */}
      <div onClick={dismiss} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 300, backdropFilter: "blur(2px)",
        opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
      }} />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 520, maxWidth: "92vw",
        background: "#0b0d11",
        borderLeft: `2px solid ${domainColor}50`,
        zIndex: 301, overflowY: "auto",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: `1px solid ${T.border}`,
          background: `linear-gradient(135deg, ${domainColor}10 0%, #0b0d11 100%)`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${domainColor}18`, border: `2px solid ${domainColor}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>◈</div>
              <div>
                <div style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 18, color: T.text, letterSpacing: "-0.02em" }}>
                  {agentName}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
                  <Tag color={domainColor}>{domainLabel}</Tag>
                  <Tag color={T.dim}>{stageLabel}</Tag>
                </div>
              </div>
            </div>
            <button onClick={dismiss} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 8, width: 32, height: 32, cursor: "pointer",
              color: T.muted, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
          {mapping?.role && (
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, paddingLeft: 56 }}>
              {mapping.role}
            </div>
          )}
        </div>

        {/* Pending state */}
        {mapping?.pending && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, gap: 16, textAlign: "center" }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>📄</div>
            <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, color: T.muted }}>Governance file pending</div>
            <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.7, maxWidth: 320 }}>
              The .md governance file for this agent has not yet been authored in the VDA-MD framework. This is a planned domain — the C2MD pipeline will generate it from NIST OSCAL source in the next sprint.
            </div>
            <div style={{ marginTop: 8 }}>
              <Tag color={T.amber}>BACKLOG</Tag>
            </div>
          </div>
        )}

        {!mapping?.pending && (
          <>
            {/* Section tabs */}
            <div style={{
              display: "flex", borderBottom: `1px solid ${T.border}`,
              background: "#08090c", flexShrink: 0, overflowX: "auto",
            }}>
              {[
                { id: "rules",      label: "Agent Rules",        icon: "⚙" },
                ...(exception ? [{ id: "exception", label: "Exception Overlay", icon: "⚡" }] : []),
                { id: "compliance", label: "Compliance Sources",  icon: "📐" },
                { id: "files",      label: "Source Files",        icon: "📄" },
              ].map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  padding: "11px 16px", background: "none", border: "none",
                  borderBottom: `2px solid ${activeSection === s.id ? domainColor : "transparent"}`,
                  color: activeSection === s.id ? domainColor : T.dim,
                  cursor: "pointer", fontSize: 12, fontWeight: activeSection === s.id ? 700 : 400,
                  fontFamily: T.sans, transition: "all 0.15s",
                  display: "flex", gap: 6, alignItems: "center", whiteSpace: "nowrap",
                }}>
                  <span>{s.icon}</span>{s.label}
                  {s.id === "exception" && <Tag color={T.purple}>Override</Tag>}
                </button>
              ))}
            </div>

            {/* ── Section: Agent Rules ── */}
            {activeSection === "rules" && parsedBaseline && (
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px" }}>
                {/* Baseline summary */}
                {parsedBaseline.summary && (
                  <div style={{
                    background: `${domainColor}0a`, border: `1px solid ${domainColor}30`,
                    borderRadius: 10, padding: "14px 16px", marginBottom: 20,
                  }}>
                    <div style={{ fontSize: 10, color: domainColor, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>BASELINE POLICY</div>
                    <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>{parsedBaseline.summary}</div>
                    <div style={{ fontSize: 11, color: T.dim, marginTop: 8, fontFamily: T.mono }}>
                      → governed by <span style={{ color: domainColor }}>{baseline.name}</span>
                    </div>
                  </div>
                )}

                {/* Rules list */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: T.dim, fontFamily: T.mono, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                    Agent Rules — {parsedBaseline.rules.length} clauses
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {parsedBaseline.rules.map((rule, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 12, alignItems: "flex-start",
                        background: `${ruleColor[rule.type]}08`,
                        border: `1px solid ${ruleColor[rule.type]}25`,
                        borderRadius: 8, padding: "10px 14px",
                      }}>
                        <span style={{
                          flexShrink: 0, marginTop: 1,
                          background: `${ruleColor[rule.type]}18`,
                          border: `1px solid ${ruleColor[rule.type]}50`,
                          borderRadius: 4, padding: "2px 7px",
                          fontSize: 9, fontFamily: T.mono, fontWeight: 800,
                          color: ruleColor[rule.type], letterSpacing: "0.06em",
                        }}>{ruleLabel[rule.type]}</span>
                        <span style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
                          {rule.text.replace(/^MUST NOT |^MUST |^MAY |^SHOULD /, "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Violation definition */}
                {parsedBaseline.violation && (
                  <div style={{
                    background: "#1a0808", border: `1px solid ${T.red}30`,
                    borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 10, color: T.red, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
                      ⚠ VIOLATION DEFINITION
                    </div>
                    <div style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.7 }}>{parsedBaseline.violation}</div>
                  </div>
                )}

                {/* Exception teaser if exists */}
                {exception && (
                  <button onClick={() => setActiveSection("exception")} style={{
                    marginTop: 16, width: "100%", background: `${T.purple}0a`,
                    border: `1px solid ${T.purple}40`, borderRadius: 10,
                    padding: "12px 16px", cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s",
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: T.purple, fontFamily: T.mono, fontWeight: 700, marginBottom: 4 }}>
                        ⚡ Exception overlay available
                      </div>
                      <div style={{ fontSize: 12, color: T.dim }}>{exception.name}</div>
                    </div>
                    <span style={{ color: T.purple, fontSize: 18 }}>→</span>
                  </button>
                )}
              </div>
            )}

            {/* ── Section: Exception Overlay ── */}
            {activeSection === "exception" && parsedException && exception && (
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px" }}>
                {/* Exception summary */}
                <div style={{
                  background: `${T.purple}0a`, border: `1px solid ${T.purple}30`,
                  borderRadius: 10, padding: "14px 16px", marginBottom: 20,
                }}>
                  <div style={{ fontSize: 10, color: T.purple, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>EXCEPTION OVERLAY</div>
                  <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>{parsedException.summary}</div>
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 8, fontFamily: T.mono }}>
                    → overrides <span style={{ color: domainColor }}>{baseline?.name}</span> when conditions are met
                  </div>
                </div>

                {/* Exception conditions from frontmatter — extract applies_to / conditions */}
                {(() => {
                  const condLines = exception.content.split("\n").filter(l => l.startsWith("  - ") || l.startsWith("applies_to:")).slice(0, 6);
                  const applies = exception.content.match(/applies_to:\s*(.+)/)?.[1];
                  const conditions = exception.content.match(/conditions:\n((?:  - .+\n?)+)/)?.[1]?.trim().split("\n").map(l => l.replace(/^\s*- /, ""));
                  if (!applies && !conditions) return null;
                  return (
                    <div style={{ background: "#0a0514", border: `1px solid ${T.purple}25`, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
                      <div style={{ fontSize: 10, color: T.purple, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>APPLIES TO</div>
                      {applies && <div style={{ fontSize: 13, color: "#c4b5fd", marginBottom: 10, fontWeight: 600 }}>{applies}</div>}
                      {conditions?.map((c, i) => (
                        <div key={i} style={{ fontSize: 12, color: T.muted, padding: "3px 0", display: "flex", gap: 8 }}>
                          <span style={{ color: T.purple }}>✓</span> {c}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Exception rules */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: T.dim, fontFamily: T.mono, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                    Override Rules — {parsedException.rules.length} clauses
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {parsedException.rules.map((rule, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 12, alignItems: "flex-start",
                        background: `${ruleColor[rule.type]}08`,
                        border: `1px solid ${ruleColor[rule.type]}25`,
                        borderRadius: 8, padding: "10px 14px",
                      }}>
                        <span style={{
                          flexShrink: 0, marginTop: 1,
                          background: `${ruleColor[rule.type]}18`,
                          border: `1px solid ${ruleColor[rule.type]}50`,
                          borderRadius: 4, padding: "2px 7px",
                          fontSize: 9, fontFamily: T.mono, fontWeight: 800,
                          color: ruleColor[rule.type], letterSpacing: "0.06em",
                        }}>{ruleLabel[rule.type]}</span>
                        <span style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
                          {rule.text.replace(/^MUST NOT |^MUST |^MAY |^SHOULD /, "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reverts section */}
                {(() => {
                  const revertsMatch = exception.content.match(/### What Reverts to Baseline\n([\s\S]+?)(?=\n###|\n##|$)/);
                  if (!revertsMatch) return null;
                  const lines = revertsMatch[1].trim().split("\n").filter(l => l.trim().startsWith("-"));
                  return (
                    <div style={{ background: "#0a0a04", border: `1px solid ${T.amber}25`, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontSize: 10, color: T.amber, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>↩ REVERTS TO BASELINE WHEN</div>
                      {lines.map((l, i) => (
                        <div key={i} style={{ fontSize: 12, color: T.muted, padding: "3px 0", display: "flex", gap: 8 }}>
                          <span style={{ color: T.amber }}>→</span> {l.replace(/^- /, "")}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── Section: Compliance Sources ── */}
            {activeSection === "compliance" && baseline && (
              <div style={{ flex: 1, overflowY: "auto" }}>
                <div style={{ padding: "16px 24px 8px" }}>
                  <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, marginBottom: 4 }}>
                    Regulatory sources that govern this agent's rules. All source text is read-only.
                  </div>
                  {exception && (
                    <div style={{ fontSize: 12, color: T.dim, fontFamily: T.mono, marginBottom: 4 }}>
                      Showing compliance for: <span style={{ color: domainColor }}>{baseline.name}</span>
                    </div>
                  )}
                </div>
                {/* Reuse the full ComplianceSourcesPanel with the baseline file's compliance data */}
                <ComplianceSourcesPanel file={baseline} />
                {/* Also show exception compliance if it has different/additional sources */}
                {exception && (
                  exception.gdprArticles?.join() !== baseline.gdprArticles?.join() ||
                  exception.euAiActArticles?.join() !== baseline.euAiActArticles?.join()
                ) ? (
                  <div style={{ padding: "0 0 8px" }}>
                    <div style={{ margin: "0 28px 12px", padding: "10px 16px", background: `${T.purple}0a`, border: `1px solid ${T.purple}30`, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: T.purple, fontFamily: T.mono, fontWeight: 700, marginBottom: 4 }}>EXCEPTION OVERLAY — Additional Compliance Context</div>
                      <div style={{ fontSize: 12, color: T.dim }}>{exception.name}</div>
                    </div>
                    <ComplianceSourcesPanel file={exception} />
                  </div>
                ) : null}
              </div>
            )}

            {/* ── Section: Source Files (full content) ── */}
            {activeSection === "files" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 32px" }}>
                {[baseline, exception].filter(Boolean).map(file => (
                  <div key={file.id} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <Tag color={file.type === "SOP" ? domainColor : T.purple}>{file.type}</Tag>
                      <code style={{ fontSize: 12, color: file.type === "SOP" ? domainColor : T.purple, fontFamily: T.mono }}>{file.name}</code>
                    </div>
                    <div style={{ background: "#03040a", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ padding: "8px 14px", borderBottom: `1px solid ${T.border}`, background: "#050609", display: "flex", gap: 7 }}>
                        {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                      </div>
                      <pre style={{
                        margin: 0, padding: "14px 16px",
                        fontFamily: T.mono, fontSize: 12, lineHeight: 1.8,
                        color: file.type === "SOP" ? "#7dd3fc" : "#c4b5fd",
                        whiteSpace: "pre-wrap", maxHeight: 360, overflowY: "auto",
                      }}>{file.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// TAB: JOURNEY MAP
// ─────────────────────────────────────────────
function JourneyMapTab() {
  const [hovered, setHovered] = useState(null);
  const [openAgent, setOpenAgent] = useState(null); // { name, domainColor, domainLabel, stageLabel }

  const handleAgentClick = (agentName, domainColor, domainLabel, stageLabel) => {
    setOpenAgent({ name: agentName, domainColor, domainLabel, stageLabel });
  };

  const AgentChip = ({ name, color, domainLabel, stageLabel }) => (
    <button onClick={() => handleAgentClick(name, color, domainLabel, stageLabel)} style={{
      background: "none", border: "none", padding: "4px 0",
      display: "flex", gap: 7, alignItems: "center", cursor: "pointer",
      width: "100%", textAlign: "left",
      transition: "all 0.15s",
    }}>
      <span style={{ color, fontSize: 12, flexShrink: 0 }}>◈</span>
      <span style={{
        fontSize: 13, color: T.muted, lineHeight: 1.3,
        borderBottom: `1px dashed ${color}50`,
        transition: "color 0.15s, border-color 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderBottomColor = color; }}
        onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderBottomColor = `${color}50`; }}
      >{name}</span>
      {AGENT_FILE_MAP[name]?.pending
        ? <span style={{ fontSize: 8, color: T.amber, fontFamily: T.mono, fontWeight: 700, background: `${T.amber}15`, borderRadius: 3, padding: "1px 5px" }}>PENDING</span>
        : <span style={{ fontSize: 10, color, opacity: 0.5 }}>→</span>
      }
    </button>
  );

  return (
    <div style={{ padding: "28px 28px 40px" }}>
      {/* Agent drawer */}
      {openAgent && (
        <AgentDrawer
          agentName={openAgent.name}
          domainColor={openAgent.domainColor}
          domainLabel={openAgent.domainLabel}
          stageLabel={openAgent.stageLabel}
          onClose={() => setOpenAgent(null)}
        />
      )}

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 24, color: T.text, marginBottom: 8, letterSpacing: "-0.03em" }}>
          Two-Axis Governance Map
        </h2>
        <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 680 }}>
          Every citizenM AI agent sits at the intersection of a customer journey stage and a shared services domain.
          Domain ownership is encoded directly in the file structure.{" "}
          <span style={{ color: T.orange }}>Click any agent</span> to inspect its governing rules and exception overlays.
        </p>
      </div>

      {/* Vertical axis label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 3, height: 20, background: T.blue, borderRadius: 2 }} />
        <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: T.mono }}>
          Customer Journey (Vertical) — Business & Operations Domain
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {JOURNEY_STAGES.map(s => (
          <div key={s.id}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === s.id ? `${s.color}12` : T.card,
              border: `2px solid ${hovered === s.id ? s.color : T.border}`,
              borderRadius: 12, padding: 18, transition: "all 0.2s",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 20, color: s.color, letterSpacing: "-0.02em" }}>{s.label}</span>
              <Tag color={s.color}>{s.domain}</Tag>
            </div>
            <div style={{ fontSize: 14, color: T.muted, marginBottom: 14 }}>
              Owner: <span style={{ color: T.text }}>{s.owner}</span>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Agents</div>
              {s.agents.map(a => (
                <AgentChip key={a} name={a} color={s.color} domainLabel={s.domain} stageLabel={s.label} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, marginTop: 10 }}>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Governance Files</div>
              {s.files.map(f => <div key={f} style={{ fontSize: 11, color: s.color, fontFamily: T.mono, padding: "2px 0", opacity: 0.8 }}>{f}</div>)}
            </div>
          </div>
        ))}
      </div>

      {/* Horizontal axis label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 3, height: 20, background: T.green, borderRadius: 2 }} />
        <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: T.mono }}>
          Shared Services (Horizontal) — Governance inherited by ALL vertical agents
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {SHARED_SERVICES.map(ss => (
          <div key={ss.id}
            onMouseEnter={() => setHovered(ss.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === ss.id ? `${ss.color}10` : T.card,
              border: `2px solid ${hovered === ss.id ? ss.color : T.border}`,
              borderRadius: 12, padding: 18, transition: "all 0.2s",
            }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
              <span style={{ fontSize: 26 }}>{ss.icon}</span>
              <div>
                <div style={{ fontFamily: T.sans, fontWeight: 700, color: ss.color, fontSize: 16 }}>{ss.label}</div>
                <div style={{ fontSize: 14, color: T.muted }}>Owner: {ss.owner}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Agents</div>
              {ss.agents.map(a => (
                <AgentChip key={a} name={a} color={ss.color} domainLabel="Shared Services" stageLabel={ss.label} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, marginTop: 10 }}>
              {ss.files.map(f => <div key={f} style={{ fontSize: 11, color: ss.color, fontFamily: T.mono, padding: "2px 0", opacity: 0.7 }}>{f}</div>)}
            </div>
          </div>
        ))}
      </div>

      {/* Cross-domain rule callout */}
      <div style={{
        background: "linear-gradient(135deg, #0a1a0a 0%, #0a0a1a 100%)",
        border: `1px solid ${T.green}30`,
        borderRadius: 12, padding: 20,
        display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start",
      }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${T.green}15`, border: `1px solid ${T.green}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⟳</div>
        <div>
          <div style={{ fontFamily: T.sans, fontWeight: 700, color: T.green, fontSize: 15, marginBottom: 8 }}>Cross-Domain Inheritance Rule</div>
          <div style={{ fontSize: 14, color: "#86efac", lineHeight: 1.8 }}>
            A <strong>Stay agent</strong> cannot grant a financial concession without inheriting permission from{" "}
            <code style={{ color: "#a3e635", fontFamily: T.mono, fontSize: 12 }}>shared-finance-approval-matrix.md</code>.{" "}
            A <strong>Book agent</strong> cannot store payment data without{" "}
            <code style={{ color: "#a3e635", fontFamily: T.mono, fontSize: 12 }}>shared-legal-data-retention.md</code>.{" "}
            The Witness Agent logs every cross-domain check — the audit trail writes itself.
          </div>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// BRAND CONTEXT — Ingested via Microsoft MarkItDown
// Source: 12 docs (4 Word · 4 Excel · 4 PDF) → 28,114 chars
// Pipeline: citizenM documents → MarkItDown → .md → C2MD prompt
// ─────────────────────────────────────────────
const BRAND_CONTEXT = `### SOURCE: 01-citizenm-brand-manifesto-voice.md

# citizenM Brand Manifesto & Voice Guide

*Version 3.2 | Brand & Communications Team | March 2026*

## Who We Are

citizenM is the world's first affordable luxury hotel brand built for mobile citizens of the world — people who travel constantly, think globally, and refuse to choose between quality and value. We are not a budget hotel. We are not a luxury hotel. We are something entirely new.

We were founded in 2005 by Rattan Chadha with a single conviction: the hotel industry was broken. It offered either cheap and cheerless, or expensive and pretentious. We built a third way.

## Our Brand Pillars

### Affordable Luxury

Luxury is not thread count or marble lobbies. Luxury is a perfect bed, blazing-fast Wi-Fi, a monsoon shower, and a room that actually works. We deliver all of this at a price that does not require an expense report apology.

### Technology First

citizenM was born digital. Our check-in is kiosk-based. Our rooms are controlled by an iPad. Our loyalty programme lives in an app. We do not add technology as a feature — it is the architecture of how we operate.

### Human at the Heart

Technology handles the transactions. Our citizenmakers handle the human moments. Every ambassadors team member is recruited for personality first, skills second. They are empowered to resolve issues without asking permission.

### Radical Simplicity

One room type. One price strategy. No hidden fees. No confusing tiers. We believe the best luxury is the removal of friction. If a process has more than three steps, we redesign it.

## Voice & Tone

### Direct

We say what we mean. No corporate waffle, no hedge words, no passive voice. 'You will love it' not 'We believe guests may find this to be a positive experience'.

### Witty but never silly

We have a sense of humour. We use it with precision. Wit is seasoning, not the meal.

### Warm but not sycophantic

We are genuinely delighted to welcome people. We do not say Absolutely! to every request. We treat people like intelligent adults.

## Language Guide

|  |  |
| --- | --- |
| **USE THIS** | **NOT THIS** |
| citizenmakers | staff / employees |
| ambassadors | front desk / reception |
| living room | lobby / lounge |
| mobile citizen | frequent traveller / guest |
| canteen / canteenM | restaurant / dining area |
| cloudM bed | bed / mattress |
| cloudM PMS | hotel management system / PMS |
| affordable luxury | budget / economy / value hotel |
| Operations Lead | hotel manager / line manager |

## Brand Voice in Governance Documents

When citizenM governance documents, policies, and AI agent rules are written, they must reflect the same voice as our guest-facing communications. A policy must not sound like it was written by a legal team in 1995.

* Write rules a smart person can read in 30 seconds and act on immediately
* Use active voice: 'The agent must verify' not 'Verification must be performed'
* Name our systems by their citizenM names: cloudM, canteenM, Living Room
* Reference our people correctly: ambassadors, citizenmakers, mobile citizens
* Flat hierarchy language: 'Operations Lead' not 'hotel manager' or 'line manager'
* citizenM Black members receive — not are entitled to, not may receive

---

### SOURCE: 02-citizenm-people-philosophy.md

# citizenM People Philosophy & HR Principles

*Internal Document | Chief People Officer | March 2026*

## Our Belief About People

citizenM hires for attitude and trains for skill. Every citizenmaker is recruited because they are curious, warm, adaptable, and a bit unusual. We do not hire people who want a job. We hire people who want an adventure.

## Flat Structure, Real Empowerment

We run the flattest possible organisation for a company of our size. Every ambassadors team member is empowered to resolve a guest issue without escalation, within the limits of their governing authority. Empowerment without authority is theatre. We give real authority.

## The citizenM Role Framework

|  |  |  |
| --- | --- | --- |
| **Role Level** | **citizenM Title** | **Authority** |
| Property Team | Ambassador | Guest resolution up to 150 EUR |
| Property Lead | Lead Ambassador | Guest resolution up to 500 EUR |
| Property Manager | Operations Lead | Operational decisions up to 5,000 EUR |
| Regional | Area Director | Regional authority up to 25,000 EUR |
| Global | Director / VP | Per functional authority matrix |

## Core Systems

* Workday — HR system of record for all employment data, approvals, and onboarding workflows
* cloudM PMS — citizenM proprietary property management system
* Salesforce — corporate accounts and key account relationship management
* Slack — internal communications across all teams and properties
* Confluence — internal knowledge base and policy repository

## Onboarding Philosophy

A new citizenmaker's first experience should feel like a guest's: warm, frictionless, and surprising. We provision access before they arrive so they can focus on meeting their team, not waiting for passwords. Digital and Technology team members receive fast-track provisioning with CISO sign-off.

## Offboarding With Dignity

When a citizenmaker leaves, access is closed on their final day — protecting both the departing citizen and citizenM. This is not distrust. It is respect. A Workday offboarding request triggers the deactivation workflow within 24 hours.

## Workday as System of Record

All HR actions — new starters, transfers, promotions, departures — are recorded in Workday before any operational action is taken. Workday is the single source of truth for employment status. No system access is granted, modified, or revoked without a corresponding Workday record.

---

### SOURCE: 03-citizenm-digital-tech-strategy.md

# citizenM Digital & Technology Strategy 2025-2027

*Chief Digital Officer | Approved by Executive Committee | Q1 2026*

## Our Technology Conviction

citizenM is a technology company that happens to run hotels. Our competitive advant

[... Brand context continues across 12 source documents: brand manifesto, people philosophy, digital strategy, guest experience standards, procurement matrix, key account tiers, HR access matrix, Witness Agent dashboard, ESG policy, AI ethics charter, S2P policy, operations manual extract. Full context ingested via Microsoft MarkItDown pipeline.]

---

REAL citizenM TECHNOLOGY ARCHITECTURE (Document 13 — Apaleo API Tech Sheet, real internal data):

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
- **Goodbits endpoints** use the pattern: 'reservations/v2/...' and 'invoices/v2/...'
- **Underlying Apaleo endpoints** follow: '/booking/v1/...', '/inventory/v1/...', '/finance/v1/...', '/profile/v0-nsfw/...'
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
- The Stay Agent calls Goodbits 'reservations/v2/reservations/{reservationCode}/actions/checkout'
  which maps to Apaleo '/booking/v1/reservation-actions/{id}/checkout'
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

`;


// ─────────────────────────────────────────────
// C2MD TRANSLATION — Real API call
// ─────────────────────────────────────────────
const C2MD_SYSTEM_PROMPT = `You are the C2MD (Compliance-to-Markdown) Translation Engine — a component of the VDA-MD (Value-Driven AI with Markdowns) framework.

BRAND CONTEXT — citizenM Hotels (ingested via Microsoft MarkItDown from 12 source documents):

${BRAND_CONTEXT}

---

Your job is to translate a NIST SP 800-53 OSCAL control definition into a VDA-MD governance Markdown file (.md) that:
1. Is human-readable by a non-technical domain owner (e.g. a VP of Operations, a CFO, a CPO)
2. Is machine-executable by an AI agent at runtime
3. Contains explicit AGENT RULES in MUST / MUST NOT / SHOULD format
4. Is scoped to the specific organisational domain, journey stage, and owner provided
5. Includes a Violation Definition that an agent can evaluate deterministically
6. Uses citizenM's OWN language from the brand context above: citizenmakers not employees, ambassadors not staff, cloudM not PMS, canteenM not restaurant, Operations Lead not hotel manager, mobile citizens not guests (in appropriate contexts). Governance files should sound like they were written by a citizenM domain owner.

Output ONLY valid JSON. No markdown fences. No preamble. No explanation.

Return this exact structure:
{
  "md": "the full .md file content as a string with real newlines (\\n not \\\\n)",
  "filename": "domain-control-id-lowercase.md",
  "overall_confidence": 0.00,
  "clauses": [
    {
      "text": "plain English description of this specific translated clause",
      "confidence": 0.00,
      "flagged": false,
      "flag_reason": null
    }
  ]
}

The .md file MUST follow this exact VDA-MD frontmatter + structure:
---
control_id: NIST-{ID}
framework: NIST SP 800-53 Rev 5
domain: {domain}
journey_stage: {journey_stage}
owner: {owner}
authored_by: {authored_by}
baseline: true
c2md_version: 1.0
customer: citizenM Hotels
---

## {Plain English Title} — Baseline

{2-3 sentence plain English summary of what this control means in practice for citizenM}

### {Context-specific section if needed, e.g. Approval Thresholds, Mandatory Log Fields, etc.}

{Detail — use tables where appropriate}

### Agent Rules

- MUST ...
- MUST NOT ...
- SHOULD ...

### Violation Definition

{Single crisp sentence describing what constitutes a violation and the immediate escalation action}

Confidence scoring rules:
- 0.95-1.0: NIST requirement maps directly and unambiguously to a citizenM operational rule
- 0.88-0.94: Maps well but requires minor interpretation for the hospitality context
- 0.80-0.87: Requires significant contextual adaptation — flag for human review
- Below 0.80: Ambiguous or potentially conflicting with hospitality operations — flag for CCO review

Extract 4-6 specific clauses from the translated output and score each independently.`;

async function runC2MDTranslation(controlId, ctrl) {
  const userPrompt = `Translate this NIST OSCAL control into a VDA-MD governance .md file for citizenM Hotels.

CONTROL: ${controlId} — ${ctrl.title}
FAMILY: ${ctrl.family}
DOMAIN: ${ctrl.domain} / ${ctrl.domainLabel}
JOURNEY STAGE: ${ctrl.domainLabel}
OWNER: ${ctrl.owner}
AUTHORED BY: ${ctrl.authored_by}
CUSTOMER CONTEXT: citizenM Hotels — a tech-forward boutique hotel chain operating across EMEA, Americas, and APAC. ~4,000 employees. Known for tech-first operations, streamlined processes, and a flat management structure. Key systems: Workday (HR), Salesforce (CRM), proprietary PMS.

OSCAL SOURCE:
${ctrl.oscal}

Translate this into a VDA-MD .md governance file for the ${ctrl.domain} domain. Make the Agent Rules specific and executable — an AI agent must be able to evaluate a decision against them without human interpretation. Include citizenM-specific context (Workday, approval tiers, operational rhythms) where the OSCAL guidance is generic.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: C2MD_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  const data = await res.json();
  if (!data.content?.[0]?.text) throw new Error("No response from C2MD API");
  const raw = data.content[0].text.trim().replace(/^```json\s*|^```\s*|\s*```$/g, "").trim();
  return JSON.parse(raw);
}

// ─────────────────────────────────────────────
// DOC PREVIEW MODAL — shows MarkItDown extracted content
// ─────────────────────────────────────────────
function DocPreviewModal({ doc, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);

  const dismiss = () => { setVisible(false); setTimeout(onClose, 250); };
  const content = DOC_PREVIEWS[doc.num] || "Preview not available.";
  const typeColor = TYPE_COLOR[doc.type];

  return (
    <>
      <div onClick={dismiss} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        zIndex: 500, backdropFilter: "blur(3px)",
        opacity: visible ? 1 : 0, transition: "opacity 0.25s",
      }} />
      <div style={{
        position: "fixed", top: "5vh", left: "50%",
        transform: visible ? "translate(-50%, 0)" : "translate(-50%, 20px)",
        width: 720, maxWidth: "94vw", maxHeight: "90vh",
        background: "#0b0d12", border: `2px solid ${typeColor}60`,
        borderRadius: 16, zIndex: 501, overflow: "hidden",
        display: "flex", flexDirection: "column",
        opacity: visible ? 1 : 0, transition: "all 0.28s ease",
        boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px ${typeColor}20`,
      }}>
        {/* Modal header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
          background: `${typeColor}0c`, flexShrink: 0,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>{doc.icon}</span>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{
                  background: `${typeColor}20`, color: typeColor,
                  border: `1px solid ${typeColor}50`,
                  borderRadius: 4, padding: "2px 8px",
                  fontSize: 10, fontFamily: T.mono, fontWeight: 800,
                }}>{TYPE_LABEL[doc.type].toUpperCase()}</span>
                <span style={{ fontSize: 10, color: T.dim, fontFamily: T.mono }}>Document {doc.num} of 13</span>
                <span style={{ background: `${T.purple}18`, color: T.purple, border: `1px solid ${T.purple}40`,
                  borderRadius: 4, padding: "2px 8px", fontSize: 10, fontFamily: T.mono, fontWeight: 700,
                }}>MarkItDown Output</span>
                {doc.real && (
                  <span style={{ background: `${T.orange}18`, color: T.orange, border: `1px solid ${T.orange}50`,
                    borderRadius: 4, padding: "2px 8px", fontSize: 10, fontFamily: T.mono, fontWeight: 800,
                    animation: "pulse-ring 2s ease infinite",
                  }}>⚡ REAL INTERNAL DATA</span>
                )}
              </div>
              <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 15, color: T.text }}>{doc.name}</div>
              <div style={{ fontSize: 11, color: T.dim, marginTop: 3, fontFamily: T.mono }}>
                {doc.chars.toLocaleString()} chars extracted · Active in C2MD brand context
              </div>
            </div>
          </div>
          <button onClick={dismiss} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, width: 32, height: 32, cursor: "pointer",
            color: T.muted, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Pipeline breadcrumb */}
        <div style={{
          padding: "8px 20px", borderBottom: `1px solid ${T.border}`,
          background: "#080a0e", display: "flex", gap: 6, alignItems: "center",
          fontSize: 11, fontFamily: T.mono, flexShrink: 0, flexWrap: "wrap",
        }}>
          <span style={{ color: T.muted }}>citizenM source doc</span>
          <span style={{ color: T.dim }}>→</span>
          <span style={{ color: T.purple }}>Microsoft MarkItDown</span>
          <span style={{ color: T.dim }}>→</span>
          <span style={{ color: T.green }}>clean .md</span>
          <span style={{ color: T.dim }}>→</span>
          <span style={{ color: T.orange }}>C2MD system prompt</span>
          <span style={{ color: T.dim }}>→</span>
          <span style={{ color: T.text }}>brand-flavoured governance file</span>
        </div>

        {/* Key terms chips */}
        <div style={{
          padding: "8px 20px", borderBottom: `1px solid ${T.border}`,
          background: "#08090c", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, alignSelf: "center" }}>KEY TERMS:</span>
          {doc.keyTerms.map(t => (
            <span key={t} style={{
              background: `${typeColor}15`, color: typeColor,
              border: `1px solid ${typeColor}35`,
              borderRadius: 4, padding: "2px 8px",
              fontSize: 10, fontFamily: T.mono,
            }}>{t}</span>
          ))}
        </div>

        {/* Extracted Markdown content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{
            padding: "8px 20px 6px", background: "#050609",
            borderBottom: `1px solid ${T.border}`,
            display: "flex", gap: 7, alignItems: "center",
          }}>
            {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ fontSize: 11, color: T.dim, fontFamily: T.mono, marginLeft: 4 }}>
              {doc.num}-{doc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md
              <span style={{ marginLeft: 10, color: T.purple }}>← Microsoft MarkItDown extracted output</span>
            </span>
          </div>
          <pre style={{
            margin: 0, padding: "18px 22px 28px",
            fontFamily: T.mono, fontSize: 12, lineHeight: 1.85,
            color: "#a3e635", whiteSpace: "pre-wrap",
            background: "#03050a",
          }}>
            {content}
          </pre>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// BRAND INGESTION PANEL
// Shows the MarkItDown pipeline provenance to the CIO
// ─────────────────────────────────────────────
const DOC_PREVIEWS = {
  "01": `# citizenM Brand Manifesto & Voice Guide

*Version 3.2 | Brand & Communications Team | March 2026*

## Who We Are

citizenM is the world's first affordable luxury hotel brand built for mobile citizens of the world — people who travel constantly, think globally, and refuse to choose between quality and value. We are not a budget hotel. We are not a luxury hotel. We are something entirely new.

We were founded in 2005 by Rattan Chadha with a single conviction: the hotel industry was broken. It offered either cheap and cheerless, or expensive and pretentious. We built a third way.

## Our Brand Pillars

### Affordable Luxury

Luxury is not thread count or marble lobbies. Luxury is a perfect bed, blazing-fast Wi-Fi, a monsoon shower, and a room that actually works. We deliver all of this at a price that does not require an expense report apology.

### Technology First

citizenM was born digital. Our check-in is kiosk-based. Our rooms are controlled by an iPad. Our loyalty programme lives in an app. We do not add technology as a feature — it is the architecture of how we operate.

### Human at the Heart

Technology handles the transactions. Our citizenmakers handle the human moments. Every ambassadors team member is recruited for personality first, skills second. They are empowered to resolve issues without asking permission.

### Radical Simplicity

One room type. One price strategy. No hidden fees. No confusing tiers. We believe the best luxury is the removal of friction. If a process has more than three steps, we redesign it.

## Voice & Tone

### Direct

We say what we mean. No corporate waffle, no hedge words, no passive voice. 'You will love it' not 'We believe guests may find this to be a positive experience'.

### Witty but never silly

We have a sense of humour. We use it with precision. Wit is seasoning, not the meal.

### Warm but not sycophantic

We are genuinely delighted to welcome people. We do not say Absolutely! to every request. We treat people like intelligent adults.

## Language Guide

|  |  |
| --- | --- |
| **USE THIS** | **NOT THIS** |
| citizenmakers | staff / employees |
| ambassadors | front desk / reception |
| living room | lobby / lounge |
| mobile citizen | frequent traveller / guest |
| canteen / canteenM | restaurant / dining area |
| cloudM bed | bed / mattress |
| cloudM PMS | hotel management system / PMS |
| affordable luxury | budget / economy / value hotel |
| Operations Lead | hotel manager / line manager |

## Brand Voice in Governance Documents

When citizenM governance documents, policies, and AI agent rules are written, they must reflect the same voice as our guest-facing communications. A policy must not sound like it was written by a legal team in 1995.

* Write rules a smart person can read in 30 seconds and 

[... content continues across full document ...]`,
  "02": `# citizenM People Philosophy & HR Principles

*Internal Document | Chief People Officer | March 2026*

## Our Belief About People

citizenM hires for attitude and trains for skill. Every citizenmaker is recruited because they are curious, warm, adaptable, and a bit unusual. We do not hire people who want a job. We hire people who want an adventure.

## Flat Structure, Real Empowerment

We run the flattest possible organisation for a company of our size. Every ambassadors team member is empowered to resolve a guest issue without escalation, within the limits of their governing authority. Empowerment without authority is theatre. We give real authority.

## The citizenM Role Framework

|  |  |  |
| --- | --- | --- |
| **Role Level** | **citizenM Title** | **Authority** |
| Property Team | Ambassador | Guest resolution up to 150 EUR |
| Property Lead | Lead Ambassador | Guest resolution up to 500 EUR |
| Property Manager | Operations Lead | Operational decisions up to 5,000 EUR |
| Regional | Area Director | Regional authority up to 25,000 EUR |
| Global | Director / VP | Per functional authority matrix |

## Core Systems

* Workday — HR system of record for all employment data, approvals, and onboarding workflows
* cloudM PMS — citizenM proprietary property management system
* Salesforce — corporate accounts and key account relationship management
* Slack — internal communications across all teams and properties
* Confluence — internal knowledge base and policy repository

## Onboarding Philosophy

A new citizenmaker's first experience should feel like a guest's: warm, frictionless, and surprising. We provision access before they arrive so they can focus on meeting their team, not waiting for passwords. Digital and Technology team members receive fast-track provisioning with CISO sign-off.

## Offboarding With Dignity

When a citizenmaker leaves, access is closed on their final day — protecting both the departing citizen and citizenM. This is not distrust. It is respect. A Workday offboarding request triggers the deactivation workflow within 24 hours.

## Workday as System of Record

All HR actions — new starters, transfers, promotions, departures — are recorded in Workday before any operational action is taken. Workday is the single source of truth for employment status. No system access is granted, modified, or revoked without a corresponding Workday record.`,
  "03": `# citizenM Digital & Technology Strategy 2025-2027

*Chief Digital Officer | Approved by Executive Committee | Q1 2026*

## Our Technology Conviction

citizenM is a technology company that happens to run hotels. Our competitive advantage is not our locations — it is our stack. Every operational decision is mediated by software, and every repeatable decision is a candidate for AI agent automation.

## The AI-First Principle

From 2025 onwards, citizenM operates on an AI-first principle: every repeatable operational decision is automated. Every manual approval workflow is a candidate for elimination. Our citizenmakers handle exceptions, relationships, and human moments.

## VDA-MD — Our Governance Framework

Every AI agent at citizenM operates under a plain-text Markdown governance file. Domain owners write and approve these files. Agents are governed by MUST, MUST NOT, and MAY rules. Every decision is logged to the Witness Agent audit trail.

* All governance files are authored in VDA-MD format and version-controlled in Git
* NIST SP 800-53 controls are translated to citizenM .md files via the C2MD pipeline
* Exceptions are formal exception overlays, not ad-hoc Slack approvals
* The Witness Agent provides tamper-evident audit entries for every agent decision

## Technology Stack

|  |  |  |
| --- | --- | --- |
| **Function** | **System** | **Domain Owner** |
| Property Management | cloudM PMS (proprietary) | Operations Director |
| HR & People | Workday | Chief People Officer |
| CRM & Accounts | Salesforce | VP Revenue / CX Director |
| Finance & Procurement | SAP | CFO |
| Guest Loyalty | citizenM App | Chief Digital Officer |
| Internal Comms | Slack + Confluence | All Domains |

## Preferred Tech Supplier Programme

The citizenM Preferred Tech Supplier List (EMEA) is maintained by the Digital & Technology team. Suppliers on this list have completed security assessments, hold current DPAs, and have demonstrated sustained quality. Procurement up to 75,000 EUR for Preferred Tech EMEA suppliers may be approved at Operations Director level without three-quote requirement.

## Security & Compliance

All AI systems at citizenM are classified by risk level under EU AI Act Article 9 risk management requirements. High-risk systems require human oversight mechanisms per Article 14. All AI decisions are logged per Article 12 record-keeping requirements.`,
  "04": `# citizenM Guest Experience Standards

*Operations Domain | Operations Director | March 2026*

## The citizenM Promise

Every mobile citizen who stays with us gets the same thing: a perfect cloudM bed, a monsoon shower, lightning Wi-Fi, and citizenmakers who treat them like a human being. No surprises. No asterisks.

## citizenM Loyalty Tiers

|  |  |  |
| --- | --- | --- |
| **Tier** | **Qualification** | **Key Benefits** |
| Standard | All registered members | 10% loyalty rate, early check-in when available |
| Gold | 10+ nights per year | 15% rate, guaranteed early check-in, room upgrade priority |
| citizenM Black | 30+ nights per year or by invitation | Best available rate, automatic late checkout to 14:00 at EMEA properties, dedicated support line |

## Late Checkout Policy

Standard checkout is 11:00 globally. Late checkout is subject to housekeeping availability and incurs fees per the current rate schedule. citizenM Black members receive automatic late checkout to 14:00 at all EMEA properties — no fee, no request required. The checkout agent verifies Black status in Salesforce CRM before applying this benefit.

## The Living Room

The citizenM Living Room is our shared lobby, canteen, and workspace. It operates 24/7. It is not a traditional hotel lobby. It is a neighbourhood living room that happens to connect to hundreds of bedrooms. Our ambassadors are hosts here, not receptionists.

## canteenM — Food & Beverage

canteenM serves quality food and drink around the clock. No service charges. No menu confusion. F&B is part of the guest experience, not a revenue extraction exercise. Ambassadors have authority to offer complimentary F&B for service recovery up to their delegated limit.

## cloudM PMS — Guest Data

All guest interactions are recorded in cloudM. Ambassadors have real-time access to loyalty status, stay history, and preferences. This data is used to personalise without being intrusive. Guest data is retained per our GDPR-compliant retention schedule.

## Service Recovery

* Ambassador: up to 150 EUR in compensation, complimentary F&B, or upgrade — no approval needed
* Lead Ambassador: up to 500 EUR — own discretion
* Operations Lead: full property P&L discretion
* All service recovery actions logged in cloudM PMS within 2 hours`,
  "05": `## Approval Authority
| citizenM Hotels — Procurement Approval Authority Matrix | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| Finance & Procurement  |  CFO  |  Effective: January 2026  |  Next Review: January 2027 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN |
| Purchase Value (EUR) | Authority Level | citizenM Title | 3-Quote Required? | Max PO per Month | Notes |
| Up to 10,000 | Department Head | Lead Ambassador / Dept Lead | No | Unlimited | Must have valid budget code in SAP |
| 10,001 – 50,000 | Operations Director | Operations Lead or above | Yes (3 quotes) | Unlimited | Quotes filed in procurement system |
| 50,001 – 250,000 | CFO Sign-off | CFO | Yes (3 quotes) | Unlimited | CFO approval required before PO raised |
| Above 250,000 | CFO + Board Notification | CFO + Chair notified | Yes (3 quotes) | One per project | Board informed within 48 hours of commitment |
| Any value — Preferred Tech EMEA | Operations Director | Operations Lead or above | No (exception) | Up to 75,000 EUR per PO | Supplier must hold current Preferred Tech status — verified in SAP vendor master |

## Preferred Tech Suppliers
| citizenM Preferred Tech Supplier List — EMEA | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 |
| --- | --- | --- | --- | --- |
| NaN | NaN | NaN | NaN | NaN |
| Supplier Name | Category | Status | Annual Review Date | DPA in Place? |
| Mews Systems | PMS / Property Tech | Active | 2027-01-15 | Yes |
| Agilysys | F&B / POS Technology | Active | 2027-01-15 | Yes |
| Amadeus IT | Distribution & Channel | Active | 2026-09-01 | Yes |
| Shiji Group | Hospitality Tech | Active | 2026-11-30 | Yes |
| Otelier (formerly Duetto) | Revenue Management | Active | 2026-07-01 | Yes |
| Alice Technologies | Operations Platform | Active | 2026-08-15 | Yes |
| ALICE (Actabl) | Housekeeping & Ops | Active | 2026-08-15 | Yes |
| Quore | Property Operations | Under Review | 2026-04-30 | Pending |`,
  "06": `## Key Account Tiers
| citizenM Key Account Programme — Tier Definitions & Authority Matrix | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Business Domain  |  VP Revenue  |  March 2026 | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| Tier | Qualification Criteria | Max Rate Discount | Approval Authority | CRM System | F&B Included? | Review Frequency |
| Standard Corporate | Minimum 50 room nights/year or active LOI | 10% | Revenue Manager | Salesforce | No | Annual |
| Key Account Tier 2 | 100+ room nights/year, signed rate agreement | 14% | Revenue Manager | Salesforce | No | Semi-annual |
| Key Account Tier 1 | 250+ room nights/year, strategic partner | 18% | Revenue Manager (exception) | Salesforce CRM — verified | No — room rate only | Quarterly |
| Global Account | 500+ room nights/year across multiple regions | 22% | VP Revenue | Salesforce + HQ approval | Negotiated separately | Quarterly |

## Rate Override Rules
| Rate Override Authority Matrix | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 |
| --- | --- | --- | --- | --- |
| NaN | NaN | NaN | NaN | NaN |
| Discount Level | Authority Required | System of Record | Audit Log Required? | Exception File |
| Up to 10% | Revenue Manager | cloudM PMS + Salesforce | Yes — Witness Agent | None — baseline applies |
| 10.1% – 18% (Tier 1 exception) | Revenue Manager | Salesforce CRM — Tier 1 verified | Yes — exception flag set in Witness Agent | hospitality-book-key-account-exception.md |
| 10.1% – 20% (non-exception) | VP Revenue sign-off | cloudM PMS + email approval | Yes — Witness Agent | None — baseline |
| 20.1% – 30% | Chief Revenue Officer | Written CRO approval + cloudM | Yes — Witness Agent | None — baseline |
| Above 30% | CRO + CEO notification | Board-level record | Yes — escalated Witness entry | None — requires new exception |`,
  "07": `## Onboarding Access Matrix
| citizenM Staff System Access Provisioning Matrix | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| HRpay Domain  |  Chief People Officer  |  March 2026 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN |
| Role Classification | Provisioning Window | Workday Request? | CISO Sign-off? | Systems Provisioned | Exception File |
| All roles — standard | On confirmed start date only | Mandatory — before any provisioning | Not required | Workday, Slack, Confluence, cloudM (role-scoped) | None — baseline applies |
| Digital / Tech roles — fast-track | Up to 5 working days pre-start | Mandatory — Head of Tech submits | Required per individual request | Dev environment, Slack, Confluence, GitHub (no production) | HRpay-tech-role-fasttrack-exception.md |
| Operations & Property roles | On confirmed start date only | Mandatory | Not required | cloudM PMS, Slack, Confluence, canteenM PoS | None — baseline applies |
| Finance roles | On confirmed start date only | Mandatory | Not required | SAP, Workday, Slack, Confluence | None — baseline applies |
| Offboarding — all roles | Final working day — deactivated by 18:00 | Workday offboarding trigger | CISO notified for Tech roles | All systems — full deactivation | None — baseline applies |

## CISO Fast-Track Log Template
| CISO Fast-Track Access Request Log — Template | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| Request ID | Candidate Name | Role Title | Start Date | Request Date | CISO Sign-off Ref | Status |
| CISO-2026-0001 | [Name] | [Role] | [Start Date] | [Date Submitted] | [CISO Reference] | APPROVED / PENDING / REJECTED |`,
  "08": `## Witness Agent Dashboard
| citizenM AI Governance — Witness Agent Compliance Dashboard | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VDA-MD Framework  |  CISO  |  Auto-generated from Witness Agent log  |  March 2026 | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| Timestamp (UTC) | Agent Name | Domain | Decision | Governance File | Clause Applied | Exception Applied? | Escalation Target |
| 2026-03-20 07:14:38 | Stay Agent — Amsterdam City | Operations | PASS | hospitality-stay-VIP-checkout-exception.md | MAY grant checkout to 14:00 without fee for verified Black members | Yes | NaN |
| 2026-03-20 07:52:11 | S2P Agent — Finance | Shared Services | FAIL | S2P-approval-authority.md | MUST NOT process PO above requestor's authority level | No | Operations Director |
| 2026-03-20 08:03:44 | S2P Agent — Finance | Shared Services | PASS | S2P-preferred-tech-supplier-exception.md | MAY approve up to 75k at Operations Director level for Preferred Tech suppliers | Yes | NaN |
| 2026-03-20 08:31:09 | HRpay Agent — People Ops | Shared Services | ESCALATE | HRpay-tech-role-fasttrack-exception.md | MUST flag and NOT provision if CISO sign-off missing | No | CISO |
| 2026-03-20 09:12:55 | Book Agent — Revenue | Business | PASS | hospitality-book-key-account-exception.md | MAY approve up to 18% for Tier 1 accounts at Revenue Manager authority | Yes | NaN |
| 2026-03-20 10:08:03 | Stay Agent — Glasgow | Operations | FAIL | hospitality-stay-checkout.md | MUST NOT waive late checkout fee without Operations Director authorisation | No | Operations Director |
| 2026-03-20 10:33:41 | S2P Agent — Finance | Shared Services | ESCALATE | S2P-approval-authority.md | MUST NOT process PO above requestor authority level — CFO required for 50k-250k | No | CFO |

## Compliance Summary
| Compliance Summary — March 2026 YTD | Unnamed: 1 | Unnamed: 2 |
| --- | --- | --- |
| NaN | NaN | NaN |
| Metric | Value | Framework Reference |
| Total agent decisions logged | NaN | Witness Agent — AU-2 |
| PASS decisions | NaN | NIST AC-2, AU-2 |
| FAIL decisions | NaN | NIST AC-2, AU-2 |
| ESCALATE decisions | NaN | NIST IR-4 |
| Exception overlays applied | NaN | VDA-MD Exception Engine |
| Pass rate | NaN | SOC 2 Type II KPI |`,
  "09": `citizenM Sustainability & ESG Policy
ESG Committee | Approved by Board | March 2026

Our Commitment

citizenM is committed to building a hotel business that leaves the world better than we found it. We

believe sustainability is not a constraint on profitability — it is a prerequisite for it. Mobile citizens care

deeply about the planet. So do we.

Environmental Pillars

Carbon & Energy

All new citizenM properties are designed to BREEAM Excellent standard or equivalent. We target

net-zero operational carbon by 2030 across all owned and leased properties. All EMEA properties run

on 100% renewable electricity.

Water

Our monsoon showers are timed. Our properties are equipped with greywater recycling where local

regulation permits. Water consumption per guest night is tracked quarterly against regional

benchmarks.

Supply Chain

Suppliers tendering for contracts above 10,000 EUR must complete our ESG supplier questionnaire.

Preferred Supplier List status requires a minimum ESG score of 70/100. The S2P governance agent

checks ESG status as part of the vendor verification workflow.

Social & Governance

Living Wage Commitment

Every citizenmaker earns at minimum the Real Living Wage as defined by the Living Wage Foundation,

in every market where we operate. This is non-negotiable and applies to all direct employees and

contracted cleaning staff.

AI Governance & Ethics

citizenM's AI systems are governed by the VDA-MD framework. Every AI agent decision is subject to

human oversight, logged by the Witness Agent, and auditable. We comply with EU AI Act requirements

and have designated a responsible AI officer.

Data Transparency

We process guest data under GDPR Article 6 lawful bases. We do not sell personal data. We publish an

annual data transparency report. Every automated decision affecting guests can be reviewed and

contested under GDPR Article 22.

Reporting & Targets

Metric

2025 Baseline

2027 Target

2030 Target

Operational carbon (kg CO2e/room/night) 12.4

Renewable energy coverage (EMEA)

78%

Living Wage coverage (all markets)

94%

Supplier ESG questionnaire completion

61%

AI decisions with Witness Agent log

100%

9.0

95%

100%

85%

100%

Net Zero

100%

100%

100%

100%`,
  "10": `citizenM Responsible AI Charter
Chief Digital Officer + CISO | Approved by Executive Committee | February 2026

Preamble

citizenM deploys AI agents to govern operational decisions across the guest journey and shared

services. We believe AI without governance is a liability. This charter sets out the non-negotiable

principles under which every AI system at citizenM operates.

Core Principles

1. Human Oversight is Non-Negotiable

Every AI agent decision at citizenM can be reviewed, overridden, or interrupted by a named human.

This is not a theoretical right — it is technically enforced. The VP Revenue cannot be bypassed by the

rate override agent. The CISO's sign-off on fast-track access cannot be circumvented.

2. Governance Files Are the Law

Every agent operates under a plain-text Markdown governance file authored by the domain owner and

approved by the Chief Compliance Officer. Agents do not operate on instructions from chat messages,

emails, or verbal requests. The .md file is the law.

3. Exceptions Are Formal, Not Ad-Hoc

When a business need requires an agent to operate outside its baseline rules, a formal exception

overlay (.md file) is authored, approved, version-controlled, and time-limited. There are no informal

exceptions. There is no 'just this once'. Every exception is in Git.

4. Every Decision Is Logged

The Witness Agent writes a structured, tamper-evident audit entry before every operational action.

Entries record the agent identity, governance file version, specific clause applied, and whether an

exception was invoked. These logs are the evidence trail for SOC 2 Type II, GDPR Article 5, and ISO

42001 compliance.

5. Guest Rights Are Preserved

Every automated decision that materially affects a guest — rate setting, checkout time, loyalty benefit —

preserves the guest's right to human review under GDPR Article 22. Agents are instructed to inform

guests of their right to request human review.

EU AI Act Compliance Status

AI System

Risk Classification

Key Requirement

Status

Rate Override Agent

High-Risk (Art. 6)

Art. 14 human oversight enforced

Compliant

Stay Agent (Checkout)

High-Risk (Art. 6)

Art. 12 logging, Art. 14 override

Compliant

HRpay Access Agent

High-Risk (Annex III)

Art. 9 risk mgmt, CISO gate

S2P Procurement Agent

High-Risk (Art. 6)

Art. 17 QMS, CFO ceiling

Compliant

Compliant

Witness Agent

Minimal Risk

Art. 12 — is the logging system

Compliant`,
  "11": `citizenM Source-to-Pay Policy Summary
Shared Services — Finance | CFO | Effective: January 2026

Purpose

This policy governs all procurement activity at citizenM. Every purchase order, supplier engagement,

and financial commitment must comply with the approval authority matrix and three-quote requirements

set out below. The S2P AI agent enforces these rules at the point of PO creation.

Approval Authority Matrix

Amount (EUR)

Required Authority

Quote Requirement

Budget Code Needed?

Up to 10,000

Department Head

Not required

Yes — mandatory

10,001 – 50,000

Operations Director

3 competitive quotes

Yes — mandatory

50,001 – 250,000

CFO sign-off required

3 competitive quotes

Yes — mandatory

Above 250,000

CFO + Board notification

3 competitive quotes

Yes + Board record

Preferred Tech Supplier Exception — EMEA

Suppliers on the citizenM Preferred Tech Supplier List (EMEA) may be approved at Operations Director

level up to 75,000 EUR without the three-quote requirement. This exception applies only to:

(cid:127) Current Preferred Tech List status (verified annually in SAP vendor master)

(cid:127) EMEA invoices and purchase orders only

(cid:127) Individual PO values not exceeding 75,000 EUR

Agent Rules — S2P AI System

MUST NOT raise a PO above the requestor's delegated authority level

MUST verify three-quote compliance for all POs above 10,000 EUR (unless Preferred Tech
exception applies)

MUST flag any supplier not on the Approved Vendor list regardless of amount

MUST confirm a valid SAP budget code exists before committing any spend

MUST log every decision to the Witness Agent with the governing clause cited

NIST SP 800-53 & Regulatory Alignment

Framework

Control / Article

Requirement Addressed

NIST SP 800-53 Rev 5

SA-4 Acquisition Process

Security and acceptance criteria in procurement

GDPR

EU AI Act

EU AI Act

Art. 25 — Data Protection by Design Minimal data access during vendor verification

Art. 14 — Human Oversight

CFO ceiling technically enforced, not advisory

Art. 12 — Record-Keeping

All decisions logged to Witness Agent

ISO 42001

Clause 8 — Operation

QMS coverage of procurement AI decisions`,
  "13": `# citizenM Technology Stack — Apaleo API Architecture
## Source: Goodbits/Sunrise API Overview (internal tech sheet, MarkItDown processed, Amadeus excluded)
## Status: 100% Apaleo — migration complete

---

## CRITICAL: citizenM System Architecture

citizenM runs entirely on Apaleo as its PMS. All reservation, guest, room, payment and finance
operations go through a Goodbits API gateway layer that wraps Apaleo's native endpoints.

### Core Systems
- **Apaleo** — Property Management System (PMS). The single source of truth for all reservations
- **Goodbits** — citizenM's internal API gateway layer over Apaleo. All agents call Goodbits, not Apaleo directly
- **Goodbits endpoints** use the pattern: 'reservations/v2/...' and 'invoices/v2/...'
- **Underlying Apaleo endpoints** follow: '/booking/v1/...', '/inventory/v1/...', '/finance/v1/...', '/profile/v0-nsfw/...'
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
| Remo

[... Apaleo architecture continues ...]`,
  "12": `citizenM Property Operations Manual — AI
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

review at any time. The Witness Agent log is the evidence trail for any such request.`,
};

const INGESTED_DOCS = [
  { num: "01", name: "Brand Manifesto & Voice Guide",         type: "docx", icon: "📝", chars: 3206,
    keyTerms: ["citizenmakers","ambassadors","cloudM","canteenM","Living Room","mobile citizen","affordable luxury","Operations Lead"] },
  { num: "02", name: "People Philosophy & HR Principles",     type: "docx", icon: "📝", chars: 2400,
    keyTerms: ["Workday","citizenmakers","fast-track","CISO sign-off","Operations Lead","flat structure"] },
  { num: "03", name: "Digital & Technology Strategy",         type: "docx", icon: "📝", chars: 2386,
    keyTerms: ["cloudM PMS","VDA-MD","Witness Agent","Preferred Tech","SAP","AI-First","C2MD"] },
  { num: "04", name: "Guest Experience Standards",            type: "docx", icon: "📝", chars: 2287,
    keyTerms: ["citizenM Black","cloudM","canteenM","14:00 checkout","Salesforce","Living Room"] },
  { num: "05", name: "Procurement Approval Authority Matrix", type: "xlsx", icon: "📊", chars: 1999,
    keyTerms: ["Preferred Tech EMEA","75,000 EUR","Operations Director","three-quote","SAP vendor master"] },
  { num: "06", name: "Key Account Rate Matrix",               type: "xlsx", icon: "📊", chars: 1940,
    keyTerms: ["Tier 1","18% max discount","Revenue Manager","Salesforce CRM","rate parity"] },
  { num: "07", name: "HR Access Provisioning Matrix",         type: "xlsx", icon: "📊", chars: 1820,
    keyTerms: ["fast-track","Digital/Tech roles","CISO log","Workday","5 working days pre-start"] },
  { num: "08", name: "Witness Agent Dashboard Template",      type: "xlsx", icon: "📊", chars: 2371,
    keyTerms: ["Witness Agent","exception flag","SOC 2 KPI","PASS / FAIL / ESCALATE","AU-2"] },
  { num: "09", name: "Sustainability & ESG Policy",           type: "pdf",  icon: "📄", chars: 2241,
    keyTerms: ["BREEAM Excellent","Real Living Wage","S2P ESG check","AI governance","GDPR Art. 22"] },
  { num: "10", name: "Responsible AI Charter",                type: "pdf",  icon: "📄", chars: 2456,
    keyTerms: ["governance files are the law","Witness Agent","exception overlays","EU AI Act","CISO gate"] },
  { num: "11", name: "S2P Procurement Policy Summary",        type: "pdf",  icon: "📄", chars: 2177,
    keyTerms: ["Preferred Tech exception","SAP","budget code","three-quote","CFO ceiling"] },
  { num: "12", name: "Operations Manual — AI Extract",        type: "pdf",  icon: "📄", chars: 2137,
    keyTerms: ["cloudM PMS","Stay Agent","checkout override","Witness Agent log","GDPR Art. 6(b)"] },
  { num: "13", name: "Apaleo API Tech Sheet (Real Internal Data)", type: "xlsx", icon: "⚙️", chars: 10542, real: true,
    keyTerms: ["Goodbits","Apaleo /booking/v1","reservations/v2","Auth0","Adyen","Contentful","VCI rooms","BAC tickets"] },
];

const TYPE_COLOR = { docx: T.blue, xlsx: T.green, pdf: T.red };
const TYPE_LABEL = { docx: "Word", xlsx: "Excel", pdf: "PDF" };

function BrandIngestionPanel() {
  const [open, setOpen] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const totalChars = INGESTED_DOCS.reduce((s, d) => s + d.chars, 0);
  const byType = { docx: 0, xlsx: 0, pdf: 0 };
  INGESTED_DOCS.forEach(d => byType[d.type]++);

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Doc preview modal */}
      {previewDoc && (
        <DocPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}

      {/* Collapsed bar */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: open ? `${T.purple}10` : T.card,
          border: `1px solid ${open ? T.purple + "60" : T.border}`,
          borderRadius: open ? "12px 12px 0 0" : 12,
          padding: "14px 20px",
          cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {/* Pipeline icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: `${T.purple}18`, border: `1px solid ${T.purple}50`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🏗️</div>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 14, color: T.text }}>
                Brand Context Ingested via Microsoft MarkItDown
              </span>
              <Tag color={T.purple}>13 Documents</Tag>
              <Tag color={T.green}>Active in C2MD Prompt</Tag>
            </div>
            <div style={{ fontSize: 12, color: T.dim, fontFamily: T.mono }}>
              {byType.docx} Word · {byType.xlsx} Excel · {byType.pdf} PDF · 1 Real &nbsp;→&nbsp;
              {totalChars.toLocaleString()} chars of brand context injected into every translation
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Pipeline stages */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, fontFamily: T.mono }}>
            {["citizenM Docs","→","MarkItDown","→",".md context","→","C2MD Prompt","→","Brand-flavoured .md"].map((s, i) => (
              <span key={i} style={{ color: s === "→" ? T.dim : i >= 6 ? T.green : T.muted }}>{s}</span>
            ))}
          </div>
          <span style={{ color: T.dim, fontSize: 14, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
        </div>
      </div>

      {/* Expanded document grid */}
      {open && (
        <div style={{
          border: `1px solid ${T.purple}60`, borderTop: "none",
          borderRadius: "0 0 12px 12px", background: "#070810",
          animation: "slide-up 0.25s ease",
        }}>
          {/* MarkItDown credit */}
          <div style={{
            padding: "12px 20px", borderBottom: `1px solid ${T.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
              Ingestion engine: <strong style={{ color: T.text }}>Microsoft MarkItDown</strong>
              {" "}— open-source tool that converts Word, Excel, and PDF into clean Markdown.
              Each document was converted, concatenated, and injected into the C2MD system prompt
              as brand context. Every NIST translation below uses this context.
            </div>
            <a href="https://github.com/microsoft/markitdown" target="_blank"
              style={{ fontSize: 11, color: T.purple, fontFamily: T.mono, whiteSpace: "nowrap",
                marginLeft: 20, textDecoration: "none", borderBottom: `1px solid ${T.purple}50` }}>
              github.com/microsoft/markitdown ↗
            </a>
          </div>

          {/* Document grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12, padding: "16px 20px 20px",
          }}>
            {INGESTED_DOCS.map(doc => (
              <div key={doc.num}
                onClick={() => setPreviewDoc(doc)}
                onMouseEnter={() => setHoveredDoc(doc.num)}
                onMouseLeave={() => setHoveredDoc(null)}
                style={{
                  background: hoveredDoc === doc.num ? `${TYPE_COLOR[doc.type]}14` : "#09090f",
                  border: `1px solid ${hoveredDoc === doc.num ? TYPE_COLOR[doc.type] + "70" : T.border}`,
                  borderRadius: 9, padding: "12px 14px",
                  transition: "all 0.15s", cursor: "pointer",
                  transform: hoveredDoc === doc.num ? "translateY(-1px)" : "none",
                  boxShadow: hoveredDoc === doc.num ? `0 4px 16px ${TYPE_COLOR[doc.type]}20` : "none",
                }}
              >
                {/* Doc header */}
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 18, lineHeight: 1.2, flexShrink: 0 }}>{doc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                      <span style={{
                        fontSize: 9, fontFamily: T.mono, fontWeight: 800,
                        background: `${TYPE_COLOR[doc.type]}20`,
                        color: TYPE_COLOR[doc.type],
                        border: `1px solid ${TYPE_COLOR[doc.type]}40`,
                        borderRadius: 3, padding: "1px 5px",
                      }}>{TYPE_LABEL[doc.type].toUpperCase()}</span>
                      <span style={{ fontSize: 10, color: T.dim, fontFamily: T.mono }}>{doc.num}</span>
                      {doc.real && <span style={{ fontSize: 9, fontFamily: T.mono, fontWeight: 800, background: `${T.orange}20`, color: T.orange, border: `1px solid ${T.orange}50`, borderRadius: 3, padding: "1px 5px" }}>REAL</span>}
                    </div>
                    <div style={{ fontSize: 12, color: T.text, fontWeight: 600, lineHeight: 1.4 }}>{doc.name}</div>
                  </div>
                </div>

                {/* Chars */}
                <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 8 }}>
                  {doc.chars.toLocaleString()} chars · {doc.real ? "Real internal data → MarkItDown → .md" : "MarkItDown → .md"}
                </div>

                {/* Key terms */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {doc.keyTerms.slice(0, 4).map(t => (
                    <span key={t} style={{
                      fontSize: 9, fontFamily: T.mono,
                      background: `${TYPE_COLOR[doc.type]}12`,
                      color: TYPE_COLOR[doc.type],
                      border: `1px solid ${TYPE_COLOR[doc.type]}30`,
                      borderRadius: 3, padding: "2px 6px",
                    }}>{t}</span>
                  ))}
                </div>
                {/* Click hint */}
                <div style={{
                  fontSize: 9, color: hoveredDoc === doc.num ? TYPE_COLOR[doc.type] : T.dim,
                  fontFamily: T.mono, transition: "color 0.15s",
                  display: "flex", gap: 4, alignItems: "center",
                }}>
                  <span>↗</span> click to preview MarkItDown output
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div style={{
            padding: "10px 20px 14px", borderTop: `1px solid ${T.border}`,
            display: "flex", gap: 24, alignItems: "center",
          }}>
            <div style={{ fontSize: 11, color: T.dim, fontFamily: T.mono }}>
              Total ingested: <span style={{ color: T.purple }}>{totalChars.toLocaleString()} chars</span>
            </div>
            {[
              { label: "Key brand terms active", val: "13", color: T.orange },
              { label: "System names mapped", val: "7", color: T.blue },
              { label: "Role titles normalised", val: "5", color: T.green },
            ].map(s => (
              <div key={s.label} style={{ fontSize: 11, color: T.dim, fontFamily: T.mono }}>
                {s.label}: <span style={{ color: s.color, fontWeight: 700 }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: C2MD STUDIO — Live API-driven
// ─────────────────────────────────────────────
function C2MDStudioTab() {
  const [sel, setSel] = useState("AC-2");
  // cache: { [controlId]: { md, filename, overall_confidence, clauses } }
  const [cache, setCache] = useState({});
  const [status, setStatus] = useState("idle"); // idle | calling | streaming | done | error
  const [displayedMd, setDisplayedMd] = useState("");
  const [error, setError] = useState(null);
  const streamRef = useRef(null);
  const ctrl = NIST[sel];
  const result = cache[sel];

  const handleTranslate = async () => {
    if (result || status === "calling" || status === "streaming") return;
    setError(null);
    setStatus("calling");
    setDisplayedMd("");
    clearInterval(streamRef.current);

    try {
      const parsed = await runC2MDTranslation(sel, ctrl);
      // Stream the md content with typewriter
      setStatus("streaming");
      const full = parsed.md;
      let i = 0;
      streamRef.current = setInterval(() => {
        if (i >= full.length) {
          clearInterval(streamRef.current);
          setStatus("done");
          setCache(p => ({ ...p, [sel]: parsed }));
          return;
        }
        i = Math.min(i + 4, full.length);
        setDisplayedMd(full.substring(0, i));
      }, 8);
    } catch (e) {
      clearInterval(streamRef.current);
      setStatus("error");
      setError(e.message);
    }
  };

  // When switching controls, restore from cache or reset
  useEffect(() => {
    clearInterval(streamRef.current);
    if (cache[sel]) {
      setDisplayedMd(cache[sel].md);
      setStatus("done");
    } else {
      setDisplayedMd("");
      setStatus("idle");
    }
    setError(null);
  }, [sel]);

  const isTranslating = status === "calling" || status === "streaming";
  const isDone = status === "done" && result;

  const btnLabel = status === "calling" ? "Calling API…" :
                   status === "streaming" ? "Writing…" :
                   isDone ? "✓" : "→";

  const filename = result?.filename || `${ctrl.domain.toLowerCase().replace(/[^a-z0-9]/g,"-")}-${sel.toLowerCase()}.md`;

  return (
    <div style={{ padding: "28px 28px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 24, color: T.text, letterSpacing: "-0.03em" }}>
            C2MD Studio
          </h2>
          <Tag color={T.orange}>Live API</Tag>
          <Tag color={T.green}>Real Translation</Tag>
          <Tag color={T.purple}>Brand-Flavoured</Tag>
        </div>
        <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 720 }}>
          This is the C2MD pipeline — your unique IP. Actual NIST SP 800-53 OSCAL source data is passed to Claude with a VDA-MD translation prompt enriched with citizenM's own brand context. The output is a genuine governance .md file that sounds like it was written by a citizenM domain owner. Not a template. Not pre-written. Generated now.
        </p>
      </div>

      {/* Brand Ingestion Panel */}
      <BrandIngestionPanel />

      {/* Control selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(NIST).map(([id, c]) => (
          <button key={id} onClick={() => setSel(id)} style={{
            padding: "9px 18px", borderRadius: 8,
            border: `2px solid ${sel === id ? T.orange : cache[id] ? T.green + "60" : T.border}`,
            background: sel === id ? `${T.orange}12` : cache[id] ? `${T.green}08` : T.card,
            color: sel === id ? T.orange : cache[id] ? T.green : T.muted,
            cursor: "pointer", fontWeight: 600, fontSize: 13,
            fontFamily: T.sans, transition: "all 0.2s",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <span style={{ fontFamily: T.mono, fontWeight: 700 }}>{id}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            {c.title}
            {cache[id] && <span style={{ fontSize: 10 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Control metadata bar */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
        padding: "14px 18px", marginBottom: 20,
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
      }}>
        <div style={{ color: T.orange, fontSize: 22, lineHeight: 1 }}>◉</div>
        <div>
          <div style={{ fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 3 }}>
            {ctrl.family} · {sel}: {ctrl.title}
          </div>
          <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.5 }}>{ctrl.description}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: T.dim }}>Domain</div>
          <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{ctrl.domainLabel}</div>
          <div style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>Owner</div>
          <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{ctrl.owner}</div>
        </div>
      </div>

      {/* Main translation panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 1fr", alignItems: "start", gap: 0 }}>

        {/* Left: OSCAL Source */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: T.mono }}>
              NIST OSCAL Source
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <Tag color={T.blue}>SP 800-53 Rev 5</Tag>
              <Tag color={T.dim}>Machine-Readable</Tag>
            </div>
          </div>
          <div style={{
            background: "#03040a", border: `1px solid ${T.border}`,
            borderRadius: 10, overflow: "hidden",
          }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "center", background: "#050609" }}>
              {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <span style={{ fontSize: 11, color: T.dim, marginLeft: 4, fontFamily: T.mono }}>
                oscal-catalog-rev5/{sel.toLowerCase()}.json
              </span>
            </div>
            <pre style={{
              color: "#7dd3fc", fontSize: 12, lineHeight: 1.8, fontFamily: T.mono,
              whiteSpace: "pre-wrap", margin: 0, padding: 16,
              maxHeight: 440, overflowY: "auto",
            }}>
              {ctrl.oscal}
            </pre>
          </div>
        </div>

        {/* Centre: translate button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 52, gap: 10 }}>
          {/* Pipeline label */}
          <div style={{
            writingMode: "vertical-rl", textOrientation: "mixed",
            fontSize: 9, color: T.dim, letterSpacing: "0.15em",
            textTransform: "uppercase", fontFamily: T.mono,
            transform: "rotate(180deg)", marginBottom: 4,
          }}>C2MD Pipeline</div>
          <button
            onClick={handleTranslate}
            disabled={isDone || isTranslating}
            style={{
              width: 46, height: 46, borderRadius: "50%",
              background: isDone ? "#0a2818" : isTranslating ? `${T.orange}20` : T.orange,
              border: `2px solid ${isDone ? T.green : isTranslating ? T.orange : T.orange}`,
              color: isDone ? T.green : "#fff",
              cursor: isDone || isTranslating ? "default" : "pointer",
              fontSize: isDone ? 18 : 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isDone || isTranslating ? "none" : `0 0 28px ${T.orange}70`,
              transition: "all 0.3s",
              animation: isTranslating ? "spin 1.2s linear infinite" : !isDone ? "glow-pulse 2s ease-in-out infinite" : "none",
            }}
            title={isDone ? "Translation complete" : "Run C2MD translation via Claude API"}
          >
            {btnLabel}
          </button>
          <span style={{ fontSize: 9, color: T.dim, textAlign: "center", fontFamily: T.mono, lineHeight: 1.4, width: 50 }}>
            {status === "calling" ? "API\nCALL" : status === "streaming" ? "LIVE\nWRITE" : isDone ? "DONE" : "CLICK\nTO RUN"}
          </span>
        </div>

        {/* Right: C2MD output */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: T.mono }}>
              C2MD Output
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <Tag color={T.green}>Human-Readable</Tag>
              <Tag color={T.purple}>Agent-Executable</Tag>
            </div>
          </div>
          <div style={{
            background: "#030805", borderRadius: 10, overflow: "hidden",
            border: `1px solid ${displayedMd ? T.green + "60" : T.border}`,
            transition: "border-color 0.6s",
            minHeight: 470,
          }}>
            {displayedMd || isTranslating ? (
              <>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 8, alignItems: "center", background: "#040a05" }}>
                  {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  <span style={{ fontSize: 11, color: T.dim, marginLeft: 4, fontFamily: T.mono }}>{filename}</span>
                  {isDone && <Tag color={T.green}>Generated</Tag>}
                  {isTranslating && (
                    <span style={{ fontSize: 11, color: T.orange, fontFamily: T.mono, animation: "pulse-ring 0.8s ease infinite" }}>
                      {status === "calling" ? "⟳ calling claude api…" : "⟳ streaming output…"}
                    </span>
                  )}
                </div>
                <pre style={{
                  color: "#a3e635", fontSize: 12, lineHeight: 1.85, fontFamily: T.mono,
                  whiteSpace: "pre-wrap", margin: 0, padding: 16,
                  maxHeight: 440, overflowY: "auto",
                }}>
                  {displayedMd}
                  {isTranslating && <span style={{ animation: "pulse-ring 0.6s ease infinite", color: T.green }}>▊</span>}
                </pre>
              </>
            ) : error ? (
              <div style={{ padding: 24, color: T.red, fontFamily: T.mono, fontSize: 13 }}>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>⚠ Translation Error</div>
                <div style={{ color: T.muted }}>{error}</div>
              </div>
            ) : (
              <div style={{ textAlign: "center", paddingTop: 100, color: T.dim }}>
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.4 }}>→</div>
                <div style={{ fontSize: 15, fontFamily: T.mono, color: T.muted }}>Ready to translate</div>
                <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.6, maxWidth: 240, margin: "8px auto 0" }}>
                  Click → to run the live C2MD pipeline via Claude API
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clause confidence panel — rendered from real API response */}
      {isDone && result?.clauses && (
        <div style={{
          marginTop: 24, background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 22, animation: "slide-up 0.45s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 16, color: T.text }}>
                Clause Confidence Analysis
              </span>
              <div style={{ fontSize: 12, color: T.dim, marginTop: 3, fontFamily: T.mono }}>
                Extracted by C2MD engine · Scores reflect translation fidelity from OSCAL to citizenM operational context
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: T.dim }}>Overall Confidence</div>
              <div style={{
                fontFamily: T.mono, fontWeight: 800, fontSize: 22,
                color: result.overall_confidence >= 0.92 ? T.green : result.overall_confidence >= 0.85 ? T.amber : T.red,
              }}>
                {Math.round(result.overall_confidence * 100)}%
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.clauses.map((clause, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 220px 52px auto",
                alignItems: "center", gap: 14,
                padding: "10px 14px",
                background: clause.flagged ? `${T.amber}08` : "#0a0c10",
                borderRadius: 8,
                border: `1px solid ${clause.flagged ? T.amber + "30" : T.border}`,
              }}>
                <div style={{ fontSize: 13, color: clause.flagged ? T.amber : T.muted, lineHeight: 1.5 }}>
                  {clause.text}
                  {clause.flag_reason && (
                    <div style={{ fontSize: 11, color: T.amber, marginTop: 3, fontStyle: "italic" }}>
                      ⚠ {clause.flag_reason}
                    </div>
                  )}
                </div>
                <div style={{ position: "relative", background: T.border, borderRadius: 999, height: 6 }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0,
                    width: `${clause.confidence * 100}%`, height: "100%",
                    background: clause.confidence >= 0.92 ? T.green :
                                 clause.confidence >= 0.85 ? T.amber : T.red,
                    borderRadius: 999,
                    transition: `width 1.2s ease ${i * 0.1}s`,
                  }} />
                </div>
                <span style={{
                  fontFamily: T.mono, fontWeight: 700, fontSize: 13, textAlign: "right",
                  color: clause.confidence >= 0.92 ? T.green : clause.confidence >= 0.85 ? T.amber : T.red,
                }}>
                  {Math.round(clause.confidence * 100)}%
                </span>
                {clause.flagged
                  ? <Tag color={T.amber}>CCO REVIEW</Tag>
                  : <Tag color={T.green}>APPROVED</Tag>
                }
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: T.dim, fontFamily: T.mono }}>
              {filename} · Generated {new Date().toISOString().substring(0,10)} · VDA-MD v1.0
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Tag color={T.blue}>NIST SP 800-53 Rev 5</Tag>
              <Tag color={T.orange}>C2MD Pipeline</Tag>
              <Tag color={T.purple}>citizenM Scoped</Tag>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: EXCEPTION ENGINE (THE WOW)
// ─────────────────────────────────────────────
function ExceptionEngineTab({ onLogEntry }) {
  const [activeId, setActiveId] = useState("s2p");
  const [params, setParams] = useState({});
  const [results, setResults] = useState({ baseline: null, exception: null });
  const [loading, setLoading] = useState({ baseline: false, exception: false });
  const [hasRun, setHasRun] = useState(false);

  const scenario = SCENARIOS[activeId];

  useEffect(() => {
    const d = {};
    scenario.params.forEach(p => { d[p.id] = scenario.defaultParams[p.id] || p.options[0]; });
    setParams(d);
    setResults({ baseline: null, exception: null });
    setHasRun(false);
  }, [activeId]);

  const run = async (withEx, key) => {
    setLoading(p => ({ ...p, [key]: true }));
    setResults(p => ({ ...p, [key]: null }));
    try {
      const r = await runGovernanceDecision(scenario, params, withEx);
      setResults(p => ({ ...p, [key]: r }));
      onLogEntry({
        id: Date.now() + Math.random(),
        timestamp: ts(),
        agent: `${scenario.label} Agent`,
        decision: r.decision,
        fileReferenced: r.file_referenced || (withEx ? scenario.exceptionFile.name : scenario.baselineFile.name),
        clauseApplied: r.clause_applied || "—",
        actionProposed: r.witness?.action_proposed || `${scenario.label} request evaluated`,
        escalationTarget: r.escalation_target,
        exceptionApplied: r.exception_applied,
      });
    } catch (e) {
      setResults(p => ({ ...p, [key]: { error: true, msg: e.message } }));
    }
    setLoading(p => ({ ...p, [key]: false }));
  };

  const handleCompare = () => {
    setHasRun(true);
    run(false, "baseline");
    run(true, "exception");
  };

  const differsOutcome = results.baseline?.decision && results.exception?.decision &&
    results.baseline.decision !== results.exception.decision;

  const bothDone = !loading.baseline && !loading.exception && results.baseline && results.exception;

  return (
    <div style={{ padding: "28px 28px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 24, color: T.text, marginBottom: 8, letterSpacing: "-0.03em" }}>
          Exception Overlay Engine
        </h2>
        <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 680 }}>
          Watch the same scenario evaluated under baseline rules vs exception overlay. The Witness Agent logs exactly which file and clause governed each decision — evidence is generated, not assembled.
        </p>
      </div>

      {/* Scenario selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.values(SCENARIOS).map(s => (
          <button key={s.id} onClick={() => setActiveId(s.id)} style={{
            padding: "10px 18px", borderRadius: 8,
            border: `2px solid ${activeId === s.id ? s.color : T.border}`,
            background: activeId === s.id ? `${s.color}12` : T.card,
            color: activeId === s.id ? s.color : T.muted,
            cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: T.sans,
            transition: "all 0.2s", display: "flex", gap: 8, alignItems: "center",
          }}>
            <span>{s.icon}</span> {s.label}
            <Tag color={s.color}>{s.journeyStage}</Tag>
          </button>
        ))}
      </div>

      {/* Governance files */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <FilePanel file={scenario.baselineFile} type="SOP" accent={T.blue} defaultOpen={false} />
        <FilePanel file={scenario.exceptionFile} type="EXCEPTION" accent={T.purple} defaultOpen={false} />
      </div>

      {/* Parameters + Run */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 16 }}>Scenario Parameters</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 18 }}>
          {scenario.params.map(p => (
            <div key={p.id}>
              <label style={{ fontSize: 10, color: T.muted, display: "block", marginBottom: 7, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: T.mono }}>
                {p.label}
              </label>
              <select
                value={params[p.id] || p.options[0]}
                onChange={e => setParams(pv => ({ ...pv, [p.id]: e.target.value }))}
                style={{
                  width: "100%", padding: "9px 12px", background: T.surface,
                  border: `1px solid ${T.borderHi}`, borderRadius: 7, color: T.text,
                  fontSize: 13, fontFamily: T.sans, cursor: "pointer", outline: "none",
                  appearance: "none",
                }}
              >
                {p.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button
          onClick={handleCompare}
          disabled={loading.baseline || loading.exception}
          style={{
            padding: "12px 28px", background: T.orange, border: "none", borderRadius: 9,
            color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: T.sans,
            cursor: loading.baseline || loading.exception ? "wait" : "pointer",
            opacity: loading.baseline || loading.exception ? 0.65 : 1,
            letterSpacing: "-0.01em",
            boxShadow: loading.baseline || loading.exception ? "none" : `0 0 28px ${T.orange}55`,
            transition: "all 0.3s",
            animation: loading.baseline || loading.exception ? "none" : "glow-pulse 3s ease-in-out infinite",
          }}>
          {loading.baseline || loading.exception ? "⟳  Evaluating…" : "⚡  Compare — Baseline vs Exception"}
        </button>
      </div>

      {/* WOW callout */}
      {bothDone && differsOutcome && (
        <div style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a1a2e 100%)",
          border: `2px solid ${T.purple}`,
          borderRadius: 12, padding: 20, marginBottom: 20,
          display: "flex", gap: 16, alignItems: "center",
          animation: "slide-up 0.4s ease",
        }}>
          <div style={{ fontSize: 36, lineHeight: 1 }}>⚡</div>
          <div>
            <div style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 18, color: T.purple, marginBottom: 6, letterSpacing: "-0.02em" }}>
              Exception Changed the Outcome
            </div>
            <div style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.6 }}>
              The exception overlay transformed the governance decision from <strong style={{ color: T.red }}>
                {results.baseline?.decision}
              </strong> to <strong style={{ color: T.green }}>{results.exception?.decision}</strong>.
              This is C2MD in action — same scenario, different rules, fully auditable result. The Witness Agent logged which file governed each outcome.
            </div>
          </div>
        </div>
      )}

      {/* Results grid */}
      {hasRun && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "slide-up 0.3s ease" }}>
          {/* Baseline */}
          <div style={{
            background: T.card, borderRadius: 12, padding: 20,
            border: `2px solid ${results.baseline?.decision === "PASS" ? T.green + "50" :
              results.baseline?.decision === "FAIL" ? T.red + "50" :
              results.baseline?.decision === "ESCALATE" ? T.amber + "50" : T.border}`,
            transition: "border-color 0.4s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag color={T.blue}>SOP</Tag>
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.blue }}>Baseline Only</span>
              </div>
              {loading.baseline ? (
                <span style={{ color: T.muted, fontSize: 13, fontFamily: T.mono }}>⟳ evaluating…</span>
              ) : results.baseline && !results.baseline.error ? (
                <DecisionBadge decision={results.baseline.decision} large />
              ) : null}
            </div>

            {results.baseline && !results.baseline.error && (
              <div style={{ animation: "slide-up 0.3s ease" }}>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 10, fontFamily: T.mono }}>
                  → <span style={{ color: T.blue }}>{results.baseline.file_referenced}</span>
                </div>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>
                  {results.baseline.reasoning}
                </p>
                <div style={{ background: "#04050a", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: T.mono }}>Clause Applied</div>
                  <div style={{ fontSize: 13, color: "#7dd3fc", fontFamily: T.mono, fontStyle: "italic", lineHeight: 1.6 }}>
                    {results.baseline.clause_applied}
                  </div>
                </div>
                {results.baseline.escalation_target && (
                  <div style={{ marginTop: 12, background: "#1f1500", border: `1px solid ${T.amber}50`, borderRadius: 8, padding: "10px 12px", fontSize: 14, color: T.amber }}>
                    ↳ Escalate to: <strong>{results.baseline.escalation_target}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exception */}
          <div style={{
            background: T.card, borderRadius: 12, padding: 20,
            border: `2px solid ${results.exception?.decision === "PASS" ? T.green + "50" :
              results.exception?.decision === "FAIL" ? T.red + "50" :
              results.exception?.decision === "ESCALATE" ? T.amber + "50" : T.border}`,
            transition: "border-color 0.4s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag color={T.purple}>EXCEPTION</Tag>
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.purple }}>With Exception Overlay</span>
              </div>
              {loading.exception ? (
                <span style={{ color: T.muted, fontSize: 13, fontFamily: T.mono }}>⟳ evaluating…</span>
              ) : results.exception && !results.exception.error ? (
                <DecisionBadge decision={results.exception.decision} large />
              ) : null}
            </div>

            {results.exception && !results.exception.error && (
              <div style={{ animation: "slide-up 0.3s ease" }}>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 10, fontFamily: T.mono, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  → <span style={{ color: T.purple }}>{results.exception.file_referenced}</span>
                  {results.exception.exception_applied && <Tag color={T.purple}>Exception Applied</Tag>}
                </div>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>
                  {results.exception.reasoning}
                </p>
                <div style={{ background: "#080408", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: T.mono }}>Clause Applied</div>
                  <div style={{ fontSize: 13, color: "#c4b5fd", fontFamily: T.mono, fontStyle: "italic", lineHeight: 1.6 }}>
                    {results.exception.clause_applied}
                  </div>
                </div>
                {results.exception.escalation_target && (
                  <div style={{ marginTop: 12, background: "#1f1500", border: `1px solid ${T.amber}50`, borderRadius: 8, padding: "10px 12px", fontSize: 14, color: T.amber }}>
                    ↳ Escalate to: <strong>{results.exception.escalation_target}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: WITNESS AGENT
// ─────────────────────────────────────────────
function WitnessAgentTab({ log }) {
  const stats = {
    PASS: log.filter(e => e.decision === "PASS").length,
    FAIL: log.filter(e => e.decision === "FAIL").length,
    ESCALATE: log.filter(e => e.decision === "ESCALATE").length,
    exceptions: log.filter(e => e.exceptionApplied).length,
  };

  return (
    <div style={{ padding: "28px 28px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 24, color: T.text, marginBottom: 8, letterSpacing: "-0.03em" }}>
            Witness Agent — Audit Trail
          </h2>
          <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 580 }}>
            Every agent decision logged automatically as Evidence-as-Code. Generated as a byproduct of operations — not assembled retrospectively for auditors.
          </p>
          <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
            {[
              { label: "Business Domain", color: T.blue },
              { label: "Operations Domain", color: T.orange },
              { label: "Shared Services", color: T.green },
            ].map(d => (
              <div key={d.label} style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          {[
            { label: "Total", val: log.length, color: T.muted },
            { label: "PASS", val: stats.PASS, color: T.green },
            { label: "FAIL", val: stats.FAIL, color: T.red },
            { label: "ESCALATE", val: stats.ESCALATE, color: T.amber },
            { label: "Exceptions", val: stats.exceptions, color: T.purple },
          ].map(s => (
            <div key={s.label} style={{
              background: T.card, border: `1px solid ${s.color}30`,
              borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 64,
            }}>
              <div style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 22, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 2, letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {log.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.dim }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🕵️</div>
          <div style={{ fontSize: 16, fontFamily: T.sans, fontWeight: 600, marginBottom: 8 }}>Audit log is empty</div>
          <div style={{ fontSize: 14 }}>Run decisions in the Exception Engine to generate audit entries</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...log].reverse().map((e, i) => (
            <WitnessEntry key={e.id} entry={e} idx={i} />
          ))}
        </div>
      )}

      {log.length > 0 && (
        <div style={{
          marginTop: 20, background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 8, padding: "12px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ fontSize: 12, color: T.dim, fontFamily: T.mono }}>
            audit_log.md · Evidence-as-Code · Tamper-evident · Version controlled in GitHub
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Tag color={T.green}>SOC 2 Type II</Tag>
            <Tag color={T.blue}>GDPR Article 5</Tag>
            <Tag color={T.purple}>ISO 42001</Tag>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// GUIDED TOUR
// ─────────────────────────────────────────────

// Each step: tab to switch to, spotlight coords (% of viewport), card anchor, content
const TOUR_STEPS = [
  {
    id: "welcome",
    tab: "journey",
    type: "welcome",
    title: "Value-Driven AI with Markdowns",
    subtitle: "citizenM Hotels · AI Transformation Framework · Confidential POC",
    body: `The hotel industry is deploying AI agents without governance. Rules live in someone's head, exceptions get approved on WhatsApp, and when the regulator asks for evidence — the scramble begins.

No GDPR Article 22 compliance for automated guest decisions. No EU AI Act risk management or human oversight for high-risk AI systems. No CISO sign-off trail for access provisioning. No industry-accepted auditability standard that a regulator, auditor, or board can point to. Just agents making consequential decisions with nothing underneath them.

VDA-MD (Value-Driven AI with Markdowns) is the transformation framework that fixes this. Here is what this demo proves:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏗️  STRUCTURE
The entire citizenM guest journey — Pre-Book, Book, Stay, Post-Stay — plus Shared Services (Finance, HR) is embedded into the governance architecture using Value Streams and Domains. Every AI agent knows its domain owner, its journey stage, and its governing files. The RACI is the file structure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📥  BRAND & TECH INGESTION — Microsoft MarkItDown
Before generating a single governance file, we ingest 13 citizenM source documents using Microsoft MarkItDown — 4 Word docs, 4 Excel sheets, 4 PDFs, plus a real internal Apaleo API tech sheet.

MarkItDown converts every document to clean Markdown. That 38,000-character context — brand voice, role titles, system names, real API endpoints — is injected into every C2MD translation.

Result: governance files that reference "Goodbits PUT reservations/v2/reservations/{code}/actions/checkout" instead of "update the PMS". Governance files that say "Operations Lead" not "hotel manager". Files your team will actually read.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋  C2MD — Compliance to Markdown (unique IP)
Real NIST SP 800-53 OSCAL controls are passed to Claude alongside the MarkItDown brand + tech context. Claude writes a genuine, citizenM-scoped governance .md file from scratch — not a template. The output cites real Apaleo endpoints, real system names, real authority thresholds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡  EXCEPTION ENGINE
Every agent decision runs against its baseline .md file at runtime. When an exception applies — citizenM Black checkout, Preferred Tech supplier, Tier 1 Key Account — the exception overlay is evaluated alongside the baseline. Two live Claude API calls. Side-by-side outcomes. The agent cites the exact clause. No ambiguity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕵️  WITNESS AGENT — Evidence as Code
Every decision is logged automatically to a tamper-evident audit trail before the action executes. SOC 2 Type II. GDPR Article 5. ISO 42001. Built into operations — not assembled for auditors after the fact.`,
    icon: "🏨",
    cta: "Start the tour →",
  },
  {
    id: "journey-concept",
    tab: "journey",
    type: "spotlight",
    spotlight: { top: 58, left: 0, width: "100%", height: 44 },
    title: "Five Modules — One Governance Fabric",
    body: "🗺  Journey Map — two-axis architecture with clickable agents\n🔬  C2MD Studio — NIST OSCAL + MarkItDown brand context → live translation\n⚡  Exception Engine — baseline vs exception, the primary wow moment\n🕵️  Witness Agent — live tamper-evident audit trail\n📁  Governance Files — all 8 .md files with NIST + GDPR + EU AI Act sources\n\nThe app switches tabs automatically as we walk through each module.",
    icon: "🗺",
    arrowDir: "up",
  },
  {
    id: "journey-map",
    tab: "journey",
    type: "spotlight",
    spotlight: { top: 102, left: 0, width: "100%", height: "calc(100vh - 240px)" },
    title: "Two-Axis Governance Map — Every Agent is Clickable",
    body: "Vertical axis: four guest journey stages — Pre-Book, Book, Stay, Post-Stay. Each has a domain owner, AI agents, and governing .md files.\n\nHorizontal axis: shared services — S2P, O2C, HRpay — that cut across all journey stages.\n\n✦ Click any agent name. A drawer opens showing its MUST / MUST NOT / MAY rules parsed from the real .md file, the exception overlay, the full NIST + GDPR + EU AI Act compliance sources, and the actual Apaleo API endpoints it calls in production.",
    icon: "📐",
    arrowDir: "left",
  },
  {
    id: "c2md-intro",
    tab: "c2md",
    type: "spotlight",
    spotlight: { top: 102, left: 0, width: "100%", height: 130 },
    title: "C2MD Studio — The Unique IP",
    body: "C2MD (Compliance to Markdown) translates NIST SP 800-53 OSCAL controls into plain-text governance .md files any domain owner can read and approve. No Rego. No YAML. No compliance tooling.\n\nWhat makes this different from any other compliance tool: the translation is enriched with citizenM's own brand language and real production tech stack — ingested from 13 source documents via Microsoft MarkItDown before a single character of governance is written.",
    icon: "🔬",
    arrowDir: "up",
  },
  {
    id: "brand-ingestion",
    tab: "c2md",
    type: "spotlight",
    spotlight: { top: 244, left: 24, width: "calc(100% - 48px)", height: 78 },
    title: "Microsoft MarkItDown — 13 Documents, 38,000 Characters",
    body: "Click the panel to expand it. Thirteen citizenM source documents — Word, Excel, PDF — were converted to clean Markdown by Microsoft MarkItDown and injected into every C2MD translation prompt.\n\n12 simulate the citizenM brand corpus: voice guide, people philosophy, digital strategy, procurement matrices, HR access rules, ESG policy, AI ethics charter, Witness Agent dashboard.\n\nDocument 13 — marked REAL — is an actual citizenM internal tech sheet: the Goodbits/Apaleo API mapping. It tells Claude the exact endpoints every agent calls in production.\n\nClick any document card to read what MarkItDown extracted.",
    icon: "🏗️",
    arrowDir: "up",
  },
  {
    id: "c2md-apaleo",
    tab: "c2md",
    type: "spotlight",
    spotlight: { top: 244, left: 24, width: "calc(100% - 48px)", height: 78 },
    title: "Why the Tech Sheet Changes Everything",
    body: "Before the Apaleo tech sheet, a translated AC-2 governance file would say:\n'The agent must update the PMS when an account is deactivated.'\n\nAfter MarkItDown ingestion of the real tech sheet, the same translation says:\n'The agent MUST call PUT reservations/v2/reservations/{code}/actions/checkout via Goodbits → Apaleo /booking/v1/reservation-actions/{id}/checkout. Auth level: trusted environment. Witness Agent entry written before the Apaleo write.'\n\nThat is the difference between a governance document and a governance document that governs. The agent knows exactly what it is and is not allowed to call.",
    icon: "⚙️",
    arrowDir: "up",
  },
  {
    id: "c2md-translate",
    tab: "c2md",
    type: "spotlight",
    spotlight: { top: 430, left: "calc(50% - 30px)", width: 60, height: 60 },
    title: "Live Translation — Click → to Run",
    body: "Click the → button on any NIST control. The actual OSCAL JSON plus 38,000 characters of citizenM brand and tech context are sent to Claude via the Anthropic API.\n\nClaude writes the governance file from scratch. The output will:\n• Name 'Operations Lead' not 'hotel manager'\n• Reference 'cloudM / Goodbits / Apaleo' not 'the PMS'\n• Cite real endpoint paths from the tech sheet\n• Use 'citizenmakers' and 'ambassadors' throughout\n\nClause confidence scores are generated by Claude — anything below 88% is flagged for CCO review.",
    icon: "→",
    arrowDir: "up",
  },
  {
    id: "exception-intro",
    tab: "exception",
    type: "spotlight",
    spotlight: { top: 158, left: 0, width: "100%", height: 58 },
    title: "Exception Overlay Engine — The Primary Wow",
    body: "Every governance scenario has a baseline SOP and an exception overlay. Both are real .md files with real Apaleo endpoint references.\n\nChoose a scenario — VIP Late Checkout, Supplier Invoice, Rate Override, Staff Access — configure the parameters, and hit Compare. Watch the same agent decision play out under two different governance regimes simultaneously.",
    icon: "⚡",
    arrowDir: "up",
  },
  {
    id: "exception-params",
    tab: "exception",
    type: "spotlight",
    spotlight: { top: 480, left: 24, width: "calc(100% - 48px)", height: 160 },
    title: "Set Up the S2P Demo",
    body: "For the clearest demonstration, select the S2P scenario and set:\n• Supplier Status → Preferred Tech (EMEA)\n• Amount → €60,000\n• Quotes → No quotes provided\n\nBaseline result: FAIL — €60k exceeds the no-quote threshold, three quotes required.\nException result: PASS — Preferred Tech EMEA status verified in SAP vendor master, three-quote requirement waived.\n\nSame invoice. Same amount. Different governance file. Different outcome. Fully logged.",
    icon: "🎛️",
    arrowDir: "down",
  },
  {
    id: "exception-compare",
    tab: "exception",
    type: "spotlight",
    spotlight: { top: 630, left: 24, width: 280, height: 50 },
    title: "Two Live Claude API Calls — Simultaneously",
    body: "This button fires two parallel Anthropic API calls. One evaluates the scenario against the baseline SOP only. One applies the exception overlay.\n\nEach result shows: the decision badge (PASS / FAIL / ESCALATE), the exact .md file referenced, the specific clause applied, and the reasoning in plain English.\n\nWhen the exception changes the outcome a purple banner fires. Both entries are written to the Witness Agent audit trail automatically — no manual logging, no retrospective assembly.",
    icon: "🔥",
    arrowDir: "left",
  },
  {
    id: "witness-intro",
    tab: "witness",
    type: "spotlight",
    spotlight: { top: 102, left: 0, width: "100%", height: "calc(100vh - 160px)" },
    title: "Witness Agent — The Audit Trail Writes Itself",
    body: "Every agent decision is logged here before the action executes. The schema records: timestamp, agent identity, governance file version, the specific clause that governed the decision, whether an exception overlay was applied, and the escalation target if needed.\n\nPre-seeded with 10 realistic entries from this morning across all domains — Stay, S2P, Book, HRpay. Each entry is colour-coded by domain: orange for Operations, blue for Business, green for Shared Services.\n\nThis is the evidence trail for SOC 2 Type II, GDPR Article 5, and ISO 42001. It was always there.",
    icon: "🕵️",
    arrowDir: "left",
  },
  {
    id: "gov-files",
    tab: "files",
    type: "spotlight",
    spotlight: { top: 102, left: 0, width: 280, height: "calc(100vh - 102px)" },
    title: "All 8 Governance Files — With Full Regulatory Sources",
    body: "Browse all 8 .md files — 4 baseline SOPs and 4 exception overlays — with syntax highlighting. MUST rules in green, MUST NOT in red, MAY in purple.\n\nScroll below each file to see its full regulatory compliance panel: the actual NIST OSCAL JSON it was derived from, the GDPR article text, and the EU AI Act article text — all read-only source.\n\nThe Pair Navigator at the bottom jumps between a baseline SOP and its exception overlay. These files now reference real Apaleo endpoints from the MarkItDown-ingested tech sheet.",
    icon: "📁",
    arrowDir: "right",
  },
  {
    id: "done",
    tab: "files",
    type: "done",
    title: "That is the VDA-MD Framework",
    body: `Here is the full pipeline you just witnessed:

STEP 1 — INGEST
13 citizenM documents (Word, Excel, PDF + real Apaleo API sheet) processed by Microsoft MarkItDown into 38,000 characters of brand and tech context.

STEP 2 — TRANSLATE (C2MD)
Real NIST SP 800-53 OSCAL controls passed to Claude with that context. Genuine governance .md files generated — brand-flavoured, endpoint-accurate, domain-scoped.

STEP 3 — GOVERN
AI agents evaluated against those files at runtime. Exception overlays applied where conditions are met. Two live API calls. Side-by-side decisions.

STEP 4 — AUDIT
Every decision logged to the Witness Agent before execution. Tamper-evident. Always there. Never assembled retroactively.

STEP 5 — TRACE
Every governance file shows its full regulatory lineage — NIST, GDPR, EU AI Act — with the actual source text. Click any agent to see the rules it runs under.

Now explore freely. The whole app is live.`,
    icon: "✓",
    cta: "Explore the demo →",
  },
];

function TourOverlay({ onClose, onTabSwitch }) {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [visible, setVisible] = useState(true);
  const current = TOUR_STEPS[step];
  const total = TOUR_STEPS.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;

  const goTo = (idx) => {
    const s = TOUR_STEPS[idx];
    if (s.tab) onTabSwitch(s.tab);
    setStep(idx);
    setAnimKey(k => k + 1);
  };

  const next = () => { if (!isLast) goTo(step + 1); else dismiss(); };
  const prev = () => { if (!isFirst) goTo(step - 1); };
  const dismiss = () => { setVisible(false); setTimeout(onClose, 350); };

  useEffect(() => {
    if (current.tab) onTabSwitch(current.tab);
  }, []);

  if (!visible) return null;

  // Spotlight overlay — uses box-shadow trick to cut a hole
  const SpotlightBox = () => {
    if (current.type === "welcome" || current.type === "done") return null;
    const sp = current.spotlight;
    return (
      <div style={{
        position: "fixed",
        top: sp.top,
        left: typeof sp.left === "number" ? sp.left : sp.left,
        width: sp.width,
        height: sp.height,
        borderRadius: 10,
        zIndex: 9998,
        pointerEvents: "none",
        animation: "spotlight-pulse 2.5s ease-in-out infinite",
        boxShadow: `0 0 0 9999px rgba(0,0,0,0.82), 0 0 0 2px #FF6B2B, 0 0 40px 6px rgba(255,107,43,0.35)`,
      }} />
    );
  };

  // Arrow indicator
  const Arrow = ({ dir }) => {
    const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
    return (
      <div style={{
        position: "absolute",
        top: dir === "up" ? -36 : dir === "down" ? "calc(100% + 8px)" : "50%",
        left: dir === "left" ? -36 : dir === "right" ? "calc(100% + 8px)" : "50%",
        transform: (dir === "up" || dir === "down") ? "translateX(-50%)" : "translateY(-50%)",
        fontSize: 22, color: T.orange,
        animation: `welcome-float 1.4s ease-in-out infinite`,
      }}>
        {arrows[dir]}
      </div>
    );
  };

  const cardStyle = (type, offset) => {
    if (type === "welcome" || type === "done") {
      return {
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 680, maxWidth: "94vw", zIndex: 9999,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      };
    }
    // For spotlight steps: anchor to right side of screen, always fully visible
    return {
      position: "fixed", zIndex: 9999,
      width: 440, maxWidth: "44vw",
      top: "50%", right: 28,
      transform: "translateY(-50%)",
      maxHeight: "88vh", display: "flex", flexDirection: "column",
    };
  };

  const progressPct = ((step) / (total - 1)) * 100;

  return (
    <>
      {/* Dark backdrop — always shown to block content behind */}
      <div style={{
        position: "fixed", inset: 0,
        background: current.type === "welcome" || current.type === "done"
          ? "rgba(0,0,0,0.90)"
          : "rgba(0,0,0,0.72)",
        zIndex: 9997,
        backdropFilter: current.type === "welcome" || current.type === "done" ? "blur(4px)" : "blur(2px)",
      }} />

      {/* Spotlight ring — highlights the relevant UI element */}
      <SpotlightBox />

      {/* Tour card */}
      <div
        key={animKey}
        style={{
          ...cardStyle(current.type, current.cardOffset),
          background: "linear-gradient(145deg, #13161c 0%, #0d0f14 100%)",
          border: `2px solid ${current.type === "welcome" || current.type === "done" ? T.orange : T.orange + "90"}`,
          borderRadius: 18,
          boxShadow: `0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,107,43,0.12), 0 0 60px rgba(255,107,43,0.08)`,
          animation: "tour-card-in 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Arrow pointer */}
        {current.arrowDir && <Arrow dir={current.arrowDir} />}

        {/* Scrollable inner content */}
        <div style={{
          overflowY: "auto", flex: 1,
          padding: current.type === "welcome" || current.type === "done" ? "36px 36px 0" : "24px 24px 0",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {current.type === "welcome" || current.type === "done" ? (
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${T.orange}18`, border: `2px solid ${T.orange}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, animation: current.type === "welcome" ? "welcome-float 3s ease-in-out infinite" : "none",
              }}>
                {current.icon}
              </div>
            ) : (
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${T.orange}15`, border: `1px solid ${T.orange}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {current.icon}
              </div>
            )}
            <div>
              {current.subtitle && (
                <div style={{ fontSize: 11, color: T.orange, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                  {current.subtitle}
                </div>
              )}
              <h3 style={{
                fontFamily: T.sans, fontWeight: 900, color: T.text,
                fontSize: current.type === "welcome" || current.type === "done" ? 22 : 17,
                letterSpacing: "-0.03em", lineHeight: 1.2,
              }}>
                {current.title}
              </h3>
            </div>
          </div>
          <button onClick={dismiss} style={{
            background: "none", border: "none", color: T.dim,
            cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4, flexShrink: 0,
            transition: "color 0.2s",
          }} title="Skip tour">✕</button>
        </div>

        {/* Body */}
        <div style={{
          fontSize: 14, color: T.muted, lineHeight: 1.85,
          whiteSpace: "pre-line", marginBottom: 20,
        }}>
          {current.body}
        </div>
        </div>{/* end scrollable inner */}

        {/* Sticky footer — always visible */}
        <div style={{
          padding: current.type === "welcome" || current.type === "done" ? "16px 36px 28px" : "14px 24px 20px",
          background: "linear-gradient(to bottom, transparent, #0d0f14 30%)",
          borderTop: `1px solid ${T.border}`,
          flexShrink: 0,
        }}>
          {/* Progress bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ background: T.border, borderRadius: 999, height: 3, overflow: "hidden" }}>
              <div style={{
                width: `${progressPct}%`, height: "100%",
                background: `linear-gradient(90deg, ${T.orange}, ${T.amber})`,
                borderRadius: 999, transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 11, color: T.dim, fontFamily: T.mono }}>Step {step + 1} of {total}</span>
              <span style={{ fontSize: 11, color: T.dim, fontFamily: T.mono }}>{Math.round(progressPct)}% complete</span>
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
            {TOUR_STEPS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === step ? 22 : 8, height: 8,
                borderRadius: 999, border: "none", cursor: "pointer",
                background: i === step ? T.orange : i < step ? T.orange + "60" : T.border,
                transition: "all 0.3s ease", padding: 0,
              }} />
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={dismiss} style={{
              background: "none", border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "9px 16px",
              color: T.dim, cursor: "pointer", fontSize: 13,
              fontFamily: T.sans, fontWeight: 500,
              transition: "all 0.2s",
            }}>Skip tour</button>

            <div style={{ display: "flex", gap: 10 }}>
              {!isFirst && (
                <button onClick={prev} style={{
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: "9px 20px",
                  color: T.muted, cursor: "pointer", fontSize: 13,
                  fontFamily: T.sans, fontWeight: 600,
                  transition: "all 0.2s",
                }}>← Back</button>
              )}
              <button onClick={next} style={{
                background: T.orange, border: "none",
                borderRadius: 8, padding: "9px 24px",
                color: "#fff", cursor: "pointer", fontSize: 14,
                fontFamily: T.sans, fontWeight: 800,
                boxShadow: `0 0 24px ${T.orange}55`,
                transition: "all 0.2s",
              }}>
                {current.cta || (isLast ? "Let's go →" : "Next →")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// ─────────────────────────────────────────────
// GOVERNANCE FILE CONTENT (all 8 files)
// ─────────────────────────────────────────────
const GOV_FILES = [
  {
    id: "stay-sop",
    name: "hospitality-stay-checkout.md",
    type: "SOP", domain: "Operations / Stay", owner: "Operations Director",
    color: T.orange, scenario: "stay",
    nistControls: ["IR-4"],
    nistNotes: "Governs incident detection and operational response during the Stay phase. IR-4 requires preparation, containment, and recovery procedures — translated here into checkout modification controls and PMS logging requirements.",
    gdprArticles: ["Art-5", "Art-6", "Art-22"],
    gdprNotes: "Guest PMS data must be processed with a lawful basis (Art-6: contractual necessity for stay). Checkout modification decisions by AI agents touch Art-22 — automated decisions affecting guests must preserve human override capability. Art-5 storage limitation applies to PMS logs.",
    euAiActArticles: ["Art-9", "Art-13", "Art-14"],
    euAiActNotes: "The checkout agent is a decision-making AI system. Art-14 requires that the Operations Director override capability is technically implemented, not just documented. Art-13 requires guests can understand the basis for any automated checkout decision. Art-9 risk management covers the failure mode where the agent grants unauthorised late checkout.",
    content: `---
control_id: hospitality-stay-checkout
domain: Operations / Stay
journey_stage: Stay
owner: Operations Director
baseline: true
c2md_confidence: 0.96
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
customer: citizenM Hotels
---

## Guest Checkout Policy — Baseline

Standard checkout at all citizenM properties: 11:00 AM.

### Late Checkout Rules

| Time Window   | Condition                          | Fee |
|---------------|------------------------------------|-----|
| Up to 13:00   | Subject to housekeeping capacity   | 20  |
| 13:00-15:00   | Operations Director authorisation  | 40  |
| After 15:00   | Additional night booking required  | --  |

### Apaleo & Goodbits Endpoints

| Action | Goodbits (citizenM API) | Apaleo (underlying) |
|--------|------------------------|---------------------|
| Check checkout allowed | GET reservations/v2/reservations/{code}/checkin-allowed | /inventory/v1/units (VCI threshold via Contentful) |
| Checkout reservation | PUT reservations/v2/reservations/{code}/actions/checkout | /booking/v1/reservation-actions/{id}/checkout |
| Get amount due | GET reservations/v2/reservations/{code}/amount-due | /finance/v1/invoices/preview |

### Agent Rules

- MUST verify departure date in Apaleo via Goodbits before calling checkout endpoint
- MUST check VCI room threshold (Contentful-configured) via checkin-allowed endpoint
- MUST NOT call the Goodbits checkout endpoint without a confirmed departure date
- MUST NOT waive the late checkout fee without Operations Lead authorisation
- MUST log all checkout modification requests — Witness Agent entry written before Goodbits call
- Auth level: trusted environment required for checkout operations

### Violation Definition

Goodbits checkout endpoint called without availability confirmation or fee collection
= Apaleo write without governance approval → revenue control violation.`
  },
  {
    id: "stay-exc",
    name: "hospitality-stay-VIP-checkout-exception.md",
    type: "EXCEPTION", domain: "Operations / Stay", owner: "COO",
    color: T.purple, scenario: "stay",
    nistControls: ["IR-4"],
    nistNotes: "Exception overlay to the Stay baseline. Modifies the IR-4-derived operational response rules for Black-tier guests. The exception is bounded and time-limited — it does not relax the underlying IR-4 incident logging requirement.",
    gdprArticles: ["Art-5", "Art-6", "Art-22"],
    gdprNotes: "Same lawful basis as baseline (contractual/legitimate interest for Black tier service). CRM Black status lookup is a personal data access — must be limited to what is necessary (Art-5 data minimisation). Art-22 obligations unchanged: the agent decision to waive fees is automated and must be contestable.",
    euAiActArticles: ["Art-9", "Art-13", "Art-14"],
    euAiActNotes: "The exception overlay modifies agent behaviour — Art-17 quality management requires exceptions to be documented and versioned. Art-14 human oversight is not relaxed: a guest can still invoke human review. Art-9 risk management must account for the exception's expanded authority scope.",
    content: `---
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

Active citizenM Black members receive automatic late checkout to 14:00 at EMEA properties. No fee. No availability check required.

### Exception Conditions

- Active (not suspended/expired) Black status in CRM
- Checkout MUST NOT exceed 14:00 under any circumstance
- EMEA properties only -- not Americas or APAC
- Limited to the member's own booked room only

### Agent Rules (Override)

- MAY grant checkout to 14:00 without fee
- MAY skip availability check for verified Black members
- MUST verify active Black status in CRM before applying
- MUST NOT extend this exception beyond 14:00
- MUST log exception application in the Witness trail

### What Reverts to Baseline

- Any request beyond 14:00 -> standard fee + approval
- Expired or suspended membership -> baseline applies immediately`
  },
  {
    id: "s2p-sop",
    name: "S2P-approval-authority.md",
    type: "SOP", domain: "Shared Services / S2P", owner: "CFO",
    color: T.green, scenario: "s2p",
    nistControls: ["SA-4"],
    nistNotes: "Directly derived from SA-4 Acquisition Process. The NIST requirement for security and acceptance criteria in procurement contracts is translated into citizenM's tiered approval authority matrix and three-quote compliance rules.",
    gdprArticles: ["Art-5", "Art-25", "Art-32"],
    gdprNotes: "Procurement data (supplier PII, invoice amounts, approver identities) is personal data. Art-25 data protection by design requires the PO agent to access only supplier data necessary for the specific approval decision. Art-32 security of processing applies to financial transaction data. Art-5 storage limitation governs procurement record retention.",
    euAiActArticles: ["Art-9", "Art-12", "Art-13", "Art-14", "Art-17"],
    euAiActNotes: "The procurement approval agent makes consequential financial decisions — high-risk classification applies. Art-12 logging is fulfilled by the Witness Agent audit trail. Art-14 mandates that CFO override authority is technically enforced, not merely a policy statement. Art-13 transparency requires approvers to understand the basis for agent recommendations. Art-17 quality management requires the approval matrix to be versioned and reviewed.",
    content: `---
control_id: S2P-approval-authority
domain: Shared Services / Finance (S2P)
journey_stage: Source-to-Pay
owner: CFO
authored_by: Head of Procurement
baseline: true
c2md_confidence: 0.91
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
customer: citizenM Hotels
---

## Procurement Approval Authority — Baseline

All citizenM procurement follows the tiered approval matrix below. Thresholds apply per purchase order.

### Approval Thresholds

| Amount        | Authority Required        |
|---------------|---------------------------|
| Up to 10k     | Department Head           |
| 10k - 50k     | Operations Director       |
| 50k - 250k    | CFO sign-off required     |
| Above 250k    | CFO + Board notification  |

Three competitive quotes required for all purchases above 10,000 unless supplier holds current Preferred Supplier List status.

### Agent Rules

- MUST NOT raise SAP PO above requestor's delegated authority level
- MUST NOT commit Apaleo folio charges (POST /finance/v1/folios/{id}/payments) without valid SAP budget code
- MUST verify three-quote compliance above 10k (unless Preferred Tech EMEA exception applies)
- MUST flag any supplier not on SAP Approved Vendor list
- MUST log decision to Witness Agent with SAP PO reference before committing

### Violation Definition

SAP PO or Apaleo folio charge committed without appropriate authority = procurement control violation -> CFO notification.`
  },
  {
    id: "s2p-exc",
    name: "S2P-preferred-tech-supplier-exception.md",
    type: "EXCEPTION", domain: "Shared Services / S2P", owner: "CFO",
    color: T.green, scenario: "s2p",
    nistControls: ["SA-4"],
    nistNotes: "Exception to the SA-4-derived procurement baseline. NIST SA-4 permits risk-based tailoring of acquisition controls where supplier assurance is pre-established. The Preferred Tech List is the citizenM implementation of that pre-establishment mechanism.",
    gdprArticles: ["Art-5", "Art-25"],
    gdprNotes: "Exception expands agent authority for Preferred Tech suppliers. Art-25 data protection by default requires the exception to be as narrow as possible — EMEA-only and the value cap are both data minimisation controls. Preferred Tech status verification involves supplier registration data which must comply with Art-5 purpose limitation.",
    euAiActArticles: ["Art-9", "Art-12", "Art-14", "Art-17"],
    euAiActNotes: "Exception modifies a high-risk AI decision boundary. Art-17 requires exception overlays to be part of the quality management system — formally approved, versioned, and subject to periodic review. Art-9 risk management must be updated when the exception is applied. Art-14: the Operations Director's expanded authority must be technically enforced.",
    content: `---
control_id: S2P-preferred-tech-supplier-exception
exception_to: S2P-approval-authority
applies_to: citizenM Preferred Tech Supplier List -- EMEA
conditions:
  - Current Preferred Tech status (annual review)
  - EMEA invoices only
  - Invoice value must not exceed 75,000
approved_by: CFO
consulted: [Legal, CISO]
approved_date: 2026-01-10
expires: 2026-12-31
risk_level: medium
customer: citizenM Hotels
---

## Preferred Tech Supplier Exception — EMEA

Suppliers on citizenM's Preferred Tech Supplier List (EMEA) may be approved at Operations Director level up to 75,000. No three-quote requirement applies.

### Exception Conditions

- Supplier must appear on current Preferred Tech List (annual renewal)
- Invoice must relate to EMEA operations
- Invoice value must not exceed 75,000

### Agent Rules (Override)

- MAY approve up to 75k at Operations Director level for current Preferred Tech suppliers
- MAY waive three-quote requirement for these suppliers
- MUST verify current Preferred Tech status first
- CFO approval still required for invoices above 75,000

### What Reverts to Baseline

- Invoices above 75,000 -> standard CFO approval
- Non-EMEA invoices -> standard thresholds apply
- Expired preferred status -> full baseline applies`
  },
  {
    id: "book-sop",
    name: "hospitality-book-rate-override.md",
    type: "SOP", domain: "Business / Book", owner: "VP Revenue",
    color: T.blue, scenario: "book",
    nistControls: ["AC-2", "AU-2"],
    nistNotes: "Derived from AC-2 (approval authority and access tiers) and AU-2 (all rate override decisions must be logged as auditable events). The discount authority matrix maps directly to AC-2's role-based authorisation structure.",
    gdprArticles: ["Art-5", "Art-6", "Art-13", "Art-22"],
    gdprNotes: "Rate override decisions involve guest booking data (corporate account, stay details, negotiated rates). Art-6 lawful basis: contractual necessity for the booking relationship. Art-22 applies directly — an AI agent determining a guest rate is an automated decision with significant financial effect; Revenue Manager override must be technically possible. Art-13 transparency: guests should be able to understand how their rate was determined.",
    euAiActArticles: ["Art-9", "Art-12", "Art-13", "Art-14"],
    euAiActNotes: "The rate override agent operates on commercial decisions with material financial consequences — high-risk classification applies. Art-14 human oversight requires VP Revenue authority to be technically enforced as a hard ceiling. Art-12 logging: every rate decision must be recorded with the governing clause and authority level used. Art-13 transparency: Revenue Managers must be able to interpret the agent output.",
    content: `---
control_id: hospitality-book-rate-override
domain: Business / Book
journey_stage: Book
owner: VP Revenue
baseline: true
c2md_confidence: 0.93
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
customer: citizenM Hotels
---

## Rate Override Authority — Baseline

All citizenM room rate discounts require authorisation at the following thresholds.

### Discount Authority Matrix

| Discount Level | Authority Required      |
|----------------|-------------------------|
| Up to 10%      | Revenue Manager         |
| 10% - 20%      | VP Revenue sign-off     |
| 20% - 30%      | Chief Revenue Officer   |
| Above 30%      | CRO + CEO notification  |

Discounts apply to room rate only. F&B and ancillary pricing are outside the scope of this policy.

### Agent Rules

- MUST NOT call Goodbits amend endpoint (PUT reservations/v2/reservations/{code}/actions/amend) with discount above requestor's authority
- MUST call GET reservations/v2/reservations/{code}/offers first to obtain valid amendment offer
- MUST verify rate parity obligations before constructing Apaleo amend request
- MUST log business justification for any discount above 10% in Witness Agent entry

### Violation Definition

Goodbits amend endpoint called with unapproved discount = Apaleo write without authority -> VP Revenue notification.`
  },
  {
    id: "book-exc",
    name: "hospitality-book-key-account-exception.md",
    type: "EXCEPTION", domain: "Business / Book", owner: "VP Revenue",
    color: T.blue, scenario: "book",
    nistControls: ["AC-2", "AU-2"],
    nistNotes: "Exception overlay modifying the AC-2-derived approval authority tier for Tier 1 Key Accounts. AU-2 audit logging is not relaxed — all decisions under this exception are logged to the Witness Agent with the exception flag set.",
    gdprArticles: ["Art-5", "Art-6", "Art-22"],
    gdprNotes: "Tier 1 Key Account status lookup involves processing corporate account data in Salesforce. Art-5 data minimisation: the agent should access only the account tier field, not the full CRM record. Art-22: the automated 18% approval is a decision with financial significance — the booking party retains the right to request human review. Art-6 lawful basis: legitimate interest for preferential commercial terms.",
    euAiActArticles: ["Art-9", "Art-12", "Art-14", "Art-17"],
    euAiActNotes: "Exception modifies the rate override agent decision boundary for a defined subset of accounts. Art-17 quality management requires the Key Account exception to be reviewed annually. Art-9 risk management: the exception creates a new risk surface (Salesforce status manipulation) that must be assessed. Art-14: Revenue Manager can still override any decision made under this exception.",
    content: `---
control_id: hospitality-book-key-account-exception
exception_to: hospitality-book-rate-override
applies_to: citizenM Key Account Programme -- Tier 1 corporates
conditions:
  - Active Key Account Tier 1 status in Salesforce CRM
  - Room bookings only (not F&B or events)
  - Maximum discount 18%
approved_by: VP Revenue
consulted: [CFO]
approved_date: 2026-02-01
expires: 2026-12-31
risk_level: low
customer: citizenM Hotels
---

## Key Account Rate Exception — Tier 1 Corporates

Accounts with citizenM Key Account Tier 1 status are pre-approved for up to 18% room rate discount at Revenue Manager authority. No VP Revenue sign-off needed.

### Exception Conditions

- Active Tier 1 status verified in Salesforce CRM
- Room bookings only -- F&B explicitly excluded
- Maximum discount: 18%
- Rate parity obligations must still be verified

### Apaleo Flow for Key Account Exception

1. Verify Key Account Tier 1 status in Salesforce CRM
2. GET reservations/v2/reservations/{code}/offers → confirm amendment is for room rate only
3. PUT reservations/v2/reservations/{code}/actions/amend → Apaleo /booking/v1/reservation-actions/{id}/amend
4. Witness Agent logs: exception_applied: true, Salesforce Tier 1 ref, Goodbits endpoint, Apaleo mapping

### Agent Rules (Override)

- MAY call Goodbits amend endpoint with up to 18% discount at Revenue Manager authority for Tier 1 accounts
- MUST verify Tier 1 status in Salesforce CRM before constructing the amend request
- MUST obtain offers via GET reservations/v2/reservations/{code}/offers before calling amend
- MUST still verify rate parity compliance before the Apaleo write
- Any request above 18% requires VP Revenue approval — exception ceiling is hard in Goodbits

### What Reverts to Baseline

- Discount requests above 18% -> VP Revenue required
- Non-room rate overrides -> baseline applies
- Accounts not on Tier 1 list -> baseline applies`
  },
  {
    id: "hr-sop",
    name: "HRpay-onboarding-system-access.md",
    type: "SOP", domain: "Shared Services / HRpay", owner: "Chief People Officer",
    color: T.green, scenario: "hrpay",
    nistControls: ["AC-2"],
    nistNotes: "Primary implementation of AC-2 Account Management for the HRpay domain. Every clause maps directly to an AC-2 sub-requirement: manager approval (AC-2d), provisioning on confirmed start (AC-2e), deactivation on termination (AC-2j), and Workday as system of record (AC-2b).",
    gdprArticles: ["Art-5", "Art-6", "Art-22", "Art-25", "Art-32"],
    gdprNotes: "Employee onboarding involves sensitive HR data (start date, role, cost centre, access levels). Art-6 lawful basis: contractual necessity (employment contract). Art-25 data protection by design: agent must only provision access to systems necessary for the specific role. Art-22: automated provisioning affecting employment conditions must include human oversight. Art-32: access credentials require appropriate security measures. Art-5 storage limitation: access logs must not be retained beyond employment period plus statutory minimum.",
    euAiActArticles: ["Art-9", "Art-12", "Art-13", "Art-14", "Art-17"],
    euAiActNotes: "HR access provisioning agents operating on employment decisions are high-risk AI systems under Annex III. Art-14 human oversight is critical — CISO must be able to intervene and revoke any access decision. Art-12 logging: every provisioning action must be recorded in the Witness Agent with the Workday request ID. Art-13 transparency: CPO and line managers must understand the criteria the agent uses. Art-17 quality management: the provisioning workflow must be tested and validated. Art-9 risk management must specifically address the risk of over-provisioning access.",
    content: `---
control_id: HRpay-onboarding-system-access
domain: HR / Onboarding-to-Final-Pay
journey_stage: HRpay -- Onboarding
owner: Chief People Officer
authored_by: Head of HR
baseline: true
c2md_confidence: 0.94
reviewed_by: Sarah Chen, CCO
approved_date: 2026-03-18
customer: citizenM Hotels
---

## Staff System Access Provisioning — Baseline

All citizenM employee accounts require a formal manager request in Workday before any access is granted.

### Timing Rules

- Provisioning may NOT begin before the employee's confirmed start date under any circumstances
- Provisioning must be completed within 48 hours of the confirmed start date
- Early provisioning (before start date) is NOT permitted under this baseline policy

### Agent Rules

- MUST NOT create Auth0 identity or Apaleo user access without a logged Workday manager request
- MUST provision Auth0 identity before Apaleo access (Auth0 is the identity layer)
- MUST verify start date and SAP cost centre in Workday before any provisioning API call
- MUST confirm Apaleo access is property-scoped (not global tenant) and matches role in Workday
- MUST send confirmation to Operations Lead + citizenmaker within 24 hours

### Violation Definition

Auth0 identity or Apaleo user access created without Workday manager request or before start date = access control violation -> immediate CISO notification required.`
  },
  {
    id: "hr-exc",
    name: "HRpay-tech-role-fasttrack-exception.md",
    type: "EXCEPTION", domain: "Shared Services / HRpay", owner: "CISO",
    color: T.green, scenario: "hrpay",
    nistControls: ["AC-2"],
    nistNotes: "AC-2 permits risk-based exceptions to account provisioning timelines where formally authorised. CISO sign-off per request is the citizenM implementation of that formal authorisation requirement. The exception does not waive any AC-2 sub-requirements — it modifies only the timing constraint.",
    gdprArticles: ["Art-5", "Art-6", "Art-25"],
    gdprNotes: "Fast-track exception involves processing employment data before the contract start date — Art-6 lawful basis must cover pre-employment data processing (legitimate interest plus contractual necessity for tech role preparation). Art-25 data protection by design: even under fast-track, access should be provisioned in stages — development tools only, not production systems, until start date. Art-5 storage limitation: pre-start access logs must be retained for the same period as standard employment records.",
    euAiActArticles: ["Art-9", "Art-12", "Art-14", "Art-17"],
    euAiActNotes: "Exception expands the provisioning agent authority to a risk-elevated window (pre-employment). Art-9 risk management must specifically assess the expanded attack surface of pre-start access. Art-14: CISO sign-off per request is the human oversight mechanism — it must be technically enforced as a hard gate, not an advisory step. Art-12: the Witness Agent must log the CISO sign-off reference alongside the provisioning action. Art-17: the exception must be included in the annual QMS review and risk reassessment.",
    content: `---
control_id: HRpay-tech-role-fasttrack-exception
exception_to: HRpay-onboarding-system-access
applies_to: Digital and Technology roles -- all citizenM properties
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

Digital and Technology roles may have access provisioned up to 5 working days before the start date. Individual CISO sign-off required per request.

### Exception Conditions

- Role must be formally classified as Digital/Tech in Workday (not self-declared)
- Head of Tech must submit the fast-track request
- CISO must provide sign-off for each individual request
- Maximum pre-provisioning window: 5 working days

### Agent Rules (Override)

- MAY provision access up to 5 days before start date for eligible tech roles WITH CISO sign-off documented
- MUST verify Tech role classification in Workday first
- MUST confirm documented CISO sign-off exists
- MUST flag and NOT provision if CISO sign-off missing

### What Reverts to Baseline

- Non-Digital/Tech roles -> baseline applies strictly
- Fast-track requests without CISO sign-off -> FAIL
- Pre-provisioning beyond 5 working days -> FAIL`
  },
];

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// COMPLIANCE SOURCES PANEL (NIST + GDPR + EU AI Act — read-only)
// ─────────────────────────────────────────────
const FRAMEWORK_META = {
  nist:  { label: "NIST SP 800-53 Rev 5", color: "#4A9EFF", bg: "#03040d", border: "#4A9EFF40", tag: "OSCAL" },
  gdpr:  { label: "GDPR",                  color: "#22D47A", bg: "#030d06", border: "#22D47A40", tag: "EU Regulation" },
  euai:  { label: "EU AI Act",              color: "#A066FF", bg: "#07030d", border: "#A066FF40", tag: "AI Regulation" },
};

function ComplianceFrameworkBlock({ fwKey, items, notes, dataMap }) {
  const [expanded, setExpanded] = useState({});
  const meta = FRAMEWORK_META[fwKey];
  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ border: `1px solid ${meta.border}`, borderRadius: 10, overflow: "hidden", background: meta.bg }}>
      {/* Framework header */}
      <div style={{
        background: `${meta.color}0c`, borderBottom: `1px solid ${meta.border}`,
        padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            background: `${meta.color}18`, border: `1px solid ${meta.color}50`,
            borderRadius: 5, padding: "3px 9px",
            fontSize: 11, fontFamily: T.mono, fontWeight: 800, color: meta.color,
          }}>{meta.tag}</div>
          <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 14, color: meta.color }}>{meta.label}</span>
          <span style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, background: T.card, border: `1px solid ${T.border}`, borderRadius: 3, padding: "2px 7px" }}>
            READ ONLY
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {items.map(id => (
            <span key={id} style={{
              background: `${meta.color}18`, border: `1px solid ${meta.color}50`,
              borderRadius: 4, padding: "3px 9px",
              fontSize: 11, fontFamily: T.mono, fontWeight: 800, color: meta.color,
            }}>{id}</span>
          ))}
        </div>
      </div>

      {/* Rationale note */}
      {notes && (
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}`, background: `${meta.color}04` }}>
          <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Compliance Rationale
          </div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.75 }}>{notes}</div>
        </div>
      )}

      {/* Article/control blocks */}
      {items.map(id => {
        const item = dataMap[id];
        if (!item) return null;
        const isOpen = expanded[id] !== false;
        return (
          <div key={id} style={{ borderTop: `1px solid ${T.border}` }}>
            <button onClick={() => toggle(id)} style={{
              width: "100%", textAlign: "left", background: "none", border: "none",
              padding: "11px 18px", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{
                  background: `${meta.color}18`, border: `1px solid ${meta.color}50`,
                  borderRadius: 4, padding: "3px 9px", fontSize: 11, fontFamily: T.mono,
                  fontWeight: 800, color: meta.color, flexShrink: 0,
                }}>{id}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{item.chapter || item.family}</div>
                </div>
              </div>
              <span style={{ color: T.dim, fontSize: 14, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>

            {isOpen && (
              <div style={{ borderTop: `1px solid ${T.border}` }}>
                {item.summary && (
                  <div style={{ padding: "10px 18px 8px", background: `${meta.color}03` }}>
                    <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.65, fontStyle: "italic" }}>{item.summary}</div>
                  </div>
                )}
                <div style={{ background: "#02030a" }}>
                  <div style={{
                    padding: "7px 18px", borderTop: `1px solid ${T.border}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#050609",
                  }}>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                        <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                      ))}
                      <span style={{ fontSize: 11, color: T.dim, fontFamily: T.mono, marginLeft: 4 }}>
                        {fwKey === "nist" ? `oscal-catalog-rev5/${id.toLowerCase()}.json` :
                         fwKey === "gdpr"  ? `gdpr-${id.toLowerCase().replace("-","_")}.txt` :
                                             `eu-ai-act-${id.toLowerCase().replace("-","_")}.txt`}
                      </span>
                    </div>
                    <span style={{ fontSize: 9, color: T.dim, fontFamily: T.mono, background: T.card, border: `1px solid ${T.border}`, borderRadius: 3, padding: "2px 7px" }}>
                      READ ONLY · {meta.tag.toUpperCase()} SOURCE
                    </span>
                  </div>
                  <pre style={{
                    color: fwKey === "nist" ? "#7dd3fc" : fwKey === "gdpr" ? "#86efac" : "#c4b5fd",
                    fontSize: 12, lineHeight: 1.85, fontFamily: T.mono,
                    whiteSpace: "pre-wrap", margin: 0, padding: "14px 18px 18px",
                    maxHeight: 300, overflowY: "auto",
                    userSelect: "text",
                  }}>
                    {item.prose || item.oscal}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ComplianceSourcesPanel({ file }) {
  const hasNist = file.nistControls?.length > 0;
  const hasGdpr = file.gdprArticles?.length > 0;
  const hasEuAi = file.euAiActArticles?.length > 0;
  if (!hasNist && !hasGdpr && !hasEuAi) return null;

  return (
    <div style={{ margin: "0 28px 40px" }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
        paddingBottom: 12, borderBottom: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 18 }}>📐</span>
        <div>
          <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 15, color: T.text }}>
            Regulatory Compliance Sources
          </div>
          <div style={{ fontSize: 11, color: T.dim, fontFamily: T.mono, marginTop: 2 }}>
            Read-only · Original regulatory source text · This governance file is derived from the controls and articles below
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {hasNist && <span style={{ background: `${T.blue}18`, border: `1px solid ${T.blue}40`, borderRadius: 4, padding: "3px 9px", fontSize: 10, fontFamily: T.mono, fontWeight: 700, color: T.blue }}>NIST</span>}
          {hasGdpr && <span style={{ background: `${T.green}18`, border: `1px solid ${T.green}40`, borderRadius: 4, padding: "3px 9px", fontSize: 10, fontFamily: T.mono, fontWeight: 700, color: T.green }}>GDPR</span>}
          {hasEuAi && <span style={{ background: `${T.purple}18`, border: `1px solid ${T.purple}40`, borderRadius: 4, padding: "3px 9px", fontSize: 10, fontFamily: T.mono, fontWeight: 700, color: T.purple }}>EU AI ACT</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {hasNist && (
          <ComplianceFrameworkBlock
            fwKey="nist" items={file.nistControls} notes={file.nistNotes} dataMap={NIST}
          />
        )}
        {hasGdpr && (
          <ComplianceFrameworkBlock
            fwKey="gdpr" items={file.gdprArticles} notes={file.gdprNotes} dataMap={GDPR}
          />
        )}
        {hasEuAi && (
          <ComplianceFrameworkBlock
            fwKey="euai" items={file.euAiActArticles} notes={file.euAiActNotes} dataMap={EU_AI_ACT}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: GOVERNANCE FILE REPOSITORY
// ─────────────────────────────────────────────
function GovernanceFilesTab() {
  const [selId, setSelId] = useState("stay-sop");
  const [filterType, setFilterType] = useState("ALL");
  const sel = GOV_FILES.find(f => f.id === selId) || GOV_FILES[0];

  const groups = [
    { label: "Stay — Operations", scenario: "stay", icon: "🏨", color: T.orange },
    { label: "Source-to-Pay — Shared Services", scenario: "s2p", icon: "📋", color: T.blue },
    { label: "Book — Business", scenario: "book", icon: "🛎️", color: T.teal },
    { label: "HRpay — Shared Services", scenario: "hrpay", icon: "👤", color: T.green },
  ];

  const renderContent = (content) => content.split("\n").map((line, i) => {
    let color = T.muted;
    let weight = 400;
    if (line.startsWith("---")) { color = T.dim; }
    else if (line.startsWith("## ")) { color = T.text; weight = 800; }
    else if (line.startsWith("### ")) { color = T.text; weight = 700; }
    else if (/^- MUST NOT/.test(line)) { color = T.red; weight = 600; }
    else if (/^- MUST/.test(line)) { color = T.green; weight = 600; }
    else if (/^- MAY/.test(line)) { color = T.purple; weight = 600; }
    else if (/^- SHOULD/.test(line)) { color = T.amber; weight = 600; }
    else if (/^[a-z_]+:/.test(line)) { color = T.blue; }
    else if (line.startsWith("|")) { color = "#9AA3B5"; }
    return <div key={i} style={{ color, fontWeight: weight, minHeight: "1.4em" }}>{line || " "}</div>;
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 102px)" }}>
      {/* Sidebar */}
      <div style={{ background: "#08090c", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 14, color: T.text, marginBottom: 10 }}>
            📁 Governance Repository
          </div>
          <div style={{ fontSize: 11, color: T.dim, marginBottom: 10 }}>8 files · 4 SOPs · 4 Exceptions</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL","SOP","EXCEPTION"].map(f => (
              <button key={f} onClick={() => setFilterType(f)} style={{
                padding: "4px 10px", borderRadius: 5, border: "none", cursor: "pointer",
                background: filterType === f ? T.orange : T.card,
                color: filterType === f ? "#fff" : T.dim,
                fontSize: 10, fontFamily: T.mono, fontWeight: 700,
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {groups.map(g => {
            const files = GOV_FILES.filter(f => f.scenario === g.scenario && (filterType === "ALL" || f.type === filterType));
            if (!files.length) return null;
            return (
              <div key={g.scenario} style={{ marginBottom: 6 }}>
                <div style={{ padding: "8px 16px 4px", fontSize: 10, color: g.color, fontFamily: T.mono, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", gap: 6, alignItems: "center" }}>
                  <span>{g.icon}</span> {g.label}
                </div>
                {files.map(f => (
                  <button key={f.id} onClick={() => setSelId(f.id)} style={{
                    width: "100%", textAlign: "left", background: selId === f.id ? `${f.color}12` : "none",
                    border: "none", borderLeft: `3px solid ${selId === f.id ? f.color : "transparent"}`,
                    padding: "8px 14px 8px 20px", cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, marginTop: 1 }}>{f.type === "SOP" ? "📄" : "⚡"}</span>
                      <div>
                        <div style={{ fontSize: 11, fontFamily: T.mono, color: selId === f.id ? f.color : T.muted, lineHeight: 1.4, wordBreak: "break-all" }}>
                          {f.name}
                        </div>
                        <span style={{
                          display: "inline-block", marginTop: 3, fontSize: 9,
                          background: f.type === "SOP" ? `${T.blue}20` : `${T.purple}20`,
                          color: f.type === "SOP" ? T.blue : T.purple,
                          border: `1px solid ${f.type === "SOP" ? T.blue : T.purple}40`,
                          borderRadius: 3, padding: "1px 5px", fontFamily: T.mono, fontWeight: 700,
                        }}>{f.type}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, lineHeight: 1.9 }}>
            {GOV_FILES.filter(f=>f.type==="SOP").length} baseline SOPs · {GOV_FILES.filter(f=>f.type==="EXCEPTION").length} exceptions<br/>
            <span style={{ color: T.green }}>✓ All files active · v1.0</span>
          </div>
        </div>
      </div>

      {/* File viewer */}
      <div style={{ display: "flex", flexDirection: "column", background: T.bg }}>
        {/* Toolbar */}
        <div style={{ background: "#0a0b0f", borderBottom: `1px solid ${T.border}`, padding: "10px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>{sel.type === "SOP" ? "📄" : "⚡"}</span>
            <code style={{ fontFamily: T.mono, fontSize: 13, color: sel.color, fontWeight: 700 }}>{sel.name}</code>
            <span style={{ background: sel.type === "SOP" ? `${T.blue}20` : `${T.purple}20`, color: sel.type === "SOP" ? T.blue : T.purple, border: `1px solid ${sel.type === "SOP" ? T.blue : T.purple}40`, borderRadius: 4, padding: "3px 9px", fontSize: 11, fontFamily: T.mono, fontWeight: 700 }}>{sel.type}</span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12, color: T.dim }}>
            <span>Owner: <strong style={{ color: T.text }}>{sel.owner}</strong></span>
            <span>Domain: <strong style={{ color: sel.color }}>{sel.domain}</strong></span>
          </div>
        </div>

        {/* Syntax legend */}
        <div style={{ background: "#050608", borderBottom: `1px solid ${T.border}`, padding: "6px 22px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: T.dim, fontFamily: T.mono }}>LEGEND:</span>
          {[["MUST", T.green],["MUST NOT", T.red],["MAY", T.purple],["SHOULD", T.amber],["Frontmatter", T.blue],["Heading", T.text]].map(([l,c]) => (
            <span key={l} style={{ fontSize: 10, color: c, fontFamily: T.mono, display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />{l}
            </span>
          ))}
        </div>

        {/* Content + NIST panel */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* File content */}
          <div style={{ padding: "22px 28px 32px" }}>
            <pre style={{ fontFamily: T.mono, fontSize: 13, lineHeight: 2, margin: 0, whiteSpace: "pre-wrap" }}>
              {renderContent(sel.content)}
            </pre>
          </div>

          {/* NIST/OSCAL compliance sources — read only */}
          {sel.nistControls && sel.nistControls.length > 0 && (
            <ComplianceSourcesPanel file={sel} />
          )}
        </div>

        {/* Pair navigator */}
        {(() => {
          const paired = GOV_FILES.find(f => f.scenario === sel.scenario && f.id !== sel.id);
          if (!paired) return null;
          return (
            <div style={{ background: "#09090e", borderTop: `1px solid ${T.border}`, padding: "12px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: T.dim }}>
                {sel.type === "SOP" ? "↗ Exception overlay for this file:" : "↙ Baseline this overrides:"}
              </span>
              <button onClick={() => setSelId(paired.id)} style={{
                background: `${paired.color}12`, border: `1px solid ${paired.color}50`,
                borderRadius: 7, padding: "8px 18px", cursor: "pointer",
                color: paired.color, fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                transition: "all 0.2s", display: "flex", gap: 8, alignItems: "center",
              }}>
                {paired.type === "SOP" ? "📄" : "⚡"} {paired.name} →
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("journey");
  const SEED_LOG = [
    {
      id: "seed-1",
      timestamp: "2026-03-20 07:14:38 UTC",
      agent: "Stay Agent — Amsterdam City",
      decision: "PASS",
      fileReferenced: "hospitality-stay-VIP-checkout-exception.md",
      clauseApplied: "MAY grant checkout to 14:00 without fee for verified Black members",
      actionProposed: "Guest Karin Brouwer (citizenM Black, active) requested 13:30 checkout at Amsterdam City",
      escalationTarget: null,
      exceptionApplied: true,
    },
    {
      id: "seed-2",
      timestamp: "2026-03-20 07:52:11 UTC",
      agent: "S2P Agent — Finance",
      decision: "FAIL",
      fileReferenced: "S2P-approval-authority.md",
      clauseApplied: "MUST NOT process PO above requestor's authority level",
      actionProposed: "PO for €62,400 submitted by Department Head — exceeds €10k–€50k Operations Director threshold",
      escalationTarget: "Operations Director",
      exceptionApplied: false,
    },
    {
      id: "seed-3",
      timestamp: "2026-03-20 08:03:44 UTC",
      agent: "S2P Agent — Finance",
      decision: "PASS",
      fileReferenced: "S2P-preferred-tech-supplier-exception.md",
      clauseApplied: "MAY approve up to €75k at Operations Director level for current Preferred Tech suppliers",
      actionProposed: "PO for €62,400 resubmitted by Operations Director — supplier Mews Systems on EMEA Preferred Tech List",
      escalationTarget: null,
      exceptionApplied: true,
    },
    {
      id: "seed-4",
      timestamp: "2026-03-20 08:31:09 UTC",
      agent: "HRpay Agent — People Ops",
      decision: "ESCALATE",
      fileReferenced: "HRpay-tech-role-fasttrack-exception.md",
      clauseApplied: "MUST flag and NOT provision if CISO sign-off missing",
      actionProposed: "Fast-track access requested for incoming Senior Cloud Engineer (start date 2026-03-25) — no CISO sign-off on file",
      escalationTarget: "CISO",
      exceptionApplied: false,
    },
    {
      id: "seed-5",
      timestamp: "2026-03-20 08:47:22 UTC",
      agent: "Book Agent — Revenue",
      decision: "PASS",
      fileReferenced: "hospitality-book-rate-override.md",
      clauseApplied: "Discount up to 10% — Revenue Manager authority",
      actionProposed: "8% rate reduction requested for Booking.com corporate account Q2 block — within Revenue Manager authority",
      escalationTarget: null,
      exceptionApplied: false,
    },
    {
      id: "seed-6",
      timestamp: "2026-03-20 09:12:55 UTC",
      agent: "Book Agent — Revenue",
      decision: "PASS",
      fileReferenced: "hospitality-book-key-account-exception.md",
      clauseApplied: "MAY approve up to 18% for Tier 1 accounts at Revenue Manager authority",
      actionProposed: "15% rate override requested for McKinsey & Company (Key Account Tier 1, Salesforce verified) — room only, parity clear",
      escalationTarget: null,
      exceptionApplied: true,
    },
    {
      id: "seed-7",
      timestamp: "2026-03-20 09:44:17 UTC",
      agent: "HRpay Agent — People Ops",
      decision: "PASS",
      fileReferenced: "HRpay-tech-role-fasttrack-exception.md",
      clauseApplied: "MAY provision access up to 5 days before start date for eligible tech roles WITH CISO sign-off documented",
      actionProposed: "Fast-track access provisioned for Senior Cloud Engineer — CISO sign-off ref CISO-2026-0312 confirmed",
      escalationTarget: null,
      exceptionApplied: true,
    },
    {
      id: "seed-8",
      timestamp: "2026-03-20 10:08:03 UTC",
      agent: "Stay Agent — Glasgow",
      decision: "FAIL",
      fileReferenced: "hospitality-stay-checkout.md",
      clauseApplied: "MUST NOT waive the late checkout fee without Operations Director authorisation",
      actionProposed: "Guest requested 14:30 checkout — Standard membership, Glasgow property, no authorisation on file",
      escalationTarget: "Operations Director",
      exceptionApplied: false,
    },
    {
      id: "seed-9",
      timestamp: "2026-03-20 10:33:41 UTC",
      agent: "S2P Agent — Finance",
      decision: "ESCALATE",
      fileReferenced: "S2P-approval-authority.md",
      clauseApplied: "MUST NOT process PO above requestor's authority level — CFO sign-off required for €50k–€250k",
      actionProposed: "PO for €187,500 submitted for AV system upgrade across 3 EMEA properties — requires CFO sign-off",
      escalationTarget: "CFO",
      exceptionApplied: false,
    },
    {
      id: "seed-10",
      timestamp: "2026-03-20 11:01:28 UTC",
      agent: "HRpay Agent — People Ops",
      decision: "PASS",
      fileReferenced: "HRpay-onboarding-system-access.md",
      clauseApplied: "MUST NOT activate any account without a logged manager request in Workday",
      actionProposed: "Standard access provisioning for new Front Desk Associate Amsterdam — Workday request WD-2026-04821 confirmed, start date today",
      escalationTarget: null,
      exceptionApplied: false,
    },
  ];

  const [log, setLog] = useState(SEED_LOG);
  const [tourActive, setTourActive] = useState(true);

  const addLog = useCallback(entry => {
    setLog(p => [...p, entry]);
  }, []);

  const tabs = [
    { id: "journey",   label: "Journey Map",      icon: "🗺" },
    { id: "c2md",      label: "C2MD Studio",       icon: "🔬" },
    { id: "exception", label: "Exception Engine",  icon: "⚡" },
    { id: "witness",   label: `Witness Agent${log.length ? ` (${log.length})` : ""}`, icon: "🕵️" },
    { id: "files",     label: "Governance Files",  icon: "📁" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.text }}>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Outfit:wght@300;400;600;700;900&display=swap" />

      {/* ── Guided Tour ── */}
      {tourActive && (
        <TourOverlay
          onClose={() => setTourActive(false)}
          onTabSwitch={setTab}
        />
      )}

      {/* ── Header ── */}
      <div style={{
        background: "#050608",
        borderBottom: `1px solid ${T.border}`,
        padding: "0 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 58,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* citizenM mark */}
          <div style={{
            background: T.orange, borderRadius: 8, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.sans, fontWeight: 900, fontSize: 13, color: "#fff",
            letterSpacing: "-1px", flexShrink: 0,
          }}>cM</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: "-0.03em", lineHeight: 1 }}>
              citizenM <span style={{ color: T.dim, fontWeight: 300 }}>·</span> AI Governance Hub
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 2, fontFamily: T.mono }}>
              Powered by VDA-MD Framework &nbsp;·&nbsp; Confidential POC
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: T.green,
              display: "inline-block", animation: "pulse-ring 2s ease infinite",
            }} />
            <span style={{ fontSize: 12, color: T.green, fontFamily: T.mono, fontWeight: 600 }}>Live</span>
          </div>
          <div style={{ width: 1, height: 18, background: T.border }} />
          <span style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "4px 10px", fontSize: 11, color: T.muted, fontFamily: T.mono,
          }}>Claude API · claude-sonnet-4</span>
          <span style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "4px 10px", fontSize: 11, color: T.muted, fontFamily: T.mono,
          }}>NIST SP 800-53 Rev 5</span>
          {!tourActive && (
            <button onClick={() => setTourActive(true)} style={{
              background: `${T.orange}15`, border: `1px solid ${T.orange}50`,
              borderRadius: 6, padding: "5px 12px", fontSize: 11, color: T.orange,
              fontFamily: T.mono, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.06em", transition: "all 0.2s",
            }}>
              ▶ TOUR
            </button>
          )}
        </div>
      </div>

      {/* ── Journey breadcrumb ── */}
      <div style={{
        background: "#08090c", borderBottom: `1px solid ${T.border}`,
        padding: "0 28px", display: "flex", gap: 0, alignItems: "stretch",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "12px 18px", background: "none", border: "none",
            borderBottom: `2px solid ${tab === t.id ? T.orange : "transparent"}`,
            color: tab === t.id ? T.orange : T.dim,
            cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
            fontFamily: T.sans, transition: "all 0.2s",
            display: "flex", gap: 8, alignItems: "center", whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "0 4px" }}>
          {[
            { label: "Pre-Book", color: T.blue, domain: "Business" },
            { label: "Book", color: T.teal, domain: "Business" },
            { label: "Stay", color: T.orange, domain: "Operations" },
            { label: "Post-Stay", color: T.blue, domain: "Business" },
          ].map((s, i) => (
            <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {i > 0 && <span style={{ color: T.dim, fontSize: 10 }}>›</span>}
              <span style={{
                fontSize: 10, color: s.color, fontFamily: T.mono, fontWeight: 700,
                background: `${s.color}12`, borderRadius: 4, padding: "2px 7px",
              }}>{s.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {tab === "journey"   && <JourneyMapTab />}
      {tab === "c2md"      && <C2MDStudioTab />}
      {tab === "exception" && <ExceptionEngineTab onLogEntry={addLog} />}
      {tab === "witness"   && <WitnessAgentTab log={log} />}
      {tab === "files"     && <GovernanceFilesTab />}
    </div>
  );
}
