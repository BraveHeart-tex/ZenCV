type DateField = {
  readonly sectionKey: string;
  readonly definition: {
    readonly dateRange?: Readonly<{
      allowPresent: boolean;
    }>;
  };
};

export const canMarkDateAsPresent = (field: DateField): boolean => {
  if (field.sectionKey !== 'workExperience') {
    return true;
  }

  return field.definition.dateRange?.allowPresent ?? false;
};
