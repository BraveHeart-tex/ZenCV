import { makeAutoObservable } from 'mobx';

interface ShowDialogParams {
  message: string;
  onConfirm: () => void;
  title: string;
  cancelText?: string;
  confirmText?: string;
}

class ConfirmDialogStore {
  isOpen: boolean = false;
  message: string = '';
  title: string = '';
  onConfirm: () => void = () => {};
  cancelText: string = 'Cancel';
  confirmText: string = 'Confirm';

  constructor() {
    makeAutoObservable(this);
  }

  showDialog = ({
    message,
    onConfirm,
    title,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
  }: ShowDialogParams) => {
    this.message = message;
    this.onConfirm = onConfirm;
    this.title = title;
    this.isOpen = true;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
  };

  hideDialog = () => {
    this.isOpen = false;
    this.onConfirm = () => {};
    setTimeout(() => {
      this.message = '';
      this.title = 'Confirm';
      this.cancelText = 'Cancel';
      this.confirmText = 'Confirm';
    }, 300);
  };

  confirm = () => {
    this.onConfirm?.();
    this.hideDialog();
  };
}

export const confirmDialogStore = new ConfirmDialogStore();
