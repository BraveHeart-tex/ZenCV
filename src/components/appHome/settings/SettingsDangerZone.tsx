'use client';
import { AlertCircle } from 'lucide-react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { showSuccessToast } from '@/components/ui/sonner';
import { clientDb } from '@/lib/client-db/clientDb';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

export const SettingsDangerZone = observer(() => {
  const handleDeleteAllData = async () => {
    confirmDialogStore.showDialog({
      title: 'Delete All Local Data',
      message:
        'Are you sure you want to delete all local data? This action cannot be undone.',
      confirmText: 'Delete',
      onConfirm: async () => {
        await clientDb.delete();
        await clientDb.open();
        showSuccessToast('All local data deleted successfully.');
        runInAction(() => {
          confirmDialogStore.hideDialog();
        });
      },
    });
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-destructive text-lg font-semibold'>Danger Zone</h2>
      <Alert variant='destructive'>
        <AlertCircle className='w-4 h-4' />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Deleting all local data will permanently remove all your documents,
          templates, and settings. This action cannot be undone.
        </AlertDescription>
      </Alert>
      <Button variant='destructive' onClick={handleDeleteAllData}>
        Delete All Local Data
      </Button>
    </div>
  );
});
