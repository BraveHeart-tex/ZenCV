# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

ZenCV is primarily for individual job seekers who need to create, customize, and tailor a professional CV for job applications.

The document builder is used primarily on desktop, where users can sustain longer editing sessions and work with the form and live resume preview side by side. Mobile support is a secondary continuity experience for reviewing, making light edits, and exporting while away from a desktop.

## Product Purpose

ZenCV helps people build polished resumes quickly, adapt them to specific job postings, and export them as PDFs. Success means a user can create and maintain application-ready CVs without a subscription, mandatory account, or surrendering control of their resume data.

## Positioning

ZenCV is a free, open-source, local-first resume builder. Core document creation and export require no account, while optional account-gated AI assistance helps users tailor content when they explicitly choose to use it.

## Operating Context

Users create one or more resume documents, choose a template or sample-data starting point, edit structured CV sections with a live PDF preview, tailor content to a job posting, and export the result as a PDF. They can back up or transfer their locally stored data through JSON export and import.

## Capabilities and Constraints

- Create, rename, copy, search, and delete multiple resume documents.
- Build resumes from structured personal details, summaries, employment, education, skills, languages, courses, internships, hobbies, references, links, and custom sections.
- Choose among London, Manhattan, Tokyo, Dubai, and Sydney templates; supported templates also allow accent-color customization.
- Export resumes to PDF without watermarks or download limits.
- Store resume documents and settings locally in the browser through IndexedDB.
- Export and restore local product data as JSON.
- Use optional, authenticated AI features to analyze job postings, generate or improve summaries, suggest keywords, and generate bullet points.
- Resume data stays local unless the user explicitly invokes an AI feature. Content selected for an AI operation is processed through the ZenCV Worker and Groq.
- Core resume building does not require an account. An account is required for AI features.
- The product is a web application with a desktop-primary builder and responsive mobile continuity for review, light editing, and export.

## Brand Commitments

- Product name: ZenCV.
- The product is free and open source.
- Product language should be direct, reassuring, and respectful of the stress involved in job hunting.
- Privacy claims must clearly distinguish local document storage from explicit, opt-in AI processing.

## Evidence on Hand

- Five working resume templates and their preview assets are available under `public/templates/`.
- Product screenshots of the landing page and editor are available under `docs/images/`.
- The repository and running product demonstrate local document storage, PDF export, JSON backup and restore, template customization, and optional AI-assisted workflows.
- No testimonials, customer logos, usage metrics, hiring outcomes, or independent ATS-validation evidence are currently established; future work must not fabricate them.

## Product Principles

1. Keep core resume creation accessible without an account, subscription, or artificial usage limits.
2. Preserve user control by storing documents locally and making backup and transfer explicit.
3. Make privacy boundaries understandable, especially when a user chooses an AI-assisted action.
4. Help users move from blank page to application-ready CV with structured guidance, practical templates, and immediate preview.
5. Keep exported resumes professional, readable, and suitable for real job applications.

## Accessibility & Inclusion

ZenCV should support keyboard use, readable contrast, responsive layouts, and reduced-motion preferences. No specific conformance standard or product-specific accommodation requirement has been established.
