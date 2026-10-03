import { action, makeAutoObservable } from 'mobx';

const DIALOG_CONTENT_RESET_DELAY_MS = 150 as const;

interface ShowDialogParams {
  destructive?: boolean;
  pendingText?: string;
  errorMessage?: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  title: string;
  cancelText?: string;
  confirmText?: string;
  doNotAskAgainEnabled?: boolean;
  doNotAskAgainChecked?: boolean;
  onCancel?: () => void;
  onClose?: () => void;
}

class ConfirmDialogStore {
  isOpen: boolean = false;
  message: string = '';
  title: string = '';
  destructive = false;
  pendingText = 'Working…';
  errorMessage = 'This action could not be completed. Please try again.';
  private resetTimer: ReturnType<typeof setTimeout> | undefined;
  onConfirm: () => void | Promise<void> = () => {};
  onCancel: () => void = () => {};
  onClose: (() => void) | (() => Promise<void>) = () => {};
  cancelText: string = 'Cancel';
  confirmText: string = 'Confirm';
  doNotAskAgainEnabled: boolean = false;
  doNotAskAgainChecked: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  showDialog = ({
    message,
    destructive = false,
    pendingText = 'Working…',
    errorMessage = 'This action could not be completed. Please try again.',
    onConfirm,
    title,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    doNotAskAgainChecked = false,
    doNotAskAgainEnabled = false,
    onCancel = () => {},
    onClose = () => {},
  }: ShowDialogParams) => {
    clearTimeout(this.resetTimer);
    this.errorMessage = errorMessage;
    this.destructive = destructive;
    this.pendingText = pendingText;
    this.message = message;
    this.onConfirm = onConfirm;
    this.title = title;
    this.isOpen = true;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
    this.doNotAskAgainChecked = doNotAskAgainChecked;
    this.doNotAskAgainEnabled = doNotAskAgainEnabled;
    this.onCancel = onCancel;
    this.onClose = onClose;
  };

  handleDoNotAskAgainCheckedChange = (checked: boolean) => {
    this.doNotAskAgainChecked = checked;
  };

  hideDialog = async () => {
    this.isOpen = false;

    await this.onClose();

    this.onConfirm = () => {};
    this.onCancel = () => {};

    this.resetTimer = setTimeout(
      action(() => {
        if (this.isOpen) {
          return;
        }
        this.message = '';
        this.title = 'Confirm';
        this.cancelText = 'Cancel';
        this.confirmText = 'Confirm';
        this.doNotAskAgainEnabled = false;
        this.doNotAskAgainChecked = false;
      }),
      DIALOG_CONTENT_RESET_DELAY_MS
    );
  };
}

export const confirmDialogStore = new ConfirmDialogStore();
