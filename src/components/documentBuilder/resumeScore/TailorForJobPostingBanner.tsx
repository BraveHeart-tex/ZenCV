'use client';
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { BrainCircuitIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
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
import { observer } from 'mobx-react-lite';

const TailorForJobPostingBanner = observer(() => {
  const [open, setOpen] = useState(false);

  const form = useForm<JobPostingSchema>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      companyName: '',
      jobTitle: '',
      roleDescription: '',
    },
  });

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

  if (builderRootStore.documentStore.document?.jobPostingId) return null;

  return (
    <ResponsiveDialog
      trigger={
        <Button
          variant="ghost"
          className="bg-background md:h-16 flex items-center w-full gap-2 p-4 border rounded-md"
        >
          <BrainCircuitIcon />
          <div className="flex-1 text-[0.875rem] text-left">
            Optimize your resume for the job and land more interviews
          </div>
          <div className="md:flex items-center hidden gap-2">
            Try it <ChevronRightIcon />
          </div>
        </Button>
      }
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
                  <div className="flex items-center justify-between gap-4">
                    <FormMessage />
                    <div className="pt-1 text-xs text-right">
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
});

export default TailorForJobPostingBanner;
