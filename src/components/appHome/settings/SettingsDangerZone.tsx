import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { Button } from '@/components/ui/button';
import { showSuccessToast } from '@/components/ui/sonner';
import { clientDb } from '@/lib/client-db/clientDb';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

export const SettingsDangerZone = () => {
  const handleDeleteAllData = () => {
    confirmDialogStore.showDialog({
      title: 'Delete all local data?',
      message:
        'Permanently deletes all resumes and editing preferences in this browser. Download a backup first if you want to keep them. This cannot be undone.',
      confirmText: 'Delete all data',
      destructive: true,
      errorMessage:
        'Local data could not be deleted. Your data is unchanged. Please try again.',
      pendingText: 'Deleting…',
      onConfirm: async () => {
        await clientDb.transaction('rw', clientDb.tables, async () => {
          for (const table of clientDb.tables) {
            await table.clear();
          }
        });
        showSuccessToast(
          'Resumes and editing preferences deleted from this browser.'
        );
        await confirmDialogStore.hideDialog();
      },
    });
  };
  return (
    <div className='space-y-2'>
      <SettingsSectionHeader title='Reset local data' />
      <SettingsRow
        stackOnMobile
        label='Delete all local data'
        description='Permanently removes all resumes and editing preferences in this browser.'
      >
        <Button
          variant='outline'
          className='min-h-11 text-destructive hover:text-destructive'
          onClick={handleDeleteAllData}
        >
          Delete all data
        </Button>
      </SettingsRow>
    </div>
  );
};
