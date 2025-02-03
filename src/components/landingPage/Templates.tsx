import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Templates() {
  const templates = [
    { name: 'London', image: '/placeholder.svg?height=400&width=300' },
    { name: 'Manhattan', image: '/placeholder.svg?height=400&width=300' },
  ];

  return (
    <section id="templates" className="md:py-24 lg:py-32 w-full py-12">
      <div className="md:px-6 container px-4 mx-auto">
        <h2 className="sm:text-5xl mb-12 text-3xl font-bold tracking-tighter text-center">
          Professional Templates
        </h2>
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={template.image}
                  alt={`${template.name} template`}
                  width={300}
                  height={400}
                  className="object-cover w-full h-[300px]"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    {template.name}
                  </h3>
                  <Button variant="outline" className="w-full">
                    Use Template
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
