import { Label } from '@/components/ui/label';
import AppColorModeToggle from '../AppColorModeToggle';
import ClientOnly from '@/components/misc/ClientOnly';

const GeneralSettings = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">General Settings</h2>
      <ClientOnly>
        <div className="space-y-2">
          <Label htmlFor="language">Color Scheme</Label>
          <AppColorModeToggle />
        </div>
      </ClientOnly>
    </div>
  );
};

export default GeneralSettings;
