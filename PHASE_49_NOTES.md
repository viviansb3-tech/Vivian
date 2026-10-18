# Phase 49 — Production Conversion & Contact Layer

Phase 49 focuses on turning portfolio interest into a reliable next action while preserving the evidence-led positioning from earlier phases.

## Added
- Progressive contact delivery: Netlify Forms when supported, email fallback on static hosts, and dedicated WhatsApp delivery.
- Netlify form declaration and honeypot spam field.
- Enquiry-type selector so professional, research, software and tutoring conversations can be distinguished.
- Downloadable vCard (`assets/vivian-sibanda.vcf`).
- Contact-card and application-brief shortcuts in the contact section.
- Application Brief toolbar access to the vCard.
- Privacy-safe interaction event hooks. No analytics vendor or tracking ID is installed by default.
- `thanks.html` for non-JavaScript/standard Netlify form completion.
- Expanded Person JSON-LD with existing public email/telephone contact details.

## Delivery behaviour
1. On a Netlify deployment, the form POST is captured by Netlify Forms.
2. If the hosting platform rejects static form POSTs, the site opens a prefilled email draft instead.
3. The visitor can explicitly choose WhatsApp at any time.

No response-time promise, analytics ID, canonical domain or scheduling URL has been invented.
