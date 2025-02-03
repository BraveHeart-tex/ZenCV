import { Text, View, Link } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const ManhattanLinksSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
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

  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {sectionEntries.map((entry, index) => (
          <View
            key={entry.entryId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Link href={entry.link} style={manhattanTemplateStyles.link}>
              {entry.label}
            </Link>
            {index < sectionEntries.length - 1 && (
              <Text
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  color: '#666666',
                }}
              >
                •
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ManhattanLinksSection;
