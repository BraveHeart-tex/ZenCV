import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the local-first approach work?',
    answer:
      'Our CV builder stores all your data locally on your device. This means your information never leaves your computer unless you choose to export it, ensuring maximum privacy and security.',
  },
  {
    question: 'Can I use CVCraft offline?',
    answer:
      "Yes! Once you've loaded the application, you can use CVCraft without an internet connection. Your changes will be saved locally.",
  },
  {
    question: 'What file formats can I download my CV in?',
    answer:
      "You can download your CV in PDF, DOCX, and plain text formats. We're constantly working on adding more export options.",
  },
  {
    question: 'Are the templates really free?',
    answer:
      'All our templates are free to use. We believe in providing high-quality tools without hidden costs.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="md:py-24 lg:py-32 w-full py-12">
      <div className="md:px-6 container px-4 mx-auto">
        <h2 className="sm:text-5xl mb-12 text-3xl font-bold tracking-tighter text-center">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
