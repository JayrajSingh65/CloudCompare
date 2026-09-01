import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useCloudData } from '../../context/CloudDataContext';
import { Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const { exportData, importData } = useCloudData();
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(
    null
  );

  const handleExportDownload = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudcompare-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!jsonText.trim()) return;
    const result = importData(jsonText);
    setImportStatus(result);
    if (result.success) {
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk JSON Data Import & Backup" maxWidth="lg">
      <div className="space-y-6 text-xs">
        {/* Export Backup Section */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Backup Current Database
            </h4>
            <p className="text-slate-500">
              Download all service definitions and linked comparison pairs as a standard JSON file.
            </p>
          </div>
          <button
            onClick={handleExportDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" /> Export JSON Backup
          </button>
        </div>

        {/* Import JSON Payload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-900 dark:text-slate-100">
              Import Services / Pairs JSON Payload
            </label>
            <label className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={8}
            placeholder="Paste raw JSON service array or backup payload here..."
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Alert */}
        {importStatus && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteImport}
            disabled={!jsonText.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-blue-600 dark:hover:bg-blue-400 dark:hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Execute Import
          </button>
        </div>
      </div>
    </Modal>
  );
};
