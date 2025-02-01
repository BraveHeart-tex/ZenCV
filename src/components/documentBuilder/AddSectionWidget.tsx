'use client';
import { observer } from 'mobx-react-lite';
import {
  BookOpenTextIcon,
  BriefcaseBusinessIcon,
  ContactIcon,
  GuitarIcon,
  LanguagesIcon,
  type LucideIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import {
  CONTAINER_TYPES,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { UNCHECKED_METADATA_VALUE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { action } from 'mobx';
import { generateSectionMetadata } from '@/lib/helpers/documentBuilderHelpers';
import { cn } from '@/lib/utils/stringUtils';
import {
  builderSectionTitleClassNames,
  INTERNAL_SECTION_TYPES,
  SECTION_METADATA_KEYS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { TemplatedSectionType } from '@/lib/types/documentBuilder.types';

export interface OtherSectionOption
  extends Omit<
    DEX_Section,
    'id' | 'documentId' | 'displayOrder' | 'defaultName'
  > {
  type: TemplatedSectionType;
  icon: LucideIcon;
  containerType: DEX_Item['containerType'];
}

const OTHER_SECTION_OPTIONS: OtherSectionOption[] = [
  {
    icon: SlidersHorizontalIcon,
    title: 'Custom Section',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: GuitarIcon,
    title: 'Hobbies',
    type: INTERNAL_SECTION_TYPES.HOBBIES,
    containerType: CONTAINER_TYPES.STATIC,
  },
  {
    icon: ContactIcon,
    title: 'References',
    type: INTERNAL_SECTION_TYPES.REFERENCES,
    metadata: generateSectionMetadata([
      {
        label: 'Hide references and make them available upon request',
        key: SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
        value: UNCHECKED_METADATA_VALUE,
      },
    ]),
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: BookOpenTextIcon,
    title: 'Courses',
    type: INTERNAL_SECTION_TYPES.COURSES,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
    itemCountPerContainer: 4,
  },
  {
    icon: BriefcaseBusinessIcon,
    title: 'Internships',
    type: INTERNAL_SECTION_TYPES.INTERNSHIPS,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: LanguagesIcon,
    title: 'Languages',
    type: INTERNAL_SECTION_TYPES.LANGUAGES,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
].map((item) => ({
  ...item,
  defaultTitle: item.title,
}));

const AddSectionWidget = observer(() => {
  const handleAddSection = action(async (option: OtherSectionOption) => {
    await documentBuilderStore.addNewSection(option);
  });

  return (
    <article className="space-y-2">
      <h3 className={cn(builderSectionTitleClassNames, 'text-2xl')}>
        Add New Section
      </h3>
      <div className="md:grid-cols-2 grid gap-2">
        {OTHER_SECTION_OPTIONS.map((option) => (
          <Button
            variant="ghost"
            disabled={
              option.type !== INTERNAL_SECTION_TYPES.CUSTOM &&
              documentBuilderStore.sections.some(
                (section) => section.type === option.type,
              )
            }
            onClick={() => handleAddSection(option)}
            key={option.type}
            className="flex items-center justify-start gap-2 px-0 text-base"
          >
            <option.icon />
            {option.title}
          </Button>
        ))}
      </div>
    </article>
  );
});

export default AddSectionWidget;
