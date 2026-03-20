import { Download, Upload } from 'lucide-react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { SettingsSectionHeader } from '@/components/appHome/settings/SettingsShared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { clientDb } from '@/lib/client-db/clientDb';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

export const DataImportExport = observer(() => {
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      const requiredTables = [
        'documents',
        'sections',
        'items',
        'fields',
        'settings',
      ];
      const missingTables = requiredTables.filter((table) => !data[table]);
      if (missingTables.length > 0) {
        throw new Error(`Missing required tables: ${missingTables.join(', ')}`);
      }
      await clientDb.delete();
      await clientDb.open();
      await clientDb.transaction(
        'rw',
        [
          clientDb.documents,
          clientDb.sections,
          clientDb.items,
          clientDb.fields,
          clientDb.settings,
        ],
        async () => {
          await Promise.all([
            clientDb.documents.bulkPut(data.documents),
            clientDb.sections.bulkPut(data.sections),
            clientDb.items.bulkPut(data.items),
            clientDb.fields.bulkPut(data.fields),
            clientDb.settings.bulkPut(data.settings),
          ]);
        }
      );
      showSuccessToast('Data imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      showErrorToast(
        error instanceof Error
          ? `Failed to import: ${error.message}`
          : 'Failed to import data. Please check the file format.'
      );
    }
    event.target.value = '';
  };

  const handleExport = async () => {
    try {
      const [documents, sections, items, fields, settings] = await Promise.all([
        clientDb.documents.toArray(),
        clientDb.sections.toArray(),
        clientDb.items.toArray(),
        clientDb.fields.toArray(),
        clientDb.settings.toArray(),
      ]);
      const blob = new Blob(
        [
          JSON.stringify(
            { documents, sections, items, fields, settings },
            null,
            2
          ),
        ],
        {
          type: 'application/json',
        }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'zen-cv-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccessToast('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      showErrorToast(
        error instanceof Error
          ? `Failed to export: ${error.message}`
          : 'Failed to export data'
      );
    }
  };

  return (
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='Data'
        description='Export your data as a backup or import it on another device.'
      />
      <div className='grid sm:grid-cols-2 gap-3'>
        <div className='rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3'>
          <div className='space-y-0.5'>
            <p className='text-sm font-medium'>Export</p>
            <p className='text-xs text-muted-foreground'>
              Download all your data as a JSON file.
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='w-full gap-2'
            onClick={handleExport}
          >
            <Download className='w-4 h-4' />
            Export as JSON
          </Button>
        </div>

        <div className='rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3'>
          <div className='space-y-0.5'>
            <p className='text-sm font-medium'>Import</p>
            <p className='text-xs text-muted-foreground'>
              Restore from a previously exported file.
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='w-full gap-2'
            onClick={() => importInputRef.current?.click()}
          >
            <Upload className='w-4 h-4' />
            Import from JSON
          </Button>
          <Input
            ref={importInputRef}
            type='file'
            id='import'
            accept='.json'
            className='hidden'
            onChange={action((event) => {
              if (!event.target.files?.[0]) return;
              confirmDialogStore.showDialog({
                title: 'Import data',
                message:
                  'This will replace all your current data and cannot be undone. Continue?',
                confirmText: 'Import',
                async onConfirm() {
                  await handleImport(event);
                  runInAction(() => confirmDialogStore.hideDialog());
                },
                onClose() {
                  event.target.value = '';
                },
              });
            })}
          />
        </div>
      </div>
    </div>
  );
});
