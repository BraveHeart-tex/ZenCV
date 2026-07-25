---
target: src/components/appHome/documents/DocumentsPage.tsx
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-07-25T13-28-40Z
slug: src-components-apphome-documents-documentspage-tsx
---
Method: dual-agent (A: 019f9971-ca47-7c20-90de-0c4a9da0630d · B: 019f9971-e6f2-7132-b9bb-f7d52ac86709)

**Design Health Score**

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Count, skeletons, and toasts exist, but open/manage flows lack clear state; card menu interaction can route users away. |
| 2 | Match System / Real World | 3 | Resume-adjacent language is plain, but "Documents" and the card model underuse CV-specific mental models. |
| 3 | User Control and Freedom | 2 | Cancel/delete confirmation exist, but delete has no undo and document-card navigation competes with management actions. |
| 4 | Consistency and Standards | 2 | Sidebar, toolbar, and grid all present creation differently; the create tile reads as a button while being a generic trigger. |
| 5 | Error Prevention | 2 | Delete is confirmed, but the card/menu interaction creates a preventable accidental-navigation risk. |
| 6 | Recognition Rather Than Recall | 2 | Core actions are visible, but document actions hide behind hover/ellipsis and mobile search collapses into a tiny icon-like control. |
| 7 | Flexibility and Efficiency | 2 | Search and duplicate help, but there is no sorting, recents, bulk action, or strong keyboard affordance. |
| 8 | Aesthetic and Minimalist Design | 3 | Calm, restrained, and aligned with the design system, but hierarchy is flat and resume identity is under-expressed. |
| 9 | Error Recovery | 2 | Toasts are plain, but recovery paths are generic and deletion has no undo. |
| 10 | Help and Documentation | 1 | Beyond the empty state and create-dialog description, the page gives almost no contextual guidance. |
| **Total** | | **21/40** | **Usable foundation, but several release-quality interaction and specificity gaps** |

**Design Specificity Verdict**

**LLM assessment**: The page has the right restraint for ZenCV's "Quiet Career Studio": monochrome chrome, compact controls, low visual noise, and no synthetic SaaS excess. But the document library itself still feels category-interchangeable. A generic file manager, notes app, or CRUD dashboard could reuse the search bar, count badge, create tile, and title/timestamp cards almost unchanged.

The missed opportunity is that a resume is a high-stakes career artifact, but the page treats it like a database row. The interface does not yet surface template identity, target role/company, completion/readiness, export freshness, or local-first reassurance. It is quiet, but not yet meaningfully career-studio quiet.

**Deterministic scan**: The CLI detector found `0` issues in `src/components/appHome/documents/DocumentsPage.tsx`.

The browser detector did find rendered-surface issues: `low-contrast` on the count badge, `flat-type-hierarchy` across the page, `nested-cards` on the create tile/document card, plus several shared/sidebar/global findings: layout transitions on sidebar width/margin/height, a sidebar text-overflow issue, and a global bounce easing finding. The detector caught the contrast and hierarchy issues cleanly. Several sidebar/global findings are useful product-level signals but not specific to the target wrapper file.

**Visual overlays**: Mutable injection succeeded and the detector reported 9 anti-patterns in the sub-agent's fresh tab. A reliable user-visible `[Human]` overlay could not be presented because in-app Browser visibility is not supported in sub-agent threads; the injected tab was cleaned up.

**Overall Impression**

The page is calm and workable, but it currently peaks at "blank admin list" instead of "private studio for application-ready resumes." The single biggest opportunity is to make the resume document the protagonist: show why each file matters, what it is for, and whether it is ready.

**What's Working**

1. The base visual system is aligned with ZenCV: neutral, compact, serious, and not visually needy.
2. The empty state is direct and action-oriented, and the product avoids noisy onboarding chrome.
3. Dexie-backed live querying makes the page feel immediate once the interaction model is tightened.

**Priority Issues**

**[P1] Card management can conflict with open-navigation**

Why it matters: Users trying to rename, duplicate, or delete need precise control. If a card-level `onMouseDown` competes with the overflow menu, the page breaks a core document-management expectation.

Fix: Move navigation to an explicit link/button or guard navigation from interactive descendants with pointer/mouse-down propagation handling. Prefer an obvious "Open" affordance and keep the menu behavior stable.

Suggested command: `$impeccable harden`

**[P1] Document cards are too generic for resume work**

Why it matters: Title plus timestamp does not help job seekers understand which resume is current, tailored, complete, or export-ready. It weakens confidence at the exact surface where users choose their career artifact.

Fix: Add compact resume-specific signals: template thumbnail, target role/company when present, completion/readiness, last export, or a local-only cue. Keep the card quiet, but make it unmistakably a CV card.

Suggested command: `$impeccable polish`

**[P2] Creation is over-represented once documents exist**

Why it matters: Sidebar shortcut, toolbar button, and grid tile all compete for the same action. The page keeps asking users to create even after their primary task becomes finding and managing existing resumes.

Fix: Keep one primary create action in the toolbar. Show the create tile only for empty/very-low document states, or demote it after existing documents.

Suggested command: `$impeccable distill`

**[P2] Mobile search loses affordance**

Why it matters: On mobile, the search field collapses into a small icon-width control while the New Document button keeps full emphasis. Returning users who want an existing resume get a weaker path than new creation.

Fix: Stack search and create, or make search full-width above the create button. The continuity experience should make retrieval as obvious as creation.

Suggested command: `$impeccable adapt`

**[P2] Hierarchy is too flat for a working library**

Why it matters: Browser detection flagged a flat type hierarchy, and the visual read agrees. Header, section title, count, create tile, and card all sit in a narrow expressive band. The result is clean but under-prioritized.

Fix: Strengthen the section architecture: page-level title in the shell, a compact toolbar, then a document grid with stronger card identity. Reduce repeated "Documents" labeling and make metadata secondary without becoming low contrast.

Suggested command: `$impeccable layout`

**Persona Red Flags**

**Alex (Power User)**: Search and duplicate exist, but there is no sort, recent/favorite state, bulk action, or visible keyboard path. The hover/ellipsis menu slows repeated document management.

**Jordan (First-Timer)**: The empty state helps, but the filled state does not explain what makes a resume ready. The create dialog asks for template and sample-data choices before the consequences are visually clear.

**Sam (Accessibility-Dependent User)**: The create tile appears visually interactive but is not strongly semantic in the rendered snapshot. Hover-revealed menus, low-contrast count metadata, and hidden/collapsed form fields in the create flow all deserve an accessibility pass.

**Minor Observations**

- "Updated 25.07.2026 16:19" is precise but visually heavy as the card's only metadata.
- The count badge is useful, but at one document it adds more chrome than meaning.
- The page repeats "Documents" in the shell header and section header without adding orientation.
- The empty-state phrase "gets you hired" is more outcome-claiming than the otherwise restrained product voice.
- The detector's nested-card finding is partly semantic: the page visually frames a grid of cards inside a broad page surface, and the create tile/card treatment can feel heavier than the content warrants.

**Questions to Consider**

1. What would this page show if the resume, not the app shell, were the protagonist?
2. Should "New document" still occupy a grid slot once the user already has resumes?
3. Which signal matters most on a resume card: freshness, completeness, target job, template, or export readiness?
