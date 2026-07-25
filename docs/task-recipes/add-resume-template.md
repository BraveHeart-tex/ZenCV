# Add A Resume Template

1. Add `src/components/appHome/resumeTemplates/[name]/`.
2. Add `[Name]Template.tsx`, section components, `[name].styles.ts`, and `[name].types.ts` when template-specific types are needed.
3. Keep `StyleSheet.create()` inside style factory functions when styles depend on dynamic values such as accent colors.
4. PDF templates need synchronous component trees; no lazy/dynamic imports inside template components.
5. Register the template ID in `INTERNAL_TEMPLATE_TYPES` at `src/lib/stores/documentBuilder/documentBuilder.constants.ts`.
6. Add the template branch in `getPdfTemplateByType()` at `src/components/documentBuilder/pdfViewer/pdfViewer.helpers.tsx`.
7. Add gallery metadata and preview paths in `src/components/appHome/resumeTemplates/resumeTemplates.constants.tsx`.
8. If accent colors are supported, update `ACCENT_COLOR_SUPPORTED_TEMPLATES` and `TEMPLATE_ACCENT_COLORS` in `src/lib/constants/accentColors.ts`.
9. When switching templates, update `templateType` and `templateSettings` in one `runInAction`.
10. Add preview images to `public/templates/` in `400`, `700`, and `1000` sizes, preferably both WebP and AVIF.
11. Verify template gallery, builder preview, PDF export, and mobile picker behavior.
