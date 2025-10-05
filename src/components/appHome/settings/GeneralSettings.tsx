'use client';
import { observer } from 'mobx-react-lite';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { clientDb } from '@/lib/client-db/clientDb';
import AppColorModeToggle from '../AppColorModeToggle';
import ClientOnly from '@/components/misc/ClientOnly';

const GeneralSettings = observer(() => {
  const handleLanguageChange = async (value: string) => {
    await clientDb.settings.put({ key: 'language', value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">General Settings</h2>
      <ClientOnly>
        <div className="space-y-2">
          <Label htmlFor="language">Color Scheme</Label>
          <AppColorModeToggle />
        </div>
      </ClientOnly>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          defaultValue={userSettingsStore.generalSettings.language}
          value={userSettingsStore.generalSettings.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="tr-TR">Türkçe (TR)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

export default GeneralSettings;
