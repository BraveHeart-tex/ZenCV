import { SettingsIcon } from 'lucide-react';
import ResponsiveDialog from '../ui/ResponsiveDialog';
import { Button } from '../ui/button';

const DocumentBuilderSettingsWidget = () => {
  return (
    <ResponsiveDialog
      trigger={
        <Button variant="ghost" size="icon" className="top-4 right-4 fixed">
          <SettingsIcon />
        </Button>
      }
      title="Settings"
      description="Settings for the document builder"
    >
      Settings for the document builder
    </ResponsiveDialog>
  );
};

export default DocumentBuilderSettingsWidget;
