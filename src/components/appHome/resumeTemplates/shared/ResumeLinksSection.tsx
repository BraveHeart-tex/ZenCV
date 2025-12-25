import { Link, type Styles, Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import type { ValueOf } from '@/lib/types/utils.types';
import { getLinksSectionEntries } from '../resumeTemplates.helpers';

interface ResumeLinksSectionStyles {
  section: ValueOf<Styles>;
  sectionLabel: ValueOf<Styles>;
  link: ValueOf<Styles>;
}

interface ResumeLinksSectionProps {
  section: TemplateDataSection;
  styles: ResumeLinksSectionStyles;
  fontSize: number;
  separator?: string;
}

export const ResumeLinksSection = ({
  section,
  styles,
  fontSize,
  separator = ' • ',
}: ResumeLinksSectionProps) => {
  const sectionEntries = getLinksSectionEntries(section);

  if (!sectionEntries.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {sectionEntries.map((entry, index) => (
          <View
            key={entry.entryId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Link href={entry.link} style={styles.link}>
              {entry.label}
            </Link>
            <Text
              style={{
                fontSize,
              }}
            >
              {index < sectionEntries.length - 1 && separator}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
