import { action, makeAutoObservable, reaction } from 'mobx';

const DIALOG_CONTENT_RESET_DELAY_MS = 150 as const;

interface ShowDialogParams {
  message: string;
  onConfirm: () => void;
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
  onConfirm: () => void = () => {};
  onCancel: () => void = () => {};
  onClose: () => void = () => {};
  cancelText: string = 'Cancel';
  confirmText: string = 'Confirm';
  doNotAskAgainEnabled: boolean = false;
  doNotAskAgainChecked: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initReactions();
  }

  private initReactions() {
    reaction(
      () => this.isOpen,
      async (isOpen) => {
        if (!isOpen) {
          await this.onClose();
          this.onClose = () => {};
        }
      },
    );
  }

  showDialog = ({
    message,
    onConfirm,
    title,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    doNotAskAgainChecked = false,
    doNotAskAgainEnabled = false,
    onCancel = () => {},
    onClose = () => {},
  }: ShowDialogParams) => {
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

  hideDialog = () => {
    this.isOpen = false;
    this.onConfirm = () => {};
    this.onCancel = () => {};

    setTimeout(
      action(() => {
        this.message = '';
        this.title = 'Confirm';
        this.cancelText = 'Cancel';
        this.confirmText = 'Confirm';
        this.doNotAskAgainEnabled = false;
        this.doNotAskAgainChecked = false;
      }),
      DIALOG_CONTENT_RESET_DELAY_MS,
    );
  };

  handleDoNotAskAgainCheckedChange = (checked: boolean) => {
    this.doNotAskAgainChecked = checked;
  };
}

export const confirmDialogStore = new ConfirmDialogStore();
