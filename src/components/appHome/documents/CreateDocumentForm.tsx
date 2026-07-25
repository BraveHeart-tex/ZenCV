import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateImage } from '@/components/documentBuilder/TemplateImage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showErrorToast } from '@/components/ui/sonner';
import { createAndNavigateToDocument } from '@/lib/misc/createAndNavigateToDocument';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { sampleDataOptions } from '@/lib/templates/prefilledTemplates';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import type { UseState } from '@/lib/types/utils.types';
import {
  type CreateDocumentFormData,
  createNewDocumentSchema,
} from '@/lib/validation/createDocument.schema';

const resumeTemplateSelectOptions = Object.keys(INTERNAL_TEMPLATE_TYPES).map(
  (key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: INTERNAL_TEMPLATE_TYPES[key as keyof typeof INTERNAL_TEMPLATE_TYPES],
  })
);

function TemplatePreviewPopover({
  templateValue,
  children,
}: {
  templateValue: ResumeTemplate;
  children: React.ReactNode;
}) {
  const template = templateOptionsWithImages.find(
    (t) => t.value === templateValue
  );

  if (!template) {
    return <>{children}</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side='right'
        align='start'
        sideOffset={12}
        className='w-60 md:w-102 p-0 overflow-hidden border-border/60 shadow-lg'
      >
        <TemplateImage
          template={template}
          variant='hover'
          imgProps={{
            width: 408,
            height: 577,
            className: 'w-full object-cover object-top',
          }}
        />
        <div className='px-3 py-2.5 border-t border-border/40 bg-muted/30'>
          <p className='text-xs font-semibold'>{template.name}</p>
          <div className='flex flex-wrap gap-1 mt-1.5'>
            {template.tags.map((tag) => (
              <span
                key={tag}
                className='text-[10px] px-1.5 py-0.5 rounded-md border border-border/50 bg-background text-muted-foreground'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CreateDocumentFormProps {
  setOpen: UseState<boolean>;
}

export const CreateDocumentForm = ({ setOpen }: CreateDocumentFormProps) => {
  const navigate = useNavigate();
  const form = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createNewDocumentSchema),
    defaultValues: {
      title: '',
      template: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
      shouldUseSampleData: false,
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: CreateDocumentFormData) => {
    const {
      title: name,
      template,
      shouldUseSampleData,
      selectedPrefillStyle,
    } = data;
    await createAndNavigateToDocument({
      title: name,
      templateType: template,
      selectedPrefillStyle: shouldUseSampleData ? selectedPrefillStyle : null,
      onSuccess(documentId) {
        navigate(`/builder/${documentId}`);
        setOpen(false);
        form.reset();
      },
      onError() {
        showErrorToast(
          'Something went wrong while creating the document. Please try again later.'
        );
      },
    });
  };

  const showSampleData = form.watch('shouldUseSampleData');
  const selectedTemplate = form.watch('template');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  maxLength={100}
                  {...field}
                  placeholder='e.g. ABC Company — Software Engineer'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='template'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <div className='flex items-center gap-2'>
                <FormControl className='flex-1'>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Choose a template' />
                    </SelectTrigger>
                    <SelectContent>
                      {resumeTemplateSelectOptions.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <TemplatePreviewPopover templateValue={selectedTemplate}>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='shrink-0 h-9 px-2.5 text-xs text-muted-foreground gap-1.5'
                  >
                    <img
                      src={
                        templateOptionsWithImages.find(
                          (t) => t.value === selectedTemplate
                        )?.images.card
                      }
                      width={16}
                      height={20}
                      alt=''
                      className='w-4 h-5 object-cover object-top rounded-[2px] border border-border/50'
                    />
                    Preview
                  </Button>
                </TemplatePreviewPopover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='shouldUseSampleData'
          render={({ field }) => (
            <FormItem className='rounded-lg border border-border/40 bg-muted/20 px-4 py-3'>
              <div className='flex items-center gap-3'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked: boolean) =>
                      field.onChange(checked)
                    }
                  />
                </FormControl>
                <div className='space-y-0.5'>
                  <FormLabel className='text-sm font-medium cursor-pointer'>
                    Start with sample data
                  </FormLabel>
                  <p className='text-xs text-muted-foreground'>
                    Pre-fill the resume with example content to get started
                    faster.
                  </p>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {showSampleData ? (
          <FormField
            control={form.control}
            name='selectedPrefillStyle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample data style</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select sample data type' />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleDataOptions.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' className='gap-2' disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create resume'}
            <ArrowRight className='w-4 h-4' />
          </Button>
        </div>
      </form>
    </Form>
  );
};
