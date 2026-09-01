import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { ComparisonPair, ServiceCategory } from '../../types/cloud';
import { Link2 } from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';

interface PairLinkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPair?: ComparisonPair;
}

export const PairLinkerModal: React.FC<PairLinkerModalProps> = ({
  isOpen,
  onClose,
  initialPair
}) => {
  const { services, savePair } = useCloudData();

  const azureServices = services.filter(s => s.platform === 'azure');
  const awsServices = services.filter(s => s.platform === 'aws');

  const [azureServiceId, setAzureServiceId] = useState(initialPair?.azureServiceId || azureServices[0]?.id || '');
  const [awsServiceId, setAwsServiceId] = useState(initialPair?.awsServiceId || awsServices[0]?.id || '');
  const [category, setCategory] = useState<ServiceCategory>(initialPair?.category || 'Compute');
  const [summaryOfDifferences, setSummaryOfDifferences] = useState(
    initialPair?.summaryOfDifferences || ''
  );
  const [keyVerdict, setKeyVerdict] = useState(initialPair?.keyVerdict || '');
  const [featured, setFeatured] = useState(initialPair?.featured || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!azureServiceId || !awsServiceId || !summaryOfDifferences.trim()) return;

    const azureService = services.find(s => s.id === azureServiceId);

    const pairData: ComparisonPair = {
      id: initialPair?.id || `pair-${azureServiceId}-${awsServiceId}`,
      azureServiceId,
      awsServiceId,
      category: category || azureService?.category || 'Compute',
      summaryOfDifferences: summaryOfDifferences.trim(),
      keyVerdict: keyVerdict.trim() || undefined,
      featured
    };

    savePair(pairData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPair ? 'Edit Service Pair Comparison' : 'Link Azure & AWS Service Pair'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold text-[#0078D4] uppercase tracking-wider mb-2">
              Azure Service *
            </label>
            <select
              value={azureServiceId}
              onChange={e => {
                setAzureServiceId(e.target.value);
                const match = azureServices.find(s => s.id === e.target.value);
                if (match) setCategory(match.category);
              }}
              className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
            >
              {azureServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.serviceName} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FF9900] uppercase tracking-wider mb-2">
              AWS Counterpart Service *
            </label>
            <select
              value={awsServiceId}
              onChange={e => setAwsServiceId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
            >
              {awsServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.serviceName} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Executive Summary of Key Differences *
          </label>
          <textarea
            rows={4}
            placeholder="High level comparison highlighting trade-offs, architecture differences, and storage/compute scaling models..."
            value={summaryOfDifferences}
            onChange={e => setSummaryOfDifferences(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Architect's Verdict / Recommendation
          </label>
          <input
            type="text"
            placeholder="e.g. Choose AWS S3 for universal tooling; choose Azure Blob Storage for native ADLS Gen2 analytics."
            value={keyVerdict}
            onChange={e => setKeyVerdict(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featuredPair"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="featuredPair" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            Feature this pair on the Home Page hero grid
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-blue-600 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" /> Save Comparison Pair
          </button>
        </div>
      </form>
    </Modal>
  );
};
