import { makeAutoObservable } from 'mobx';

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
    makeAutoObservable(this);
  }

  setCurrentPage = (currentPage: number) => {
    this.currentPage = currentPage;
  };

  setNumberOfPages = (numberOfPages: number) => {
    this.numberOfPages = numberOfPages;
  };

  setPreviousRenderValue = (previousRenderValue: string | null) => {
    this.previousRenderValue = previousRenderValue;
  };

  resetState = () => {
    this.numberOfPages = 0;
    this.currentPage = 1;
    this.previousRenderValue = null;
  };
}

export const pdfViewerStore = new PdfViewerStore();
