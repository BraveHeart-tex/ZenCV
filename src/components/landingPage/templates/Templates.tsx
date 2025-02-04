import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { templateOptionsWithImages } from '../../appHome/resumeTemplates/resumeTemplates.constants';
import TemplateImageDialog from './TemplateImageDialog';

export default function Templates() {
  return (
    <section id="templates" className="md:py-24 lg:py-32 w-full py-12">
      <div className="md:px-6 container px-4 mx-auto">
        <h2 className="sm:text-5xl mb-12 text-3xl font-bold tracking-tighter text-center">
          Professional Templates
        </h2>
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-6">
          {templateOptionsWithImages.map((template, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <TemplateImageDialog template={template} />
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    {template.name}
                  </h3>
                  <Button variant="outline" className="w-full">
                    Use this template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
