citizenM Responsible AI Charter
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

Compliant

