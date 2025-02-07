const ITEM_DELETE_DO_NOT_ASK_AGAIN_KEY = 'doNotAskAgainItemDelete' as const;

const setDeleteConfirmationPreference = async (
  key: string,
  checked: boolean,
) => {
  localStorage.setItem(key, checked.toString());
};

const getDeleteConfirmationPreference = async (
  key: string,
): Promise<boolean> => {
  const value = localStorage.getItem(key);
  return value === 'true';
};

export const setItemDeleteConfirmationPreference = async (checked: boolean) => {
  await setDeleteConfirmationPreference(
    ITEM_DELETE_DO_NOT_ASK_AGAIN_KEY,
    checked,
  );
};

export const getItemDeleteConfirmationPreference =
  async (): Promise<boolean> => {
    return getDeleteConfirmationPreference(ITEM_DELETE_DO_NOT_ASK_AGAIN_KEY);
  };
