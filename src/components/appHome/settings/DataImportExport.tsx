import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { SettingsSectionHeader } from '@/components/appHome/settings/SettingsShared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccessToast } from '@/components/ui/sonner';
import {
  readBackup,
  restoreBackup,
  validateBackup,
} from '@/lib/client-db/backupService';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

export const DataImportExport = () => {
  const importInputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [pending, setPending] = useState<'download' | 'validate' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setPending('download');
    setError(null);
    try {
      const backup = await readBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      try {
        link.href = url;
        link.download = 'zen-cv-data.json';
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();
        URL.revokeObjectURL(url);
      }
      showSuccessToast('Backup downloaded');
    } catch {
      setError(
        'Could not download your backup. Your data is unchanged. Try downloading again.'
      );
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || busyRef.current) {
      return;
    }
    busyRef.current = true;
    setPending('validate');
    setError(null);
    try {
      const input: unknown = JSON.parse(await file.text());
      const backup = validateBackup(input);
      const count = backup.documents.length;
      confirmDialogStore.showDialog({
        title: 'Restore backup?',
        message: `${file.name} contains ${count} resume${count === 1 ? '' : 's'} and ${backup.sections.length} sections. Restoring replaces all resumes and editing preferences in this browser. Download a backup of your current work first if you want to keep it.`,
        confirmText: 'Restore backup',
        destructive: true,
        pendingText: 'Restoring...',
        errorMessage:
          'Backup could not be restored. Your current data is unchanged. Try again or choose another backup.',
        async onConfirm() {
          try {
            await restoreBackup(backup);
            showSuccessToast('Backup restored');
            confirmDialogStore.hideDialog();
          } catch {
            throw new Error(
              'Could not restore this backup. Your current data is unchanged. Try again, or cancel and choose another backup.'
            );
          }
        },
      });
    } catch (cause) {
      setError(
        cause instanceof SyntaxError
          ? 'This file is not a valid backup. Choose a JSON file downloaded from ZenCV. Your data is unchanged.'
          : cause instanceof Error
            ? `${cause.message} Your data is unchanged.`
            : 'Could not read this backup. Choose another file. Your data is unchanged.'
      );
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  };

  return (
    <section id='data' tabIndex={-1} className='space-y-5'>
      <SettingsSectionHeader
        title='Backups and transfer'
        description='Download all resumes and editing preferences as a JSON file, or restore them in this browser.'
      />
      <div className='divide-y divide-border/60 border-y border-border/60'>
        <div className='flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Download backup</p>
            <p className='text-sm text-muted-foreground'>
              Creates one JSON file with all resumes and editing preferences in
              this browser.
            </p>
          </div>
          <Button
            variant='default'
            className='min-h-11 w-full shrink-0 gap-2 sm:w-auto'
            disabled={pending !== null}
            onClick={handleExport}
          >
            <Download className='size-4' aria-hidden='true' />
            {pending === 'download' ? 'Downloading...' : 'Download backup'}
          </Button>
        </div>
        <div className='flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Restore backup</p>
            <p className='text-sm text-muted-foreground'>
              Replaces all resumes and editing preferences currently in this
              browser. Download a backup first if you want to keep them.
            </p>
          </div>
          <Button
            variant='outline'
            className='min-h-11 w-full shrink-0 gap-2 sm:w-auto'
            disabled={pending !== null}
            onClick={() => importInputRef.current?.click()}
          >
            <Upload className='size-4' aria-hidden='true' />
            {pending === 'validate'
              ? 'Checking backup...'
              : 'Choose backup file'}
          </Button>
          <Input
            ref={importInputRef}
            type='file'
            accept='.json,application/json'
            aria-label='Choose ZenCV backup'
            className='hidden'
            onChange={handleImport}
          />
        </div>
      </div>
      {error && (
        <p role='alert' className='text-sm text-destructive'>
          {error}
        </p>
      )}
    </section>
  );
};
