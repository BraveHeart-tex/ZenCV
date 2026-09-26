type DateField = {
  readonly definition: {
    readonly dateRange?: Readonly<{
      allowPresent: boolean;
    }>;
  };
};

export const canMarkDateAsPresent = (field: DateField): boolean => {
  return field.definition.dateRange?.allowPresent ?? false;
};
