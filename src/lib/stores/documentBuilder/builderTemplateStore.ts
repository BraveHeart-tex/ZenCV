import {
  comparer,
  computed,
  makeAutoObservable,
  reaction,
  runInAction,
} from 'mobx';
import { sortByDisplayOrder } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { DEX_Item } from '@/lib/client-db/clientDbSchema';
import type {
  PdfTemplateData,
  ResumeStats,
  ResumeSuggestion,
} from '@/lib/types/documentBuilder.types';
import { debounce } from '@/lib/utils/debounce';
import type { BuilderRootStore } from './builderRootStore';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  MAX_VISIBLE_SUGGESTIONS,
  RESUME_SCORE_CONFIG,
  SECTION_SUGGESTION_CONFIG,
  SUGGESTED_SKILLS_COUNT,
  SUGGESTION_ACTION_TYPES,
  SUGGESTION_TYPES,
  TEMPLATE_DATA_DEBOUNCE_MS,
} from './documentBuilder.constants';

export class BuilderTemplateStore {
  root: BuilderRootStore;
  debouncedTemplateData: PdfTemplateData | null = null;
  debouncedResumeStats: ResumeStats = { score: 0, suggestions: [] };

  private disposers: (() => void)[] = [];
  private isActive = false;

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

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

  get mappedSections() {
    return this.root.sectionStore.sections
      .filter(
        (section) =>
          ![
            INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
            INTERNAL_SECTION_TYPES.SUMMARY,
          ].includes(
            section.type as typeof INTERNAL_SECTION_TYPES.PERSONAL_DETAILS
          )
      )
      .toSorted(sortByDisplayOrder)
      .map((section) => ({
        ...section,
        items: this.root.itemStore
          .getItemsBySectionId(section.id)
          .toSorted(sortByDisplayOrder)
          .map((item) => ({
            ...item,
            fields: this.root.fieldStore.getFieldsByItemId(item.id),
          })),
      }));
  }

  @computed
  get pdfTemplateData() {
    return {
      personalDetails: this.personalDetails,
      summarySection: this.summarySection,
      sections: this.mappedSections,
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

  resetState = () => {
    this.debouncedTemplateData = null;
    this.debouncedResumeStats = { score: 0, suggestions: [] };
  };

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

    const disposer1 = reaction(
      () => this.pdfTemplateData,
      (data) => {
        debouncedTemplateUpdate(data);
      },
      { fireImmediately: true, equals: comparer.structural }
    );

    const disposer2 = reaction(
      () => this.resumeStats,
      (data) => {
        debouncedStatsUpdate(data);
      },
      { fireImmediately: true, equals: comparer.structural }
    );

    this.disposers.push(disposer1, disposer2, () => {
      debouncedStatsUpdate.cancel();
      debouncedTemplateUpdate.cancel();
    });
  };

  private dispose = () => {
    this.disposers.forEach((dispose) => {
      dispose();
    });
    this.disposers = [];
  };

  start = () => {
    if (this.isActive) return;
    this.isActive = true;
    this.setupReactions();
  };

  stop = () => {
    if (!this.isActive) return;
    this.isActive = false;
    this.dispose();
  };
}
