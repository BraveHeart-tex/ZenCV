import { autorun, computed, makeAutoObservable, runInAction, toJS } from 'mobx';
import { BuilderRootStore } from './builderRootStore';
import {
  PdfTemplateData,
  ResumeStats,
  ResumeSuggestion,
} from '@/lib/types/documentBuilder.types';
import { DEX_Item } from '@/lib/client-db/clientDbSchema';
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
import { sortByDisplayOrder } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import debounce from '@/lib/utils/debounce';

export class BuilderTemplateStore {
  root: BuilderRootStore;

  debouncedTemplateData: PdfTemplateData | null = null;
  debouncedResumeStats: ResumeStats = { score: 0, suggestions: [] };

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
    this.setupReactions();
  }

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

    autorun(() => {
      debouncedTemplateUpdate(this.pdfTemplateData);
    });

    autorun(() => {
      debouncedStatsUpdate(this.resumeStats);
    });
  };

  @computed
  get pdfTemplateData() {
    const singleEntrySectionTypes = [
      INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
      INTERNAL_SECTION_TYPES.SUMMARY,
    ];

    const sections = toJS(this.root.sectionStore.sections);
    const items = toJS(this.root.itemStore.items);
    const fields = toJS(this.root.fieldStore.fields);

    const mappedSections: PdfTemplateData['sections'] = sections
      .filter(
        (section) =>
          !singleEntrySectionTypes.includes(
            section.type as (typeof singleEntrySectionTypes)[number],
          ),
      )
      .slice()
      .sort(sortByDisplayOrder)
      .map((section) => {
        return {
          ...section,
          items: items
            .slice()
            .sort(sortByDisplayOrder)
            .filter((item) => item.sectionId === section.id)
            .map((item) => ({
              ...item,
              fields: fields.filter((field) => field.itemId === item.id),
            })),
        };
      });

    const getFieldValueByName = this.root.fieldStore.getFieldValueByName;

    return {
      personalDetails: {
        firstName: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME),
        lastName: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME),
        jobTitle: getFieldValueByName(
          FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
        ),
        address: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.ADDRESS),
        city: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.CITY),
        phone: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.PHONE),
        email: getFieldValueByName(FIELD_NAMES.PERSONAL_DETAILS.EMAIL),
      },
      summarySection: {
        sectionName: this.root.sectionStore.getSectionNameByType(
          INTERNAL_SECTION_TYPES.SUMMARY,
        ),
        summary: getFieldValueByName(FIELD_NAMES.SUMMARY.SUMMARY),
      },
      sections: mappedSections,
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
            (field) => (!fieldName || field.name === fieldName) && field.value,
          ),
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
      },
    );

    const skillsItems = this.root.sectionStore.getSectionItemsBySectionType(
      INTERNAL_SECTION_TYPES.SKILLS,
    );
    if (skillsItems) {
      const addedSkills = skillsItems.filter((item) =>
        hasFilledFields([item], FIELD_NAMES.SKILLS.SKILL),
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
      INTERNAL_SECTION_TYPES.LANGUAGES,
    );
    if (languageItems) {
      const addedLanguages = languageItems.filter((item) =>
        hasFilledFields([item], FIELD_NAMES.LANGUAGES.LANGUAGE),
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
}
