import { makeAutoObservable } from 'mobx';
import Shepherd from 'shepherd.js';

class ShepherdStore {
  Shepherd: typeof Shepherd;

  constructor() {
    this.Shepherd = Shepherd;
    makeAutoObservable(this);
  }
}

export const shepherdStore = new ShepherdStore();
