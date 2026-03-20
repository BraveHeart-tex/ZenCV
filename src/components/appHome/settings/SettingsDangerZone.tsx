import { AlertCircle } from 'lucide-react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { SettingsSectionHeader } from '@/components/appHome/settings/SettingsShared';
import { Button } from '@/components/ui/button';
import { showSuccessToast } from '@/components/ui/sonner';
import { clientDb } from '@/lib/client-db/clientDb';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

export const SettingsDangerZone = observer(() => {
  const handleDeleteAllData = async () => {
    confirmDialogStore.showDialog({
      title: 'Delete all local data',
      message:
        'This will permanently remove all your documents, templates, and settings. This cannot be undone.',
      confirmText: 'Delete everything',
      onConfirm: async () => {
        await clientDb.delete();
        await clientDb.open();
        showSuccessToast('All local data deleted.');
        runInAction(() => confirmDialogStore.hideDialog());
      },
    });
  };

  return (
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='Danger zone'
        description='Irreversible actions. Proceed with caution.'
        destructive
      />
      <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-4'>
        <div className='flex items-start gap-3'>
          <AlertCircle className='w-4 h-4 text-destructive shrink-0 mt-0.5' />
          <div className='space-y-0.5'>
            <p className='text-sm font-medium'>Delete all local data</p>
            <p className='text-xs text-muted-foreground'>
              Permanently removes all documents, templates, and settings stored
              on this device.
            </p>
          </div>
        </div>
        <Button variant='destructive' size='sm' onClick={handleDeleteAllData}>
          Delete all data
        </Button>
      </div>
    </div>
  );
});
