# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

ZenCV primarily serves individual job seekers creating and maintaining resumes for job applications.

Desktop is the full resume creation and editing experience. Mobile focuses on review, light edits, content corrections, and PDF export rather than reproducing the entire desktop builder.

## Product Purpose

Free, open-source, local-first resume builder. No account required. Create, edit, and export your resume to PDF without sending your resume content to a server.

Success means users can maintain application-ready resumes while retaining ownership of their data, without an account, subscription, or dependence on a remote service for core workflows.

## Positioning

Privacy and user control are core product commitments. Resume creation, editing, persistence, and PDF export belong to the local-only core. Core workflows should remain usable offline.

## Operating Context

Users create and manage resume documents, choose templates, edit structured content with a live preview, and export PDFs. Desktop supports sustained editing; mobile supports continuity away from the desktop.

Document portability includes explicit backup, restore, and transfer through JSON export and import. Users control when and where their documents leave the browser.

## Capabilities and Constraints

- Preserve account-free resume creation, editing, and PDF export.
- Keep resume content local during core workflows and persist documents in the browser.
- Preserve offline-capable core workflows, document portability, and user ownership of data.
- Support multiple resume documents, structured resume sections, template selection, and supported template customization.
- Preserve the Document Builder's one authoritative document graph. Persisted records are a storage boundary; derived consumers use the Resume Document Snapshot.
- Persistence must reliably preserve edits without data-loss races during updates, navigation, or document changes.
- Desktop provides full creation and editing. Mobile prioritizes review, light edits, content corrections, and PDF export.
- Any future remote functionality must be optional and must not weaken or become a dependency of the local-only core.
- These are confirmed product requirements, not proof that every implementation path already satisfies them. Implementation verification remains separate from the product record.

## Brand Commitments

- Product name: ZenCV.
- Free and open source.
- Simple, calm, trustworthy, and privacy-focused language.
- Describe concrete capabilities and privacy boundaries accurately.
- Avoid aggressive career-optimization messaging, hiring guarantees, and unsupported claims about resume effectiveness.

## Evidence on Hand

- Resume template previews are available under `public/templates/`.
- Product screenshots are available under `docs/images/`; they show existing surfaces and do not independently prove current behavior.
- `CONTEXT.md` defines the authoritative document domain vocabulary; `docs/adr/` records its architectural decisions.
- Repository code provides evidence to verify browser persistence, PDF export, and JSON portability.
- No established testimonials, customer logos, usage metrics, hiring outcomes, or independent ATS-validation evidence. Future work must not fabricate them.

## Product Principles

1. Keep the local-only core free, account-free, and usable offline.
2. Preserve user ownership through reliable persistence and explicit document portability.
3. Keep one authoritative document model and prevent data-loss races.
4. Match workflows to the device: full desktop editing and focused mobile continuity.
5. Earn trust through accessible interaction, calm language, and accurate privacy claims.

## Accessibility & Inclusion

Preserve accessibility across desktop and mobile workflows, including keyboard operation, readable contrast, usable responsive layouts, and reduced-motion support. No specific conformance standard or additional accommodation requirement has been established.
