import { getLinksSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { Link, Text, View } from '@react-pdf/renderer';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonLinksSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getLinksSectionEntries(section);
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
