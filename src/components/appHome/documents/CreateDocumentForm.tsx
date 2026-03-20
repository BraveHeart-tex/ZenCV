import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showErrorToast } from '@/components/ui/sonner';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { sampleDataOptions } from '@/lib/templates/prefilledTemplates';
import type { UseState } from '@/lib/types/utils.types';
import { cn } from '@/lib/utils/stringUtils';
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
              <FormControl>
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
                    Pre-fill the document with example content to get started
                    faster
                  </p>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            'transition-all duration-200',
            !showSampleData && 'overflow-hidden'
          )}
          style={{
            maxHeight: showSampleData ? '120px' : '0',
            opacity: showSampleData ? 1 : 0,
          }}
        >
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
        </div>

        <div className='flex items-center justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type='submit' className='gap-2'>
            Create document
            <ArrowRight className='w-4 h-4' />
          </Button>
        </div>
      </form>
    </Form>
  );
};
