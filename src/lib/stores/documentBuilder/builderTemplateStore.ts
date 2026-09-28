import { makeAutoObservable, reaction, runInAction } from 'mobx';
import type {
  InternshipSectionSnapshot,
  SkillsSectionSnapshot,
} from '@/lib/builderDocument/resumeDocumentSnapshot';
import { snapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import type {
  ATSCompatibilityReport,
  PdfTemplateData,
  ResumeStats,
  ResumeSuggestion,
} from '@/lib/types/documentBuilder.types';
import { debounce } from '@/lib/utils/debounce';
import { removeHTMLTags } from '@/lib/utils/stringUtils';
import { getCompactUrlLabel, normalizeWebUrl } from '@/lib/utils/urlUtils';
import type { BuilderSession } from './builderSession';
import {
  INTERNAL_TEMPLATE_TYPES,
  MAX_VISIBLE_SUGGESTIONS,
  RESUME_SCORE_CONFIG,
  SECTION_SUGGESTION_CONFIG,
  SUGGESTED_SKILLS_COUNT,
  SUGGESTION_ACTION_TYPES,
  SUGGESTION_TYPES,
  TEMPLATE_DATA_DEBOUNCE_MS,
} from './documentBuilder.constants';

const sentenceRegex = /[^.!?]+[.!?]+/g;
const quantifiedAchievementRegex =
  /\b(?:\d+(?:\.\d+)?%|\d+(?:,\d{3})+|\d+(?:\.\d+)?(?:\s?\+)?(?:k|m|b)?|[$EURGBP]\s?\d+(?:,\d{3})*(?:\.\d+)?)\b/i;
const bulletPointRegex = /<li\b|(^|\n)\s*(?:[-*•]\s+)/i;

const checkSummaryLength = (summary: string) => {
  const plainTextSummary = removeHTMLTags(summary).replace(/\s+/g, ' ').trim();

  if (!plainTextSummary) {
    return false;
  }

  const sentences =
    plainTextSummary.match(sentenceRegex)?.map((sentence) => sentence.trim()) ??
    [];

  return sentences.length >= 3 && sentences.length <= 5;
};

export class BuilderTemplateStore {
  root: BuilderSession;
  debouncedTemplateData: PdfTemplateData | null = null;
  debouncedResumeStats: ResumeStats = { score: 0, suggestions: [] };
  debouncedATSCompatibility: ATSCompatibilityReport = {
    checks: [],
    passedCount: 0,
    totalCount: 0,
  };

  private disposers: (() => void)[] = [];
  private isActive = false;
  constructor(root: BuilderSession) {
    this.root = root;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get personalDetails() {
    const values = snapshotSection(
      this.root.resumeDocumentSnapshot,
      'personalDetails'
    )?.items[0]?.values;
    return {
      firstName: values?.firstName ?? '',
      lastName: values?.lastName ?? '',
      jobTitle: values?.wantedJobTitle ?? '',
      address: values?.address ?? '',
      city: values?.city ?? '',
      phone: values?.phone ?? '',
      email: values?.email ?? '',
    };
  }

  get summarySection() {
    const section = snapshotSection(
      this.root.resumeDocumentSnapshot,
      'summary'
    );
    return {
      sectionName: section?.title ?? '',
      summary: section?.items[0]?.values.summary ?? '',
    };
  }

  get links() {
    const section = snapshotSection(
      this.root.resumeDocumentSnapshot,
      'websitesSocialLinks'
    );
    return (section?.items ?? []).flatMap((item) => {
      const link = normalizeWebUrl(item.values.link ?? '');
      if (!link) {
        return [];
      }
      const label = (item.values.label ?? '').trim();
      return [
        {
          entryId: item.id.toString(),
          label: label || getCompactUrlLabel(link),
          link,
        },
      ];
    });
  }

  get pdfTemplateData() {
    const resumeSnapshot = this.root.resumeDocumentSnapshot;
    const workExperienceSection = this.root.document?.workExperience;
    const dedicatedSections = {
      personalDetails: { ...this.personalDetails, links: this.links },
      summary: this.summarySection,
      websitesSocialLinks: this.links,
      workExperience: workExperienceSection
        ? {
            id: workExperienceSection.id,
            title: workExperienceSection.title,
            displayOrder: workExperienceSection.displayOrder,
            entries: workExperienceSection.entries.map((entry) => ({
              entryId: entry.id.toString(),
              role: entry.role.value,
              employer: entry.employer.value,
              startDate: entry.startDate.value,
              endDate: entry.endDate.value,
              city: entry.city.value,
              description: entry.description.value,
            })),
          }
        : null,
      education: snapshotSection(resumeSnapshot, 'education') ?? null,
      courses: snapshotSection(resumeSnapshot, 'courses') ?? null,
      internships:
        (snapshotSection(resumeSnapshot, 'internships') as
          | InternshipSectionSnapshot
          | undefined) ?? null,
      skills: snapshotSection(resumeSnapshot, 'skills') as
        | SkillsSectionSnapshot
        | undefined,
      languages: snapshotSection(resumeSnapshot, 'languages') ?? null,
    };
    const sections = (resumeSnapshot?.sections ?? []).filter(
      (section) => !(section.sectionKey in dedicatedSections)
    );
    return {
      personalDetails: dedicatedSections.personalDetails,
      summarySection: dedicatedSections.summary,
      workExperienceSection: dedicatedSections.workExperience,
      educationSection: dedicatedSections.education,
      coursesSection: dedicatedSections.courses,
      internshipsSection: dedicatedSections.internships,
      skillsSection: dedicatedSections.skills,
      languagesSection: dedicatedSections.languages,
      sections,
      accentColor: this.root.document?.accentColor ?? '',
      templateType:
        this.root.document?.templateType ?? INTERNAL_TEMPLATE_TYPES.MANHATTAN,
    };
  }

  get resumeStats() {
    let score = 0;
    const suggestions: ResumeSuggestion[] = [];
    const hasFilledWorkExperience =
      this.root.document?.workExperience.entries.some((entry) =>
        [
          entry.role,
          entry.employer,
          entry.startDate,
          entry.endDate,
          entry.city,
          entry.description,
        ].some((field) => Boolean(field.value))
      ) ?? false;

    const snapshot = this.root.resumeDocumentSnapshot;
    const hasFilledFields = (
      items: ReadonlyArray<{
        readonly values: Readonly<Record<string, string>>;
      }>,
      fieldKey?: string
    ) =>
      items.some((item) =>
        fieldKey
          ? Boolean(item.values[fieldKey])
          : Object.values(item.values).some(Boolean)
      );

    SECTION_SUGGESTION_CONFIG.forEach(
      ({ sectionKey, scoreValue, label, fieldKey }) => {
        const items = snapshotSection(snapshot, sectionKey)?.items ?? [];
        const hasContent =
          sectionKey === 'workExperience'
            ? hasFilledWorkExperience
            : hasFilledFields(items, fieldKey);

        if (hasContent) {
          score += scoreValue;
        } else {
          suggestions.push({
            scoreValue,
            label,
            type: fieldKey ? SUGGESTION_TYPES.FIELD : SUGGESTION_TYPES.ITEM,
            sectionKey,
            actionType: fieldKey
              ? SUGGESTION_ACTION_TYPES.FOCUS_FIELD
              : SUGGESTION_ACTION_TYPES.ADD_ITEM,
            fieldKey,
          });
        }
      }
    );

    const skillsItems = snapshotSection(snapshot, 'skills')?.items ?? [];
    if (skillsItems) {
      const addedSkills = skillsItems.filter((item) =>
        hasFilledFields([item], 'skill')
      );
      score += addedSkills.length * RESUME_SCORE_CONFIG.SKILL;
      if (score < 100 && addedSkills.length < SUGGESTED_SKILLS_COUNT) {
        suggestions.push({
          scoreValue: RESUME_SCORE_CONFIG.SKILL,
          label: 'Add skill',
          type: SUGGESTION_TYPES.ITEM,
          sectionKey: 'skills',
          actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
        });
      }
    }

    const languageItems = snapshotSection(snapshot, 'languages')?.items ?? [];
    if (languageItems) {
      const addedLanguages = languageItems.filter((item) =>
        hasFilledFields([item], 'language')
      );
      score += addedLanguages.length * RESUME_SCORE_CONFIG.LANGUAGE;
      if (!addedLanguages.length) {
        suggestions.push({
          scoreValue: RESUME_SCORE_CONFIG.LANGUAGE,
          label: 'Add language',
          type: SUGGESTION_TYPES.ITEM,
          sectionKey: 'languages',
          actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
        });
      }
    }

    return {
      score: Math.min(score, 100),
      suggestions:
        score >= 100
          ? []
          : suggestions
              .sort((a, b) => b.scoreValue - a.scoreValue)
              .slice(0, MAX_VISIBLE_SUGGESTIONS)
              .map((item) => ({
                ...item,
                key: `${item.type}-${item.label}`,
              })),
    };
  }

  get atsCompatibility() {
    const { personalDetails, summarySection } = this;
    const workExperienceDescriptions =
      this.root.document?.workExperience.entries.map(
        (entry) => entry.description.value
      ) ?? [];

    const checks = [
      {
        id: 'has_email',
        label: 'Email address present',
        pass: !!personalDetails.email.trim(),
      },
      {
        id: 'has_phone',
        label: 'Phone number present',
        pass: !!personalDetails.phone.trim(),
      },
      {
        id: 'has_job_title',
        label: 'Job title present',
        pass: !!personalDetails.jobTitle.trim(),
      },
      {
        id: 'summary_length',
        label: 'Summary is 3-5 sentences',
        pass: checkSummaryLength(summarySection.summary),
      },
      {
        id: 'work_experience_bullets',
        label: 'Work experience uses bullet points',
        pass: workExperienceDescriptions.some((description) =>
          bulletPointRegex.test(description || '')
        ),
      },
      {
        id: 'quantified_achievements',
        label: 'At least one quantified achievement',
        pass: workExperienceDescriptions.some((description) =>
          quantifiedAchievementRegex.test(removeHTMLTags(description || ''))
        ),
      },
    ];

    return {
      checks,
      passedCount: checks.filter((check) => check.pass).length,
      totalCount: checks.length,
    };
  }

  resetState() {
    this.debouncedTemplateData = null;
    this.debouncedResumeStats = { score: 0, suggestions: [] };
    this.debouncedATSCompatibility = {
      checks: [],
      passedCount: 0,
      totalCount: 0,
    };
  }

  private setupReactions() {
    const debouncedTemplateUpdate = debounce((data: PdfTemplateData) => {
      runInAction(() => {
        this.debouncedTemplateData = data;
      });
    }, TEMPLATE_DATA_DEBOUNCE_MS);

    const debouncedStatsUpdate = debounce((data: ResumeStats) => {
      runInAction(() => {
        this.debouncedResumeStats = data;
      });
    }, TEMPLATE_DATA_DEBOUNCE_MS);

    const debouncedATSCompatibilityUpdate = debounce(
      (data: ATSCompatibilityReport) => {
        runInAction(() => {
          this.debouncedATSCompatibility = data;
        });
      },
      TEMPLATE_DATA_DEBOUNCE_MS
    );

    const disposer1 = reaction(
      () => this.pdfTemplateData,
      (data) => {
        debouncedTemplateUpdate(data);
      },
      { fireImmediately: true }
    );

    const disposer2 = reaction(
      () => this.resumeStats,
      (data) => {
        debouncedStatsUpdate(data);
      },
      { fireImmediately: true }
    );

    const disposer3 = reaction(
      () => this.atsCompatibility,
      (data) => {
        debouncedATSCompatibilityUpdate(data);
      },
      { fireImmediately: true }
    );

    this.disposers.push(disposer1, disposer2, disposer3, () => {
      debouncedStatsUpdate.cancel();
      debouncedTemplateUpdate.cancel();
      debouncedATSCompatibilityUpdate.cancel();
    });
  }

  private dispose() {
    this.disposers.forEach((dispose) => {
      dispose();
    });
    this.disposers = [];
  }

  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.setupReactions();
  }

  stop() {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.dispose();
  }
}
