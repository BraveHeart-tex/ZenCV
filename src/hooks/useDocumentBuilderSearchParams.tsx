import { useSearchParams } from 'react-router';
import { BuilderViewSearchParamValue } from '@/lib/types/documentBuilder.types';

export const DOCUMENT_BUILDER_SEARCH_PARAM_KEYS = {
  VIEW: 'view',
} as const;

export const DOCUMENT_BUILDER_SEARCH_PARAM_VALUES = {
  VIEW: {
    BUILDER: 'builder',
    PREVIEW: 'preview',
  },
} as const;

export const useDocumentBuilderSearchParams = () => {
  const [params, setParams] = useSearchParams({
    [DOCUMENT_BUILDER_SEARCH_PARAM_KEYS.VIEW]:
      DOCUMENT_BUILDER_SEARCH_PARAM_VALUES.VIEW.BUILDER,
  });

  const view = params.get(
    DOCUMENT_BUILDER_SEARCH_PARAM_KEYS.VIEW,
  ) as BuilderViewSearchParamValue;

  const setView = (newView: BuilderViewSearchParamValue) => {
    setParams({
      ...Object.fromEntries(params),
      [DOCUMENT_BUILDER_SEARCH_PARAM_KEYS.VIEW]: newView,
    });
  };

  return {
    view,
    setView,
    params,
    setParams,
  };
};
