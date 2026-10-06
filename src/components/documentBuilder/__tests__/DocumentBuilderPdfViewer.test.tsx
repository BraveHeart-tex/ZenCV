// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { cloneElement, type ReactElement } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';

const preview = vi.hoisted(() => ({
  result: { value: 'blob:ora', loading: false },
  callbacks: new Map<string, () => void>(),
}));
vi.mock('react-use', () => ({ useAsync: () => preview.result }));
vi.mock('@react-pdf/renderer', () => ({ pdf: vi.fn() }));
vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: { templateStore: { debouncedTemplateData: null } },
}));
vi.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {}, version: 'test' },
  Document: ({
    file,
    children,
  }: {
    file: string;
    children: ReactElement<{ file: string }>;
  }) => <div data-file={file}>{cloneElement(children, { file })}</div>,
  Page: ({
    file,
    onRenderSuccess,
  }: {
    file: string;
    onRenderSuccess?: () => void;
  }) => {
    if (onRenderSuccess) {
      preview.callbacks.set(file, onRenderSuccess);
    }
    return null;
  },
}));
vi.mock('@/components/documentBuilder/PreviewSkeleton', () => ({
  PreviewSkeleton: () => null,
}));
vi.mock('@/components/ui/sonner', () => ({ showErrorToast: vi.fn() }));

import { DocumentBuilderPdfViewer } from '../DocumentBuilderPdfViewer';

beforeEach(() => {
  pdfViewerStore.resetState();
  preview.result = { value: 'blob:ora', loading: false };
  preview.callbacks.clear();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  pdfViewerStore.resetState();
});

it('ignores a previous PDF page finishing after the current preview', () => {
  const view = render(
    <DocumentBuilderPdfViewer>
      <div />
    </DocumentBuilderPdfViewer>
  );
  const oldRender = preview.callbacks.get('blob:ora');
  expect(oldRender).toBeDefined();
  preview.result = { value: 'blob:bora', loading: false };
  view.rerender(
    <DocumentBuilderPdfViewer>
      <div />
    </DocumentBuilderPdfViewer>
  );
  act(() => preview.callbacks.get('blob:bora')?.());
  expect(pdfViewerStore.previousRenderValue).toBe('blob:bora');
  act(() => oldRender?.());
  expect(pdfViewerStore.previousRenderValue).toBe('blob:bora');
});

it('ignores page completion while a newer PDF is being generated', () => {
  const view = render(
    <DocumentBuilderPdfViewer>
      <div />
    </DocumentBuilderPdfViewer>
  );
  const oldRender = preview.callbacks.get('blob:ora');
  preview.result = { value: 'blob:ora', loading: true };
  view.rerender(
    <DocumentBuilderPdfViewer>
      <div />
    </DocumentBuilderPdfViewer>
  );
  act(() => oldRender?.());
  expect(pdfViewerStore.previousRenderValue).toBeNull();
});

it('ignores an old fade finishing and promotes the latest fade', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  pdfViewerStore.setPreviousRenderValue('blob:initial');
  const view = render(
    <DocumentBuilderPdfViewer>
      <div />
    </DocumentBuilderPdfViewer>
  );
  act(() => preview.callbacks.get('blob:ora')?.());
  preview.result = { value: 'blob:bora', loading: false };
  view.rerender(
    <DocumentBuilderPdfViewer>
      <div />
    </DocumentBuilderPdfViewer>
  );
  const finishFade = (value: string) => {
    const wrapper = view.container.querySelector(
      `[data-file="${value}"]`
    )?.parentElement;
    if (!wrapper) {
      throw new Error('Expected PDF preview wrapper');
    }
    const event = new Event('transitionend', { bubbles: true });
    Object.defineProperty(event, 'propertyName', { value: 'opacity' });
    fireEvent(wrapper, event);
  };
  finishFade('blob:ora');
  expect(pdfViewerStore.previousRenderValue).toBe('blob:initial');
  act(() => preview.callbacks.get('blob:bora')?.());
  finishFade('blob:bora');
  expect(pdfViewerStore.previousRenderValue).toBe('blob:bora');
});
