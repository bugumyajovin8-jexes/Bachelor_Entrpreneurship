import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { storage } from '../services/storage';

export const BackupManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup_sim_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (storage.importData(content)) {
        alert('Progress restored successfully! The page will now reload.');
        window.location.reload();
      } else {
        alert('Failed to import data. The file might be corrupted.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2 p-4 border-t border-gray-200">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Download size={16} />
        Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Upload size={16} />
        Import
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};
