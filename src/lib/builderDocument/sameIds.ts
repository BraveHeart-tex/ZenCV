export const sameIds = (
  currentIds: readonly number[],
  requestedIds: readonly number[]
): boolean => {
  const requested = new Set(requestedIds);
  return (
    currentIds.length === requestedIds.length &&
    new Set(currentIds).size === currentIds.length &&
    requested.size === requestedIds.length &&
    currentIds.every((id) => requested.has(id))
  );
};
