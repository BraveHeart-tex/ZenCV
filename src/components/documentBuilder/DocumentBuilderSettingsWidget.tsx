import { SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { Separator } from '@/components/ui/separator';
import { dialogFooterClassNames } from '@/lib/constants';
import { cn } from '@/lib/utils/stringUtils';

export const DocumentBuilderSettingsWidget = () => {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveDialog
      trigger={
        <Button
          aria-label='Open settings'
          className='size-10 shrink-0 md:size-9'
          title='Settings'
          variant='ghost'
          size='icon'
        >
          <SettingsIcon aria-hidden='true' />
        </Button>
      }
      title='Settings'
      open={open}
      onOpenChange={setOpen}
      description='Manage your application settings and preferences below.'
      footer={
        <div className={cn(dialogFooterClassNames, 'mt-4')}>
          <Button onClick={() => setOpen(false)} variant='outline'>
            Close
          </Button>
        </div>
      }
    >
      <div className='space-y-4'>
        <GeneralSettings />
        <Separator />
        <EditorPreferences />
      </div>
    </ResponsiveDialog>
  );
};
