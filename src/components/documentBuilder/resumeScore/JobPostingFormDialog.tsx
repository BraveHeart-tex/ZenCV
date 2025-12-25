'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { dialogFooterClassNames } from '@/lib/constants';
import { mockJobPostingData } from '@/lib/mockData';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { getChangedValues } from '@/lib/utils/objectUtils';
import {
  JOB_POSTING_DESCRIPTION_LIMIT,
  type JobPostingSchema,
  jobPostingSchema,
} from '@/lib/validation/jobPosting.schema';
import { useAiSuggestionHelpers } from '../aiSuggestions/useAiSuggestionHelpers';

interface JobPostingFormDialogProps {
  trigger: React.ReactNode;
  mode?: 'edit' | 'create';
}

const defaultFormValues: JobPostingSchema = {
  companyName: '',
  jobTitle: '',
  roleDescription: '',
};

export const JobPostingFormDialog = observer(
  ({ trigger, mode = 'create' }: JobPostingFormDialogProps) => {
    const [open, setOpen] = useState(false);
    const { handleJobAnalysis } = useAiSuggestionHelpers();

    const form = useForm<JobPostingSchema>({
      resolver: zodResolver(jobPostingSchema),
      defaultValues: defaultFormValues,
    });

    useEffect(() => {
      if (
        open &&
        mode === 'edit' &&
        builderRootStore.jobPostingStore?.jobPosting
      ) {
        form.reset(builderRootStore.jobPostingStore.jobPosting);
      }
    }, [open, mode, form.reset]);

    const handleJobResult = (result: { success: boolean; message: string }) => {
      if (!result?.success) {
        showErrorToast(result?.message ?? 'An unknown error occurred.');
        return false;
      }

      setOpen(false);
      form.reset(defaultFormValues);
      return true;
    };

    const handleJobPostingUpdate = async (values: JobPostingSchema) => {
      const jobPosting = builderRootStore.jobPostingStore?.jobPosting;

      if (!jobPosting) return;

      const changedValues = getChangedValues(jobPosting, values);

      if (Object.keys(changedValues ?? {}).length === 0) {
        showInfoToast("You haven't made any changes to the job posting.");
        return;
      }

      const result =
        await builderRootStore.jobPostingStore.updateJobPosting(changedValues);

      if (!handleJobResult(result)) return;

      if (changedValues.jobTitle || changedValues.roleDescription) {
        builderRootStore.aiSuggestionsStore.resetState();
        await handleJobAnalysis(values);
      }
    };

    const handleJobPostingCreate = async (values: JobPostingSchema) => {
      const result =
        await builderRootStore.jobPostingStore.addJobPosting(values);

      if (!handleJobResult(result)) return;

      await handleJobAnalysis(values);
    };

    const onSubmit = async (values: JobPostingSchema) => {
      if (mode === 'edit') {
        await handleJobPostingUpdate(values);
      } else {
        await handleJobPostingCreate(values);
      }
    };

    return (
      <ResponsiveDialog
        trigger={trigger}
        title='Tailor for Job Posting'
        description='Most resumes never reach human eyes. Optimize yours to stand out and get more interviews.'
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            form.reset(defaultFormValues);
          }
        }}
        footer={
          <div className={dialogFooterClassNames}>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type='submit' form='job-posting-form'>
              Submit
            </Button>
          </div>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
            id='job-posting-form'
          >
            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='jobTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name='roleDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Description</FormLabel>
                    <FormControl>
                      <Textarea rows={6} {...field} />
                    </FormControl>
                    <div className='flex items-center justify-between w-full gap-8'>
                      <FormMessage />
                      <div className='whitespace-nowrap pt-1 ml-auto text-xs text-right'>
                        {form.watch('roleDescription').length} /{' '}
                        {JOB_POSTING_DESCRIPTION_LIMIT}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              {/* TODO: Will Remove after testing */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={() => {
                    form.reset(mockJobPostingData);
                  }}
                  type='button'
                  variant='outline'
                >
                  Use Mock Data
                </Button>
              )}
            </div>
          </form>
        </Form>
      </ResponsiveDialog>
    );
  }
);
