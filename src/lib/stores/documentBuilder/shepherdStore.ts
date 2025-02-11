import { makeAutoObservable } from 'mobx';
import Shepherd from 'shepherd.js';

class ShepherdStore {
  Shepherd: typeof Shepherd;

  constructor() {
    this.Shepherd = Shepherd;
    makeAutoObservable(this);
  }
}

const shepherdStore = new ShepherdStore();
export default shepherdStore;
