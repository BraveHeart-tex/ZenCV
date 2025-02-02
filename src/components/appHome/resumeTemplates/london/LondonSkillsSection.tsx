import {
  findValueInItemFields,
  getRenderableEntries,
  getSectionMetadata,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import {
  FIELD_NAMES,
  SECTION_METADATA_KEYS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonSkillsSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        name: findValueInItemFields(fields, FIELD_NAMES.SKILLS.SKILL),
        level: findValueInItemFields(
          fields,
          FIELD_NAMES.SKILLS.EXPERIENCE_LEVEL,
        ),
      };
    }),
  );

  const showExperienceLevel =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
    ) === CHECKED_METADATA_VALUE;

  const isCommaSeparated =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED,
    ) === CHECKED_METADATA_VALUE;

  const renderSkills = () => {
    if (isCommaSeparated) {
      return (
        <View
          style={{
            fontSize: PDF_BODY_FONT_SIZE,
          }}
        >
          <Text>{sectionEntries.map((entry) => entry.name).join(',  ')}</Text>
        </View>
      );
    }

    return sectionEntries.map((entry) => (
      <View
        key={entry.entryId}
        style={{
          fontSize: PDF_BODY_FONT_SIZE,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '46%',
        }}
      >
        <Text>{entry.name}</Text>
        {showExperienceLevel ? <Text>{entry.level}</Text> : null}
      </View>
    ));
  };

  if (sectionEntries.length === 0) return null;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            ...londonTemplateStyles.sectionLabel,
            width: '25%',
          }}
        >
          {section?.title}
        </Text>
        <View
          style={{
            display: 'flex',
            gap: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            columnGap: 5,
            width: '75%',
          }}
        >
          {renderSkills()}
        </View>
      </View>
    </View>
  );
};

export default LondonSkillsSection;
