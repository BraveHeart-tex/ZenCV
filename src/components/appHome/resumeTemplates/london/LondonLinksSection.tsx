import { TemplateDataSection } from '@/lib/types';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { FIELD_NAMES } from '@/lib/constants';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { Link, Text, View } from '@react-pdf/renderer';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

const LondonLinksSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        label: findValueInItemFields(
          fields,
          FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LABEL,
        ),
        link: findValueInItemFields(
          fields,
          FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LINK,
        ),
      };
    }),
  );

  if (sectionEntries.length === 0) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={londonTemplateStyles.sectionLabel}>{section?.title}</Text>
        <View
          style={{
            width: '75%',
            fontSize: PDF_BODY_FONT_SIZE,
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          {sectionEntries.map((entry, index) => (
            <Link
              key={entry.entryId}
              href={entry.link}
              style={londonTemplateStyles.link}
            >
              {entry.label}
              {index !== sectionEntries.length - 1 && ', '}
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
};

export default LondonLinksSection;
