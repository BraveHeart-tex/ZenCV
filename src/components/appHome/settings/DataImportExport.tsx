'use client';
import { observer } from 'mobx-react-lite';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { clientDb } from '@/lib/client-db/clientDb';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';

const DataImportExport = observer(() => {
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // Clear existing data
      await clientDb.delete();
      await clientDb.open();

      // Import data for each table
      if (data.documents) await clientDb.documents.bulkPut(data.documents);
      if (data.sections) await clientDb.sections.bulkPut(data.sections);
      if (data.items) await clientDb.items.bulkPut(data.items);
      if (data.fields) await clientDb.fields.bulkPut(data.fields);
      if (data.settings) await clientDb.settings.bulkPut(data.settings);

      showSuccessToast('Data imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      showErrorToast('Failed to import data. Please check the file format.');
    }

    // Reset the input
    event.target.value = '';
  };

  const handleExport = async () => {
    try {
      const data = {
        documents: await clientDb.documents.toArray(),
        sections: await clientDb.sections.toArray(),
        items: await clientDb.items.toArray(),
        fields: await clientDb.fields.toArray(),
        settings: await clientDb.settings.toArray(),
      };

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
      showErrorToast('Failed to export data');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Data Import/Export</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="import">Import Data</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('import')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from JSON
            </Button>
            <input
              type="file"
              id="import"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Export Data</Label>
          <Button variant="outline" className="w-full" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export as JSON
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DataImportExport;
