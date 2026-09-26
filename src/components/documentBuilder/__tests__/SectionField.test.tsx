import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SemanticField } from '@/lib/builderDocument/builderDocument';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import {
  type FieldDefinition,
  sectionDefinitions,
} from '@/lib/sectionDefinitions/sectionDefinitions';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    getField: vi.fn(),
    getItem: vi.fn(),
    UIStore: { setFieldRef: vi.fn() },
  },
}));

vi.mock('@/components/documentBuilder/inputs/DateFieldInput', () => ({
  DateFieldInput: () => <output data-control='month' />,
}));
vi.mock(
  '@/components/documentBuilder/inputs/BuilderRichTextEditorInput',
  () => ({
    BuilderRichTextEditorInput: () => <output data-control='richText' />,
  })
);
vi.mock('@/components/documentBuilder/FieldPersistenceError', () => ({
  FieldPersistenceError: () => null,
}));

import { SectionField } from '../SectionField';

const record = (id: number): DEX_Field =>
  ({
    id,
    itemId: 20,
    value: '',
    name: 'Wanted Job Title',
    type: 'string',
  }) as DEX_Field;

describe('SectionField', () => {
  it('chooses controls, width, and compact label from definitions', () => {
    const fields = [
      new SemanticField(
        record(1),
        'personalDetails',
        sectionDefinitions.personalDetails.fields.wantedJobTitle
      ),
      new SemanticField(
        record(2),
        'websitesSocialLinks',
        sectionDefinitions.websitesSocialLinks.fields.link
      ),
      new SemanticField(
        record(3),
        'workExperience',
        sectionDefinitions.workExperience.fields.startDate
      ),
      new SemanticField(
        record(4),
        'skills',
        sectionDefinitions.skills.fields.experienceLevel
      ),
      new SemanticField(
        record(5),
        'hobbies',
        sectionDefinitions.hobbies.fields.whatYouLike
      ),
      new SemanticField(
        record(6),
        'summary',
        sectionDefinitions.summary.fields.summary
      ),
      new SemanticField(record(7), 'personalDetails', {
        ...sectionDefinitions.personalDetails.fields.firstName,
        labelRow: 'compact',
      } as FieldDefinition<'personalDetails'>),
      new SemanticField(record(8), 'websitesSocialLinks', {
        ...sectionDefinitions.websitesSocialLinks.fields.link,
        labelRow: 'compact',
      } as FieldDefinition<'websitesSocialLinks'>),
    ];
    const markup = fields.map((field) => {
      vi.mocked(builderSession.getField).mockReturnValue(field);
      return renderToStaticMarkup(<SectionField fieldId={field.id} />);
    });

    expect(markup[0]).toContain('max-h-3.5');
    expect(markup[0]).toContain('type="text"');
    expect(markup[1]).toContain('type="url"');
    expect(markup[1]).toContain('inputMode="url"');
    expect(markup[2]).toContain('data-control="month"');
    expect(markup[3]).toContain('role="combobox"');
    expect(markup[4]).toContain('<textarea');
    expect(markup[4]).toContain('col-span-full');
    expect(markup[5]).toContain('data-control="richText"');
    expect(markup[5]).toContain('col-span-full');
    expect(markup[6]).toContain('max-h-3.5');
    expect(markup[7]).toContain('max-h-3.5');
    expect(markup[7]).toContain('type="url"');
  });
});
