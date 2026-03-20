import { Link, Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLinksSectionEntries } from '../resumeTemplates.helpers';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoLinksSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLinksSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={tokyoTemplateStyles.sidebarSection}>
      <Text style={tokyoTemplateStyles.sidebarSectionLabel}>
        {section.title}
      </Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        {sectionEntries.map((entry) => (
          <Link
            key={entry.entryId}
            src={entry.link}
            style={tokyoTemplateStyles.link}
          >
            {entry.label || entry.link}
          </Link>
        ))}
      </View>
    </View>
  );
};
