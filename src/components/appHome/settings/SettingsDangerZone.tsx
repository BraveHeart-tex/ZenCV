import { Trash2 } from 'lucide-react';
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
    <section id='reset' tabIndex={-1} className='space-y-5'>
      <SettingsSectionHeader
        title='Reset local data'
        description='This permanently deletes resumes and editing preferences stored in this browser.'
      />
      <SettingsRow
        stackOnMobile
        destructive
        icon={Trash2}
        label='Delete all local data'
        description='You will be asked to confirm before anything is removed.'
      >
        <Button
          variant='outline'
          className='min-h-11 w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto'
          onClick={handleDeleteAllData}
        >
          <Trash2 aria-hidden='true' />
          Delete all data
        </Button>
      </SettingsRow>
    </section>
  );
};
