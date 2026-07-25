---
name: ZenCV
description: A quiet, professional workspace for building application-ready CVs with clarity and control.
colors:
  studio-ink: "hsl(240 5.9% 10%)"
  paper-white: "hsl(0 0% 100%)"
  quiet-slate: "hsl(240 3.8% 46.1%)"
  soft-surface: "hsl(240 4.8% 95.9%)"
  hairline: "hsl(240 5.9% 90%)"
  night-studio: "hsl(240 10% 3.9%)"
  night-surface: "hsl(240 3.7% 15.9%)"
  night-muted: "hsl(240 5% 64.9%)"
  signal-red: "hsl(0 85% 50%)"
  privacy-green: "hsl(142 71% 45%)"
typography:
  display:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  pill: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  10: "40px"
components:
  button-primary:
    backgroundColor: "{colors.studio-ink}"
    textColor: "{colors.paper-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "hsl(240 5.9% 18%)"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.studio-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.studio-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.studio-ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
  navigation-item:
    backgroundColor: "transparent"
    textColor: "{colors.studio-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px"
    height: "32px"
  dialog:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.studio-ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: ZenCV

## Overview

**Creative North Star: "The Quiet Career Studio"**

ZenCV should feel like a private, well-kept studio for consequential work: calm enough to reduce job-search stress, polished enough to build confidence, and precise enough to make dense editing feel manageable. The interface recedes behind the resume. It uses a restrained monochrome foundation, disciplined spacing, compact controls, and selective editorial scale rather than ornamental branding.

The experience is professional without becoming corporate. Light and dark themes are equal expressions of the same system, and both preserve a paper-and-ink relationship between canvas and content. Color is semantic and rare. Motion confirms state or guides attention; it never turns the workspace into a playful SaaS demo. Avoid corporate-blue dominance, AI-neon effects, glassmorphism, and decorative gradients.

**Key Characteristics:**

- Quiet monochrome chrome that keeps the document visually dominant.
- Strong editorial hierarchy paired with compact, practical controls.
- Paper-like light surfaces and ink-like dark surfaces with clear theme parity.
- Fine borders and tonal shifts before shadow.
- Direct, reassuring interaction language with visible keyboard focus.

## Colors

Studio Ink, Paper White, and Quiet Slate form a low-chroma working palette designed to keep attention on resume content.

### Primary

- **Studio Ink** (`{colors.studio-ink}`): Primary actions, high-emphasis text, selected controls, and the light-theme brand mark.

### Secondary

- **Privacy Green** (`{colors.privacy-green}`): A sparing trust and local-data signal. It may mark privacy-positive status, but it does not become general navigation or action color.
- **Signal Red** (`{colors.signal-red}`): Destructive actions and validation failures only.

### Neutral

- **Paper White** (`{colors.paper-white}`): Light-theme canvas, cards, popovers, inputs, and document-adjacent surfaces.
- **Quiet Slate** (`{colors.quiet-slate}`): Supporting copy, metadata, placeholders, and de-emphasized icons.
- **Soft Surface** (`{colors.soft-surface}`): Secondary controls, hover fills, subtle section grouping, and quiet empty-state backdrops.
- **Hairline** (`{colors.hairline}`): Dividers, input strokes, and structural borders.
- **Night Studio** (`{colors.night-studio}`): Dark-theme application canvas.
- **Night Surface** (`{colors.night-surface}`): Dark-theme secondary surfaces, borders, and hover fills.
- **Night Muted** (`{colors.night-muted}`): Dark-theme supporting copy and low-emphasis controls.

### Named Rules

**The Document Leads Rule.** Application chrome stays neutral so templates, user-selected accents, and resume content remain the visual subject.

**The Semantic Color Rule.** Saturated color must communicate privacy, warning, error, progress, or template choice; it is not ambient decoration.

**The No Synthetic Glow Rule.** Do not introduce neon gradients, luminous AI treatments, or blue-purple glow effects.

## Typography

**Display Font:** Inter Variable (with Inter and system sans-serif fallbacks)  
**Body Font:** Inter Variable (with Inter and system sans-serif fallbacks)

**Character:** Inter provides the neutral clarity required by an editor while its variable weights support an editorial jump from restrained UI text to decisive marketing headlines. Hierarchy comes from scale, weight, and spacing—not multiple typefaces.

### Hierarchy

- **Display** (`{typography.display}`): Landing-page thesis statements only; keep the line count short and visually balanced.
- **Headline** (`{typography.headline}`): Major page and section introductions.
- **Title** (`{typography.title}`): Dialog titles, document titles, settings groups, and card headings.
- **Body** (`{typography.body}`): Explanations and longer UI copy, generally constrained to a readable 65–75 character measure.
- **Label** (`{typography.label}`): Sparse section kickers and compact metadata. Uppercase is reserved for true labels, not every heading.

### Named Rules

**The One Typeface Rule.** Use Inter throughout the application shell; resume templates own their independent print typography.

**The Editorial Jump Rule.** Large display type is earned by persuasive or orienting moments. Operational screens use compact titles and strong grouping instead.

## Layout

The marketing surface uses a centered container with generous vertical intervals, a narrow reading measure, and responsive padding that grows from compact mobile gutters to open desktop sections. It moves from single-column content to two-column feature grids and horizontal template browsing as width allows.

The application shell favors an anchored sidebar, full-width working surfaces, and 64px page headers. The document builder is desktop-primary: at extra-large widths, the form and live preview each receive half of the viewport for sustained editing sessions. On smaller screens, builder and preview become mutually focused views rather than compressed columns. Mobile is a continuity mode for review, light editing, and export, not the primary environment for full resume-building parity.

Spacing follows a 4px base rhythm, with 8–16px inside compact controls, 16–24px inside cards and dialogs, and substantially larger intervals between marketing sections. Keep related labels, descriptions, and inputs tightly grouped; place more space above a new section than below its heading.

**The Workbench Split Rule.** Optimize the builder first for a genuinely usable desktop editor/preview split. Below that threshold, prioritize one view at a time and preserve the mobile tasks that matter most: review, light editing, and export.

**The Tight Controls, Open Sections Rule.** Operational density belongs inside controls and field groups. Section boundaries and page transitions receive the breathing room.

## Elevation & Depth

The system is flat by default. Fine borders, surface tone, and adjacency establish most hierarchy. Low ambient shadows appear on resting cards and compact controls; medium shadows are a hover response or a floating-menu cue; large shadows are reserved for dialogs and popovers. Dark mode relies more heavily on tonal separation because shadows have less visual leverage.

### Shadow Vocabulary

- **Control Rest** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.05)`): Buttons, inputs, switches, and compact bordered controls.
- **Card Rest** (`box-shadow: 0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)`): Document cards and reusable card containers.
- **State Lift** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): Hovered document and template cards.
- **Overlay** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Dialogs, dropdowns, and popovers.

### Named Rules

**The Flat-Until-Needed Rule.** A surface earns additional shadow only when it floats, opens, or responds to interaction.

**The One Boundary Rule.** Prefer a border or a shadow as the dominant edge treatment; avoid heavy borders under broad shadows.

## Shapes

The base form language is gently curved and practical. Inputs, standard buttons, menus, and sidebar items use the compact radius scale; cards use a 12px silhouette; prominent empty-state emblems may reach 16px. Pills are limited to badges, status labels, and small selectors whose shape communicates compactness.

Borders are one-pixel structural lines. Resume previews preserve a subtle radius while the document page remains visually paper-like. Icon buttons may become circular when they control paging or another radial, self-contained action, but ordinary action buttons remain compact rounded rectangles.

**The Purposeful Pill Rule.** Do not turn ordinary buttons, cards, or fields into capsules. Reserve full rounding for status, paging, and compact toggles.

## Components

Components should express quiet precision: compact, restrained, confidently functional, and complete in every interaction state.

### Buttons

- **Shape:** Gently curved using the medium radius, with 32–40px heights across compact, default, and large sizes.
- **Primary:** Studio Ink on Paper White in light mode, inverted in dark mode. Labels are medium weight, with icons used to clarify direction or action.
- **Hover / Focus:** Hover shifts tone rather than hue. Keyboard focus uses a crisp one-pixel ring; disabled buttons keep their silhouette at reduced opacity.
- **Secondary / Ghost:** Outline actions retain a hairline border and transparent surface; ghost actions reveal a Soft Surface fill only on interaction.

### Chips

- **Style:** Pills with compact horizontal padding, small label typography, a quiet surface, and an optional hairline border.
- **State:** Use a single semantic dot or concise text to express status. Avoid decorative multi-color chip collections.

### Cards / Containers

- **Corner Style:** The extra-large radius for standard cards.
- **Background:** Paper White or the equivalent dark canvas; quiet grouped regions may use a translucent Soft Surface.
- **Shadow Strategy:** Rest low, then use State Lift only when the whole card is interactive.
- **Border:** A hairline edge supports scanability in both themes.
- **Internal Padding:** 16px for compact document cards and 24px for descriptive or marketing containers.

### Inputs / Fields

- **Style:** Transparent or canvas-matched background, hairline border, medium radius, and compact 36px default height.
- **Focus:** A clear outline/ring using the current foreground role; never a blue glow.
- **Error / Disabled:** Signal Red for invalid borders and messages; disabled fields retain readable content at reduced opacity.

**The Silent Local Persistence Rule.** Document edits write directly to local IndexedDB and are expected to complete immediately. Do not show routine “Saving” or “Saved” indicators in the builder. Keep successful writes silent; surface only actionable persistence failures through the affected control or established error feedback, with optimistic rollback where appropriate. This rule does not apply to genuinely long-running remote, AI, PDF-rendering, import, or export operations.

### Navigation

Navigation uses compact medium-weight labels and 32px rows. Default items remain visually quiet; hover and active states use the neutral accent surface. The desktop application sidebar can collapse to icons, while mobile navigation moves into an overlay sheet. Marketing navigation is sparse and text-led.

### Dialogs and Popovers

Dialogs use a focused Paper White or Night Studio surface, 24px padding, a hairline border, and Overlay depth. Titles and descriptions remain tightly grouped; actions stack on mobile and align to the end on wider screens. Popovers and dropdowns use the same tonal language at denser spacing.

### Resume Preview

The preview is the signature working surface. It sits on a contrasting neutral stage, preserves the previous render while a new PDF is generated, and crossfades only after the replacement is ready. Template typography and accent color remain isolated from application chrome.

## Do's and Don'ts

### Do

- **Do** keep the resume or template preview visually dominant over application chrome.
- **Do** use Studio Ink, Paper White, and Quiet Slate for most interface decisions.
- **Do** reserve saturated colors for semantic states and user-selected template accents.
- **Do** preserve equal-quality light and dark themes.
- **Do** use borders and tonal layering before increasing shadow.
- **Do** keep operational controls compact while giving sections generous separation.
- **Do** provide visible hover, focus, disabled, loading, error, and empty states.
- **Do** keep motion short, purposeful, and compatible with reduced-motion preferences.

### Don't

- **Don't** turn ZenCV into a playful SaaS interface with bubbly cards, mascot energy, or novelty copy.
- **Don't** make corporate blue the default action or navigation color.
- **Don't** use AI-neon, blue-purple glow, glassmorphism, or decorative gradients.
- **Don't** let application accents compete with resume-template colors.
- **Don't** use pills for ordinary buttons, inputs, or cards.
- **Don't** add shadow to every container or stack heavy borders beneath broad shadows.
- **Don't** use uppercase tracked labels as a universal heading pattern.
