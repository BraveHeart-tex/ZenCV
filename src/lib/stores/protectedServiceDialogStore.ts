import { makeAutoObservable } from 'mobx';

const defaultTitle = 'You must be signed in to use this feature';
const defaultMessage =
  'To ensure fair use of our AI services, you must be sign in';

class ProtectedServiceDialogStore {
  isOpen = false;
  message = defaultMessage;
  title = defaultTitle;

  constructor() {
    makeAutoObservable(this);
  }

  open = (title = defaultTitle, message = defaultMessage) => {
    this.title = title;
    this.message = message;
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };
}

export const protectedServiceDialogStore = new ProtectedServiceDialogStore();
