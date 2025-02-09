export const getKeyByValue = (
  object: Record<string, unknown>,
  value: unknown,
) => {
  return Object.keys(object).find((key) => object[key] === value);
};
