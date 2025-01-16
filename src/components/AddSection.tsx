'use client';
import { builderSectionTitleClassNames } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import {
  BookOpenTextIcon,
  BriefcaseBusinessIcon,
  ContactIcon,
  Flower2Icon,
  GuitarIcon,
  LanguagesIcon,
  type LucideIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { CONTAINER_TYPES, Item, Section } from '@/lib/schema';
import { INTERNAL_SECTION_TYPES } from '@/lib/constants';

interface OtherSectionOption
  extends Omit<Section, 'id' | 'documentId' | 'displayOrder' | 'defaultName'> {
  icon: LucideIcon;
  containerType: Item['containerType'];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OTHER_SECTION_OPTIONS: OtherSectionOption[] = [
  {
    icon: SlidersHorizontalIcon,
    title: 'Custom Section',
    type: INTERNAL_SECTION_TYPES.CUSTOM,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    icon: Flower2Icon,
    title: 'Extra-curricular Activities',
    type: INTERNAL_SECTION_TYPES.EXTRA_CURRICULAR_ACTIVITIES,
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
    metadata: JSON.stringify({
      hideReferences: true,
    }),
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

const AddSection = observer(() => {
  return (
    <article>
      <h3 className={builderSectionTitleClassNames}>Add Section</h3>
    </article>
  );
});

export default AddSection;
