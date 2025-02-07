import PdfViewerPageControls from '../PdfViewerPageControls';
import GalleryPdfViewer from './GalleryPdfViewer';
import MobileTemplatePickerContent from './MobileTemplatePickerContent';
import ResumeTemplateOptions from './ResumeTemplateOptions';
import TemplateGalleryHeader from './TemplateGalleryHeader';

const TemplateGallery = () => {
  return (
    <main>
      <nav className="bg-background fixed top-0 z-50 flex items-center justify-center w-full h-16 border-b">
        <TemplateGalleryHeader />
      </nav>
      <div className="bg-secondary dark:bg-background relative grid h-screen grid-cols-12 gap-4 pt-16">
        <div className="xl:col-span-3 border-r h-[calc(100vh-4rem)] overflow-auto hidden xl:block">
          <ResumeTemplateOptions />
        </div>
        <div className="xl:col-span-9 col-span-12 p-4 h-[calc(100vh-4rem)] overflow-auto flex items-center justify-center relative">
          <GalleryPdfViewer />
          <div className="right-1/2 bottom-5 fixed">
            <PdfViewerPageControls variant="primary" />
          </div>
        </div>
      </div>
      <MobileTemplatePickerContent />
    </main>
  );
};

export default TemplateGallery;
