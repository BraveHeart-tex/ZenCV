import { templateOptionsWithImages } from '../../appHome/resumeTemplates/resumeTemplates.constants';
import TemplateCard from './TemplateCard';

export default function Templates() {
  return (
    <section id="templates" className="md:py-24 lg:py-32 w-full py-12">
      <div className="md:px-6 container px-4 mx-auto">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="sm:text-5xl text-3xl font-bold tracking-tighter text-center">
            Professional Templates
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Choose from a selection of ATS-friendly, professional templates to
            get started.
          </p>
        </div>
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-6">
          {templateOptionsWithImages.map((template) => (
            <TemplateCard template={template} key={template.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
