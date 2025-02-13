export const getKeyByValue = (
  object: Record<string, unknown>,
  value: unknown,
) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const getChangedValues = <T extends Record<string, unknown>>(
  previousData: T,
  newData: T,
) => {
  const changed: Partial<T> = {};

  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      const previousValue = previousData[key];
      const newValue = newData[key];

      if (
        typeof newValue === 'object' &&
        newValue !== null &&
        typeof previousValue === 'object' &&
        previousValue !== null
      ) {
        const nestedChanges = getChangedValues(
          previousValue as T,
          newValue as T,
        );
        if (Object.keys(nestedChanges).length > 0) {
          changed[key] = nestedChanges as never;
        }
      } else if (previousValue !== newValue) {
        changed[key] = newValue;
      }
    }
  }

  return changed;
};
