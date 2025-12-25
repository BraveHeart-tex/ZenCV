'use client';
import { Download, Upload } from 'lucide-react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        throw new Error(
          `Uploaded data is missing required tables: ${missingTables.join(', ')}`
        );
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
          ? `Failed to import data: ${error.message}`
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

      const data = { documents, sections, items, fields, settings };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
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
          ? `Failed to export data: ${error.message}`
          : 'Failed to export data'
      );
    }
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Data Import/Export</h2>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='import'>Import Data</Label>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                if (importInputRef.current) {
                  importInputRef.current.click();
                }
              }}
            >
              <Upload className='w-4 h-4 mr-2' />
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
                  title: 'Importing Data',
                  message:
                    'Importing will replace your current data and cannot be undone. Do you want to continue?',
                  confirmText: 'Yes',
                  async onConfirm() {
                    await handleImport(event);
                    runInAction(() => {
                      confirmDialogStore.hideDialog();
                    });
                  },
                  onClose() {
                    event.target.value = '';
                  },
                });
              })}
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label>Export Data</Label>
          <Button variant='outline' className='w-full' onClick={handleExport}>
            <Download className='w-4 h-4 mr-2' />
            Export as JSON
          </Button>
        </div>
      </div>
    </div>
  );
});
