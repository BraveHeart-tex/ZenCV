import { INTERNAL_TEMPLATE_TYPES } from '../stores/documentBuilder/documentBuilder.constants';
import type { ResumeTemplate } from '../types/documentBuilder.types';

export const DEFAULT_ACCENT_COLOR = '#4f8ef7' as const;

export const TEMPLATE_ACCENT_COLORS: Partial<Record<ResumeTemplate, string>> = {
  [INTERNAL_TEMPLATE_TYPES.TOKYO]: '#4f8ef7',
  [INTERNAL_TEMPLATE_TYPES.DUBAI]: '#c8a96e',
  [INTERNAL_TEMPLATE_TYPES.SYDNEY]: '#111111',
};

export const ACCENT_COLOR_PRESETS = [
  { label: 'Ocean', value: '#4f8ef7' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Slate', value: '#64748b' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Crimson', value: '#dc2626' },
] as const;

export type AccentColorPreset = (typeof ACCENT_COLOR_PRESETS)[number];

export const ACCENT_COLOR_SUPPORTED_TEMPLATES = new Set<ResumeTemplate>([
  INTERNAL_TEMPLATE_TYPES.TOKYO,
  INTERNAL_TEMPLATE_TYPES.DUBAI,
  INTERNAL_TEMPLATE_TYPES.SYDNEY,
]);

export interface TemplateColorSetting {
  accentColor: string;
}

export type TemplateSettings = Partial<
  Record<ResumeTemplate, TemplateColorSetting>
>;

export const parseTemplateSettings = (
  raw: string | undefined
): TemplateSettings => {
  try {
    return JSON.parse(raw || '{}') as TemplateSettings;
  } catch {
    return {};
  }
};

export const serializeTemplateSettings = (
  settings: TemplateSettings
): string => {
  return JSON.stringify(settings);
};

export const getDefaultAccentColorForTemplate = (
  templateType: ResumeTemplate
): string => {
  return TEMPLATE_ACCENT_COLORS[templateType] ?? DEFAULT_ACCENT_COLOR;
};
