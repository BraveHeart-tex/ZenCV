import { UNCHECKED_METADATA_VALUE } from '../constants';
import { SECTION_METADATA_KEYS } from '../stores/documentBuilder/documentBuilder.constants';

export const getDefaultSkillsMetadata = () =>
  JSON.stringify([
    {
      label: 'Show experience level',
      key: SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
      value: UNCHECKED_METADATA_VALUE,
    },
    {
      label: 'Separate skills with a comma',
      key: SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED,
      value: UNCHECKED_METADATA_VALUE,
    },
  ]);

export const getDefaultReferencesMetadata = () =>
  JSON.stringify([
    {
      label: 'Hide references and make them available upon request',
      key: SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
      value: UNCHECKED_METADATA_VALUE,
    },
  ]);
