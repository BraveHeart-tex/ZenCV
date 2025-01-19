const ITEM_DELETE_DO_NOT_ASK_AGAIN_KEY = 'doNotAskAgainItemDelete' as const;

export const setDeleteConfirmationPreference = async (checked: boolean) => {
  return localStorage.setItem(
    ITEM_DELETE_DO_NOT_ASK_AGAIN_KEY,
    checked.toString(),
  );
};

export const getDeleteConfirmationPreference = async () => {
  const value = localStorage.getItem(ITEM_DELETE_DO_NOT_ASK_AGAIN_KEY);
  return value === 'true';
};
