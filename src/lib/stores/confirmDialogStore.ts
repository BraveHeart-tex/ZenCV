import { action, makeAutoObservable } from 'mobx';

interface ShowDialogParams {
  message: string;
  onConfirm: () => void;
  title: string;
  cancelText?: string;
  confirmText?: string;
  doNotAskAgainEnabled?: boolean;
  doNotAskAgainChecked?: boolean;
}

class ConfirmDialogStore {
  isOpen: boolean = false;
  message: string = '';
  title: string = '';
  onConfirm: () => void = () => {};
  cancelText: string = 'Cancel';
  confirmText: string = 'Confirm';
  doNotAskAgainEnabled: boolean = false;
  doNotAskAgainChecked: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      showDialog: action,
      hideDialog: action,
    });
  }

  showDialog = ({
    message,
    onConfirm,
    title,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    doNotAskAgainChecked = false,
    doNotAskAgainEnabled = false,
  }: ShowDialogParams) => {
    this.message = message;
    this.onConfirm = onConfirm;
    this.title = title;
    this.isOpen = true;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
    this.doNotAskAgainChecked = doNotAskAgainChecked;
    this.doNotAskAgainEnabled = doNotAskAgainEnabled;
  };

  hideDialog = () => {
    this.isOpen = false;
    this.onConfirm = () => {};
    setTimeout(() => {
      this.message = '';
      this.title = 'Confirm';
      this.cancelText = 'Cancel';
      this.confirmText = 'Confirm';
      this.doNotAskAgainEnabled = false;
      this.doNotAskAgainChecked = false;
    }, 300);
  };

  handleDoNotAskAgainCheckedChange = (checked: boolean) => {
    this.doNotAskAgainChecked = checked;
  };
}

export const confirmDialogStore = new ConfirmDialogStore();
