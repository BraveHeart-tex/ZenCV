import { SettingsIcon } from 'lucide-react';
import ResponsiveDialog from '../ui/ResponsiveDialog';
import { Button } from '../ui/button';
import GeneralSettings from '../appHome/settings/GeneralSettings';
import { Separator } from '../ui/separator';
import EditorPreferences from '../appHome/settings/EditorPreferences';
import { useState } from 'react';
import { dialogFooterClassNames } from '@/lib/constants';
import { cn } from '@/lib/utils/stringUtils';
import AuthenticationStatus from '../appHome/settings/AuthenticationStatus';

const DocumentBuilderSettingsWidget = () => {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveDialog
      trigger={
        <Button variant="ghost" size="icon">
          <SettingsIcon />
        </Button>
      }
      title="Settings"
      open={open}
      onOpenChange={setOpen}
      description="Manage your application settings and preferences below."
    >
      <div className="space-y-4">
        <AuthenticationStatus />
        <Separator />
        <GeneralSettings />
        <Separator />
        <EditorPreferences />
      </div>
      <div className={cn(dialogFooterClassNames, 'mt-4')}>
        <Button onClick={() => setOpen(false)} variant="outline">
          Close
        </Button>
      </div>
    </ResponsiveDialog>
  );
};

export default DocumentBuilderSettingsWidget;
