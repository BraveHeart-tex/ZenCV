import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import { createAndNavigateToDocument } from '@/lib/misc/createAndNavigateToDocument';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { sampleDataOptions } from '@/lib/templates/prefilledTemplates';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import {
  type CreateDocumentFormData,
  createNewDocumentSchema,
} from '@/lib/validation/createDocument.schema';

const getDefaultValues = (initialTemplate?: ResumeTemplate) => ({
  title: '',
  template: initialTemplate ?? INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  shouldUseSampleData: false,
});

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
  isOpen: boolean;
  onSuccessClose: () => void;
  formId: string;
  onSubmittingChange: (isSubmitting: boolean) => void;
  initialTemplate?: ResumeTemplate;
}

export const CreateDocumentForm = ({
  isOpen,
  onSuccessClose,
  formId,
  onSubmittingChange,
  initialTemplate,
}: CreateDocumentFormProps) => {
  const navigate = useNavigate();
  const form = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createNewDocumentSchema),
    defaultValues: getDefaultValues(initialTemplate),
  });
  const { reset } = form;

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(initialTemplate));
    }
  }, [initialTemplate, isOpen, reset]);

  const onSubmit = async (data: CreateDocumentFormData) => {
    const {
      title: name,
      template,
      shouldUseSampleData,
      selectedPrefillStyle,
    } = data;
    form.clearErrors('root');
    onSubmittingChange(true);
    try {
      await createAndNavigateToDocument({
        title: name,
        templateType: template,
        selectedPrefillStyle: shouldUseSampleData ? selectedPrefillStyle : null,
        onSuccess(documentId) {
          navigate(`/builder/${documentId}`);
          onSuccessClose();
          reset(getDefaultValues(initialTemplate));
        },
        onError(message) {
          form.setError('root', { message });
        },
      });
    } finally {
      onSubmittingChange(false);
    }
  };

  const showSampleData = form.watch('shouldUseSampleData');
  const selectedTemplate = form.watch('template');
  const template = templateOptionsWithImages.find(
    (option) => option.value === selectedTemplate
  );

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-5'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='h-11 md:h-9'
                  maxLength={100}
                  {...field}
                  placeholder='e.g. ABC Company - Software Engineer'
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
                    <SelectTrigger className='h-11 w-full md:h-9'>
                      <SelectValue placeholder='Choose a template'>
                        {template?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {templateOptionsWithImages.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          <span className='flex items-center gap-3'>
                            <TemplateImage
                              template={option}
                              imgProps={{
                                width: 32,
                                height: 45,
                                alt: '',
                                className:
                                  'h-[45px] w-8 shrink-0 object-contain',
                              }}
                            />
                            <span className='flex flex-col text-left'>
                              <span>{option.name}</span>
                              <span className='text-xs text-muted-foreground'>
                                {option.layoutDescription}
                              </span>
                            </span>
                          </span>
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
                    className='shrink-0 h-11 md:h-9 px-2.5 text-xs text-muted-foreground gap-1.5'
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

        {template ? (
          <div className='flex items-center gap-4'>
            <TemplateImage
              template={template}
              imgProps={{
                width: 72,
                height: 102,
                alt: `${template.name} template layout`,
                className:
                  'h-[102px] w-[72px] shrink-0 rounded-sm border border-border object-contain',
              }}
            />
            <div className='space-y-1 text-sm'>
              <p className='font-medium'>
                {template.name} - {template.layoutDescription}
              </p>
              <p className='text-muted-foreground'>
                You can change the template while editing your resume.
              </p>
            </div>
          </div>
        ) : null}

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
                    <SelectTrigger className='h-11 w-full md:h-9'>
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

        {form.formState.errors.root?.message ? (
          <p role='alert' className='text-sm text-destructive'>
            {form.formState.errors.root.message}
          </p>
        ) : null}
      </form>
    </Form>
  );
};
