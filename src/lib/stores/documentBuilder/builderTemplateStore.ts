import { computed, makeAutoObservable, reaction, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import {
  getLinksSectionEntries,
  sortByDisplayOrder,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { DEX_Item } from '@/lib/client-db/clientDbSchema';
import type {
  ATSCompatibilityReport,
  PdfTemplateData,
  ResumeStats,
  ResumeSuggestion,
  SectionType,
} from '@/lib/types/documentBuilder.types';
import { debounce } from '@/lib/utils/debounce';
import { removeHTMLTags } from '@/lib/utils/stringUtils';
import type { BuilderRootStore } from './builderRootStore';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  INTERNAL_TEMPLATE_TYPES,
  MAX_VISIBLE_SUGGESTIONS,
  RESUME_SCORE_CONFIG,
  SECTION_SUGGESTION_CONFIG,
  SUGGESTED_SKILLS_COUNT,
  SUGGESTION_ACTION_TYPES,
  SUGGESTION_TYPES,
  TEMPLATE_DATA_DEBOUNCE_MS,
} from './documentBuilder.constants';

const STATIC_SECTIONS = new Set<SectionType>([
  INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
  INTERNAL_SECTION_TYPES.SUMMARY,
]);

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

const calculateKeywordCoverage = (content: string, keywords: string[]) => {
  if (keywords.length === 0) {
    return 0;
  }

  const normalizedContent = content.toLowerCase();
  const matchedKeywords = keywords.filter((keyword) =>
    normalizedContent.includes(keyword.toLowerCase())
  );

  return matchedKeywords.length / keywords.length;
};

export class BuilderTemplateStore {
  root: BuilderRootStore;
  debouncedTemplateData: PdfTemplateData | null = null;
  debouncedResumeStats: ResumeStats = { score: 0, suggestions: [] };
  debouncedATSCompatibility: ATSCompatibilityReport = {
    checks: [],
    passedCount: 0,
    totalCount: 0,
    keywordCoverage: 0,
  };

  private disposers: (() => void)[] = [];
  private isActive = false;

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  @computed
  get personalDetails() {
    return {
      firstName: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME
      ),
      lastName: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME
      ),
      jobTitle: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE
      ),
      address: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.ADDRESS
      ),
      city: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.CITY
      ),
      phone: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.PHONE
      ),
      email: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.PERSONAL_DETAILS.EMAIL
      ),
    };
  }

  @computed
  get summarySection() {
    return {
      sectionName: this.root.sectionStore.getSectionNameByType(
        INTERNAL_SECTION_TYPES.SUMMARY
      ),
      summary: this.root.fieldStore.getFieldValueByName(
        FIELD_NAMES.SUMMARY.SUMMARY
      ),
    };
  }

  @computed
  get mappedSections() {
    return this.getSortedSections().map((section) => {
      const metadata = section.metadata.map((m) => ({ ...m }));
      return {
        ...section,
        metadata,
        items: this.getSortedSectionItems(section.id).map((item) => ({
          ...item,
          fields: this.root.fieldStore.getFieldsByItemId(item.id),
        })),
      };
    });
  }

  @computed
  get pdfTemplateData() {
    const mappedSections = this.mappedSections;
    const linksSections = mappedSections.filter(
      (section) => section.type === INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS
    );
    const sections = mappedSections.filter(
      (section) => section.type !== INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS
    );

    return {
      personalDetails: {
        ...this.personalDetails,
        links: linksSections.flatMap(getLinksSectionEntries),
      },
      summarySection: this.summarySection,
      sections,
      accentColor: this.root.documentStore.accentColor,
      templateType:
        this.root.documentStore.document?.templateType ??
        INTERNAL_TEMPLATE_TYPES.MANHATTAN,
    };
  }

  @computed
  get resumeStats() {
    let score = 0;
    const suggestions: ResumeSuggestion[] = [];

    const hasFilledFields = (items: DEX_Item[], fieldName?: string) =>
      items?.some((item) =>
        this.root.fieldStore
          .getFieldsByItemId(item.id)
          .some(
            (field) => (!fieldName || field.name === fieldName) && field.value
          )
      );

    SECTION_SUGGESTION_CONFIG.forEach(
      ({ type, scoreValue, label, fieldName }) => {
        const items = this.root.sectionStore.getSectionItemsBySectionType(type);

        if (items && hasFilledFields(items, fieldName)) {
          score += scoreValue;
        } else {
          suggestions.push({
            scoreValue,
            label,
            type: fieldName ? SUGGESTION_TYPES.FIELD : SUGGESTION_TYPES.ITEM,
            sectionType: type,
            actionType: fieldName
              ? SUGGESTION_ACTION_TYPES.FOCUS_FIELD
              : SUGGESTION_ACTION_TYPES.ADD_ITEM,
            fieldName,
          });
        }
      }
    );

    const skillsItems = this.root.sectionStore.getSectionItemsBySectionType(
      INTERNAL_SECTION_TYPES.SKILLS
    );
    if (skillsItems) {
      const addedSkills = skillsItems.filter((item) =>
        hasFilledFields([item], FIELD_NAMES.SKILLS.SKILL)
      );
      score += addedSkills.length * RESUME_SCORE_CONFIG.SKILL;
      if (score < 100 && addedSkills.length < SUGGESTED_SKILLS_COUNT) {
        suggestions.push({
          scoreValue: RESUME_SCORE_CONFIG.SKILL,
          label: 'Add skill',
          type: SUGGESTION_TYPES.ITEM,
          sectionType: INTERNAL_SECTION_TYPES.SKILLS,
          actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
        });
      }
    }

    const languageItems = this.root.sectionStore.getSectionItemsBySectionType(
      INTERNAL_SECTION_TYPES.LANGUAGES
    );
    if (languageItems) {
      const addedLanguages = languageItems.filter((item) =>
        hasFilledFields([item], FIELD_NAMES.LANGUAGES.LANGUAGE)
      );
      score += addedLanguages.length * RESUME_SCORE_CONFIG.LANGUAGE;
      if (!addedLanguages.length) {
        suggestions.push({
          scoreValue: RESUME_SCORE_CONFIG.LANGUAGE,
          label: 'Add language',
          type: SUGGESTION_TYPES.ITEM,
          sectionType: INTERNAL_SECTION_TYPES.LANGUAGES,
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

  @computed
  get atsCompatibility() {
    const { personalDetails, summarySection, sections } = this.pdfTemplateData;
    const keywordSuggestions = this.root.aiSuggestionsStore.keywordSuggestions;
    const workExperienceSections = sections.filter(
      (section) => section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE
    );

    const workExperienceDescriptions = workExperienceSections.flatMap(
      (section) =>
        section.items.map((item) => {
          return item.fields.find(
            (field) => field.name === FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION
          )?.value;
        })
    );

    const allResumeText = [
      personalDetails.jobTitle,
      summarySection.summary,
      ...sections.flatMap((section) =>
        section.items.flatMap((item) => item.fields.map((field) => field.value))
      ),
    ]
      .map((value) => removeHTMLTags(value).toLowerCase().trim())
      .filter(Boolean)
      .join(' ');

    const keywordCoverage = calculateKeywordCoverage(
      allResumeText,
      keywordSuggestions
    );

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
      {
        id: 'keyword_coverage',
        label: 'Covers 50%+ of job keywords',
        pass: keywordSuggestions.length > 0 ? keywordCoverage >= 0.5 : false,
      },
    ];

    return {
      checks,
      passedCount: checks.filter((check) => check.pass).length,
      totalCount: checks.length,
      keywordCoverage,
    };
  }

  resetState = () => {
    this.debouncedTemplateData = null;
    this.debouncedResumeStats = { score: 0, suggestions: [] };
    this.debouncedATSCompatibility = {
      checks: [],
      passedCount: 0,
      totalCount: 0,
      keywordCoverage: 0,
    };
  };

  private getSortedSectionItems = computedFn((sectionId: number) => {
    return this.root.itemStore
      .getItemsBySectionId(sectionId)
      .toSorted(sortByDisplayOrder);
  });

  private getSortedSections = computedFn(() => {
    return this.root.sectionStore.sections
      .filter((section) => !STATIC_SECTIONS.has(section.type))
      .toSorted(sortByDisplayOrder);
  });

  private setupReactions = () => {
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
  };

  private dispose = () => {
    this.disposers.forEach((dispose) => {
      dispose();
    });
    this.disposers = [];
  };

  start = () => {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.setupReactions();
  };

  stop = () => {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.dispose();
  };
}
