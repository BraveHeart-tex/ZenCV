import { type Styles, Text, View } from '@react-pdf/renderer';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { ValueOf } from '@/lib/types/utils.types';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';

interface ResumeLanguagesSectionStyles {
  section: ValueOf<Styles>;
  sectionLabel: ValueOf<Styles>;
}

interface ResumeLanguagesSectionProps {
  section: ResumeSnapshotSection;
  styles: ResumeLanguagesSectionStyles;
  fontSize: number;
}

export const ResumeLanguagesSection = ({
  section,
  styles,
  fontSize,
}: ResumeLanguagesSectionProps) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          rowGap: 8,
        }}
      >
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '45%',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <View style={{ flex: 1, overflow: 'hidden' }}>
              <Text
                style={{
                  fontSize,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {entry.language}
              </Text>
            </View>
            <Text
              style={{
                fontSize,
                flexShrink: 0,
              }}
            >
              {entry.level}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
