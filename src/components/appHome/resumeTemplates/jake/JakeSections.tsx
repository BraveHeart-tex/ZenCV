import { Text, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import type {
  CustomSectionSnapshot,
  HobbiesSectionSnapshot,
  InternshipSectionSnapshot,
  ReferencesSectionSnapshot,
  ResumeSnapshotSection,
  SkillsSectionSnapshot,
} from '@/lib/builderDocument/resumeDocumentSnapshot';
import type { WorkExperienceSectionSnapshot } from '@/lib/types/documentBuilder.types';
import {
  getCoursesSectionEntries,
  getCustomSectionEntries,
  getEducationSectionEntries,
  getHobbiesSectionValue,
  getLanguagesSectionEntries,
  getReferencesSectionEntries,
  getSemanticInternshipSectionEntries,
  getSkillsSectionEntries,
} from '../resumeTemplates.helpers';
import { JakeSectionEntry } from './JakeSectionEntry';
import { jakeStyles } from './jake.styles';

export const JakeSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={jakeStyles.section}>
    <Text style={jakeStyles.sectionLabel} minPresenceAhead={40} wrap={false}>
      {title}
    </Text>
    {children}
  </View>
);

export const JakeEducationSection = ({
  section,
}: {
  section: ResumeSnapshotSection;
}) => {
  const entries = getEducationSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  return (
    <JakeSection title={section.title}>
      <View style={jakeStyles.entries}>
        {entries.map((entry) => (
          <JakeSectionEntry
            key={entry.entryId}
            entry={entry}
            titleKey='school'
            subtitleKey='degree'
          />
        ))}
      </View>
    </JakeSection>
  );
};

export const JakeWorkExperienceSection = ({
  workExperienceSection,
}: {
  workExperienceSection: WorkExperienceSectionSnapshot;
}) => {
  if (!workExperienceSection.entries.length) {
    return null;
  }
  return (
    <JakeSection title={workExperienceSection.title}>
      <View style={jakeStyles.entries}>
        {workExperienceSection.entries.map((entry) => (
          <JakeSectionEntry
            key={entry.entryId}
            entry={entry}
            titleKey='employer'
            subtitleKey='role'
          />
        ))}
      </View>
    </JakeSection>
  );
};

export const JakeInternshipsSection = ({
  section,
}: {
  section: InternshipSectionSnapshot;
}) => {
  const entries = getSemanticInternshipSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  return (
    <JakeSection title={section.title}>
      <View style={jakeStyles.entries}>
        {entries.map((entry) => (
          <JakeSectionEntry
            key={entry.entryId}
            entry={entry}
            titleKey='employer'
            subtitleKey='jobTitle'
          />
        ))}
      </View>
    </JakeSection>
  );
};

export const JakeCustomSection = ({
  section,
}: {
  section: CustomSectionSnapshot;
}) => {
  const entries = getCustomSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  return (
    <JakeSection title={section.title}>
      <View style={jakeStyles.entries}>
        {entries.map((entry) => (
          <JakeSectionEntry key={entry.entryId} entry={entry} titleKey='name' />
        ))}
      </View>
    </JakeSection>
  );
};

export const JakeCoursesSection = ({
  section,
}: {
  section: ResumeSnapshotSection;
}) => {
  const entries = getCoursesSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  // Simple coursework uses compact columns. Detailed courses retain all fields.
  const simple = entries.every(
    (entry) => !entry.institution && !entry.startDate && !entry.endDate
  );
  return (
    <JakeSection title={section.title}>
      <View style={simple ? jakeStyles.columns : jakeStyles.entries}>
        {entries.map((entry) =>
          simple ? (
            <View
              key={entry.entryId}
              style={[jakeStyles.course, { width: '23%' }]}
              wrap={false}
            >
              <Text>•</Text>
              <Text style={jakeStyles.courseBody}>{entry.course}</Text>
            </View>
          ) : (
            <JakeSectionEntry
              key={entry.entryId}
              entry={entry}
              titleKey='course'
              subtitleKey='institution'
            />
          )
        )}
      </View>
    </JakeSection>
  );
};

export const JakeSkillsSection = ({
  section,
}: {
  section: SkillsSectionSnapshot;
}) => {
  const entries = getSkillsSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  const label = (entry: (typeof entries)[number]) =>
    [
      entry.name,
      section.showExperienceLevel && entry.level ? `(${entry.level})` : '',
    ]
      .filter(Boolean)
      .join(' ');
  return (
    <JakeSection title={section.title}>
      {section.isCommaSeparated ? (
        <Text>{entries.map(label).join(', ')}</Text>
      ) : (
        <View style={jakeStyles.columns}>
          {entries.map((entry) => (
            <Text key={entry.entryId} style={jakeStyles.column}>
              {label(entry)}
            </Text>
          ))}
        </View>
      )}
    </JakeSection>
  );
};

export const JakeLanguagesSection = ({
  section,
}: {
  section: ResumeSnapshotSection;
}) => {
  const entries = getLanguagesSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  return (
    <JakeSection title={section.title}>
      <View style={jakeStyles.columns}>
        {entries.map((entry) => (
          <Text key={entry.entryId} style={jakeStyles.column}>
            {[entry.language, entry.level].filter(Boolean).join(' - ')}
          </Text>
        ))}
      </View>
    </JakeSection>
  );
};

export const JakeReferencesSection = ({
  section,
}: {
  section: ReferencesSectionSnapshot;
}) => {
  const entries = getReferencesSectionEntries(section);
  if (!entries.length) {
    return null;
  }
  return (
    <JakeSection title={section.title}>
      {section.hideReferences ? (
        <Text>References available upon request</Text>
      ) : (
        <View style={jakeStyles.entries}>
          {entries.map((entry) => (
            <View key={entry.entryId} wrap={false}>
              <Text style={{ fontWeight: 600 }}>
                {[entry.referentFullName, entry.referentCompany]
                  .filter(Boolean)
                  .join(' from ')}
              </Text>
              <Text>
                {[entry.referentEmail, entry.referentPhone]
                  .filter(Boolean)
                  .join(' - ')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </JakeSection>
  );
};

export const JakeHobbiesSection = ({
  section,
}: {
  section: HobbiesSectionSnapshot;
}) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies) {
    return null;
  }
  return (
    <JakeSection title={section.title}>
      <Text>{hobbies}</Text>
    </JakeSection>
  );
};
