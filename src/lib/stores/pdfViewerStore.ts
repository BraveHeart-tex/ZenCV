import { makeAutoObservable } from 'mobx';

interface PdfDimensions {
  width: number;
  height: number;
}

interface PdfViewerState {
  numberOfPages: number;
  setNumberOfPages: (numberOfPages: number) => void;

  currentPage: number;
  setCurrentPage: (currentPage: number) => void;

  previousRenderValue: string | null;
  setPreviousRenderValue: (previousRenderValue: string | null) => void;
  pdfDimensions: PdfDimensions | null;
  setPdfDimensions: (pdfDimensions: PdfDimensions) => void;
}

class PdfViewerStore implements PdfViewerState {
  numberOfPages = 0;
  currentPage = 1;
  previousRenderValue: string | null = null;
  pdfDimensions: { width: number; height: number } | null = null;

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

  setPdfDimensions = (pdfDimensions: PdfDimensions) => {
    this.pdfDimensions = pdfDimensions;
  };
}

export const pdfViewerStore = new PdfViewerStore();
