'use client';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';

import { useEffect, useState } from 'react';
import { dialogFooterClassNames } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  JOB_POSTING_DESCRIPTION_LIMIT,
  jobPostingSchema,
  JobPostingSchema,
} from '@/lib/validation/jobPosting.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';

interface JobPostingFormDialogProps {
  trigger: React.ReactNode;
  mode?: 'edit' | 'create';
}

const JobPostingFormDialog = observer(
  ({ trigger, mode = 'create' }: JobPostingFormDialogProps) => {
    const [open, setOpen] = useState(false);

    const form = useForm<JobPostingSchema>({
      resolver: zodResolver(jobPostingSchema),
      defaultValues: {
        companyName: '',
        jobTitle: '',
        roleDescription: '',
      },
    });

    useEffect(() => {
      if (
        open &&
        mode === 'edit' &&
        builderRootStore.documentStore.document?.jobPosting
      ) {
        form.reset(builderRootStore.documentStore.document.jobPosting);
      }
    }, [open, mode]);

    const onSubmit = async (values: JobPostingSchema) => {
      const result = await builderRootStore.documentStore.addJobPosting(values);
      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      setOpen(false);
      showSuccessToast(result.message);
      form.reset();
    };

    return (
      <ResponsiveDialog
        trigger={trigger}
        title="Tailor for Job Posting"
        description="Most resumes never reach human eyes. Optimize yours to stand out and get more interviews."
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            form.reset();
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="roleDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Description</FormLabel>
                    <FormControl>
                      <Textarea rows={6} {...field} />
                    </FormControl>
                    <div className="flex items-center justify-between w-full gap-8">
                      <FormMessage />
                      <div className="whitespace-nowrap pt-1 ml-auto text-xs text-right">
                        {form.watch('roleDescription').length} /{' '}
                        {JOB_POSTING_DESCRIPTION_LIMIT}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className={dialogFooterClassNames}>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>
    );
  },
);

export default JobPostingFormDialog;
