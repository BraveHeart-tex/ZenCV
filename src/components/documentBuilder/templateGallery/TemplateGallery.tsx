import GalleryPdfViewer from './GalleryPdfViewer';
import ResumeTemplateOptions from './ResumeTemplateOptions';
import TemplateGalleryHeader from './TemplateGalleryHeader';

const TemplateGallery = () => {
  return (
    <main>
      <nav className="bg-background fixed top-0 z-50 flex items-center justify-center w-full h-16 border-b">
        <TemplateGalleryHeader />
      </nav>
      <div className="grid h-screen grid-cols-12 gap-4 pt-16">
        <div className="bg-muted dark:bg-background xl:col-span-3 border-r h-[calc(100vh-4rem)] overflow-auto hidden xl:block">
          <ResumeTemplateOptions />
        </div>
        <div className="xl:col-span-9 col-span-12 p-4">
          <GalleryPdfViewer />
        </div>
      </div>
    </main>
  );
};

export default TemplateGallery;
