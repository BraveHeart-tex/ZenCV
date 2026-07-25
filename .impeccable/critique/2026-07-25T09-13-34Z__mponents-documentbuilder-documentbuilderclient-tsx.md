---
target: src/components/documentBuilder/DocumentBuilderClient.tsx
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-07-25T09-13-34Z
slug: mponents-documentbuilder-documentbuilderclient-tsx
---
Method: dual-agent (A: critique_design_a2 · B: critique_evidence_b), with parent live-browser verification

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Live preview and score provide feedback, but ordinary edits lack a visible saving/saved-local state. |
| 2 | Match System / Real World | 3 | Resume language is familiar; the unexplained score and “land more interviews” claim are less grounded. |
| 3 | User Control and Freedom | 2 | Back navigation and collapsibles help, but deletion lacks undo and several actions are hover-dependent. |
| 4 | Consistency and Standards | 3 | Shared neutral controls are cohesive; icon-only and hover-only actions break the otherwise explicit interaction language. |
| 5 | Error Prevention | 2 | Some confirmations and constraints exist, but field persistence failures can remain invisible. |
| 6 | Recognition Rather Than Recall | 2 | The form is visible, but overview, item actions, and unnamed header controls require discovery. |
| 7 | Flexibility and Efficiency | 2 | Keyboard drag-and-drop exists, but a desktop-heavy workflow lacks a persistent section-jump path and clear accelerators. |
| 8 | Aesthetic and Minimalist Design | 2 | The split canvas is clean, but score, Improve, and Tailor compete with the editing task above the first field. |
| 9 | Error Recovery | 2 | Some plain-language toasts exist; save failures and invalid input recovery remain inconsistent. |
| 10 | Help and Documentation | 1 | Field descriptions help locally, but score methodology and task-oriented guidance are absent. |
| **Total** | | **21/40** | **Acceptable — significant improvement needed** |

## Design Specificity Verdict

**LLM assessment:** Moderately product-specific. The 50/50 editor/PDF workbench, structured resume sections, score, tailoring flow, and template access unmistakably belong to a CV builder. The live document is correctly treated as the signature object. The surrounding chrome is more interchangeable: generic icon buttons, a conventional settings dialog, and a prominent AI upsell pattern could belong to many form-based SaaS products.

The largest missed opportunity is ZenCV’s local-first positioning. The builder never turns that advantage into workspace reassurance through a compact “Saving…” / “Saved locally” status. Instead, the first viewport foregrounds evaluation and optimization. That shifts the emotional tone from a private career studio toward a generic resume-growth product.

**Deterministic scan:** `detect.mjs` returned exit code 0 with `[]`: zero findings, zero rule counts, and no false positives for [DocumentBuilderClient.tsx](/Users/bora/projects/ZenCV/src/components/documentBuilder/DocumentBuilderClient.tsx). This is useful but narrow: the component avoids the detector’s syntactic anti-patterns, while the live composition still has hierarchy, discoverability, and reassurance issues the detector cannot infer.

**Visual evidence:** Live inspection at `/builder/2` confirmed the desktop split workspace is strong and the rendered resume remains visually dominant. It also confirmed that “Your Resume Score,” “Improve Resume,” and the job-tailoring banner consume the entire band between the document title and the first editable section. No user-visible detector overlay was produced because the available Browser evaluation surface is read-only and could not pass mutable script-injection preflight.

## Overall Impression

The builder has the right desktop skeleton: a quiet editor beside a legible paper preview, with immediate correspondence between input and output. The largest opportunity is not visual decoration; it is focus. The first viewport should establish safety and invite editing, but currently asks users to interpret a score and two optimization mechanisms before they reach their resume.

### Cognitive load

Four of eight checks fail, producing high cognitive load:

- **Single focus:** score, Improve, Tailor, form editing, and preview monitoring compete.
- **Visual hierarchy:** optimization precedes the core task without explaining how its two systems relate.
- **One thing at a time:** users are asked to write, assess, tailor, and monitor simultaneously.
- **Minimal choices:** Add New Section exposes six equal choices; the rich-text toolbar exposes roughly eight controls.

Grouping, progressive disclosure, and side-by-side preview are solid. The live preview removes a major memory bridge. The remaining long-scroll burden needs a stronger desktop navigation spine.

### Emotional journey

- **Entry:** The editable title and live rendered resume create immediate ownership.
- **Early valley:** A percentage score plus “Improve Resume” and “land more interviews” introduces judgment and performance anxiety before editing begins.
- **Mid-flow:** Direct input-to-preview feedback is reassuring, but invisible persistence and a long section stack undermine confidence.
- **Peak:** Seeing a polished resume update and downloading the PDF is the strongest moment.
- **Ending:** “Add New Section” leaves the experience emotionally open-ended; there is no saved-local or readiness confirmation.

## What’s Working

1. **The desktop workbench is fundamentally right.** At `xl`, the editor and preview each receive half the viewport; below that threshold the experience focuses one view at a time ([DocumentBuilderClient.tsx](/Users/bora/projects/ZenCV/src/components/documentBuilder/DocumentBuilderClient.tsx:28)).
2. **The document leads.** Neutral application chrome allows the paper preview, template typography, and resume content to remain the visual subject.
3. **Progressive disclosure is already credible.** Optional personal details, collapsible entries, descriptions, and the focused mobile view reduce the intrinsic complexity of resume data.

## Priority Issues

### [P1] Optimization UI displaces the core editing task

**Why it matters:** The score, Improve control, and tailoring banner occupy the most valuable area between title and form. Their relationship is unclear, and “land more interviews” exceeds the product evidence recorded in `PRODUCT.md`. The result adds pressure to an already stressful task.

**Fix:** Consolidate them into one secondary “Resume guidance” module. Explain the score methodology, keep the module collapsed for returning users, and replace outcome language with task language such as “Tailor this CV to a job description.”

**Suggested command:** `$impeccable distill`

Evidence: [DocumentBuilderClient.tsx](/Users/bora/projects/ZenCV/src/components/documentBuilder/DocumentBuilderClient.tsx:41).

### [P1] Local persistence is invisible

**Why it matters:** Resume editing is consequential. A user should never wonder whether recent work is safe. ZenCV’s local-first model is a genuine differentiator, but the builder does not surface it when confidence matters most.

**Fix:** Place a compact status beside the document title: “Saving…” → “Saved locally.” On failure, preserve the last confirmed value and provide an actionable retry. Treat local persistence as workspace identity, not only marketing copy.

**Suggested command:** `$impeccable harden`

### [P1] Important controls are unnamed or hover-dependent

**Why it matters:** Desktop-primary does not mean mouse-only. Back and Settings are icon-only in source, while overview and item actions rely on hover. That hurts first-time discoverability and keyboard/screen-reader operation.

**Fix:** Add accessible names and visible tooltips to header icons; expose secondary actions on focus as well as hover; make overview keyboard-focusable and optionally pinnable; use actual buttons for interactive chevrons.

**Suggested command:** `$impeccable audit`

Evidence: [DocumentBuilderClient.tsx](/Users/bora/projects/ZenCV/src/components/documentBuilder/DocumentBuilderClient.tsx:33).

### [P2] The long-form editor lacks a desktop navigation spine

**Why it matters:** Heavy desktop users repeatedly move among Personal Details, Summary, Experience, Education, and Skills. A long scroll plus a peripheral hover overview is less efficient than the rest of the workbench.

**Fix:** Convert the overview into a compact persistent section rail or command menu with current-section indication, readiness markers, and jump actions. Include Add Section there while retaining the end-of-document widget.

**Suggested command:** `$impeccable layout`

### [P2] Mobile continuity is sound but several controls become recall-heavy

**Why it matters:** Mobile is secondary, yet users returning briefly still need to recognize Preview and Download and hit them reliably.

**Fix:** Preserve concise text labels for Preview and Download and keep important tap targets at least 44px. Do not pursue full desktop feature parity.

**Suggested command:** `$impeccable adapt`

## Persona Red Flags

### Jordan — first-time job seeker

- Cannot tell whether “Improve Resume” and job tailoring are separate tools or steps in one flow.
- Encounters “Your Resume Score” without methodology or a clear interpretation.
- Sees icon-only Back and Settings controls.
- Receives no visible reassurance that work is saved locally.
- Faces six equal Add Section choices without a recommended next step.

Likely failure point: hesitation before Personal Details because the first viewport asks for interpretation before action.

### Sam — keyboard/screen-reader user

- Back and Settings lack source-level accessible names in the target composition.
- Resume overview and several item actions depend on hover.
- Some chevrons are interactive SVGs rather than ordinary buttons.
- Global smooth scrolling is forced without an evident reduced-motion exception.

Likely failure point: cannot discover or operate the overview and secondary item actions in a linear keyboard flow.

### Alex — desktop power user

- The 50/50 workbench is efficient, but the long editor lacks persistent section navigation.
- Optimization UI consumes prime vertical space on every session.
- No clear keyboard accelerators or command path are visible for jumping, adding sections, previewing, or downloading.

Likely failure point: repeated scrolling and pointer travel during iterative resume tailoring.

## Minor Observations

- The sticky Improve region becomes a high-elevation overlay while scrolling, increasing its competition with the form.
- The Tailor banner combines a long promise, icon, “Try it,” and chevron—too many signals for one secondary action.
- “Add New Section” carries more visual weight than an end-of-document utility block needs.
- The clean live browser screenshot validates the neutral palette and document dominance; color is not the problem.
- Mobile should remain a review/light-edit/export continuity mode, consistent with the updated product context.

## Questions to Consider

1. Should the first viewport lead with **Saved locally**, **Resume guidance**, or keep the current **score-first** hierarchy?
2. Should optimization become one collapsed module, or should score and job tailoring remain separate but move below Personal Details?
3. For the desktop navigation spine, is a persistent section rail, a command menu, or a lighter sticky outline the best fit?
