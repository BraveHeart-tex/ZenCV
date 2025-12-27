import { fa } from 'zod/v4/locales';

export const getKeyByValue = (
  object: Record<string, unknown>,
  value: unknown
) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const getChangedValues = <T extends Record<string, unknown>>(
  previousData: T,
  newData: T
): Partial<T> => {
  const changed: Partial<T> = {};

  for (const key in newData) {
    if (Object.hasOwn(newData, key)) {
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
          newValue as T
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

export function excludeObjectKeys<
  T extends object,
  K extends readonly (keyof T)[],
>(obj: T, keys: K): Omit<T, K[number]> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function safeParse<T>(value: string | null | undefined, fallback: T): T {
  if (value == null || value.trim() === '') {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
