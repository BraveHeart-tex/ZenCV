'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { dialogFooterClassNames } from '@/lib/constants';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { sampleDataOptions } from '@/lib/templates/prefilledTemplates';
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

interface CreateDocumentFormProps {
  setOpen: UseState<boolean>;
}

export const CreateDocumentForm = ({ setOpen }: CreateDocumentFormProps) => {
  const router = useRouter();

  const form = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createNewDocumentSchema),
    defaultValues: {
      title: '',
      shouldUseSampleData: false,
      template: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
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
        router.push(`/builder/${documentId}`);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                  placeholder='ABC Company - Software Engineer'
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
                  <SelectTrigger className='w-full' id='template'>
                    <SelectValue placeholder='Resume Template' />
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
            <FormItem className='flex items-center gap-2 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel>Use sample data</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch('shouldUseSampleData') && (
          <FormField
            control={form.control}
            name='selectedPrefillStyle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Data Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full' id='sample-data-type'>
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
        )}
        <div className={dialogFooterClassNames}>
          <Button
            type='button'
            variant='outline'
            aria-label='Close create document dialog'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type='submit'>Create</Button>
        </div>
      </form>
    </Form>
  );
};
