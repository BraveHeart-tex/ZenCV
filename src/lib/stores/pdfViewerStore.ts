import { action, makeAutoObservable, observable } from 'mobx';

interface PdfViewerState {
  numberOfPages: number;
  setNumberOfPages: (numberOfPages: number) => void;

  currentPage: number;
  setCurrentPage: (currentPage: number) => void;

  previousRenderValue: string | null;
  setPreviousRenderValue: (previousRenderValue: string | null) => void;
}

class PdfViewerStore implements PdfViewerState {
  numberOfPages = 0;
  currentPage = 1;
  previousRenderValue: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      currentPage: observable,
      numberOfPages: observable,
      previousRenderValue: observable,
      setCurrentPage: action,
      setPreviousRenderValue: action,
      setNumberOfPages: action,
    });
  }

  setCurrentPage = (currentPage: number) => {
    this.currentPage = currentPage;
  };

  setPreviousRenderValue = (previousRenderValue: string | null) => {
    this.previousRenderValue = previousRenderValue;
  };

  setNumberOfPages = (numberOfPages: number) => {
    this.numberOfPages = numberOfPages;
  };
}

export const pdfViewerStore = new PdfViewerStore();
