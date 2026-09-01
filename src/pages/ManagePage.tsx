import React, { useState } from 'react';
import { useCloudData } from '../context/CloudDataContext';
import { ServiceForm } from '../components/manage/ServiceForm';
import { BulkImportModal } from '../components/manage/BulkImportModal';
import { PairLinkerModal } from '../components/manage/PairLinkerModal';
import { ChangePasswordModal } from '../components/auth/ChangePasswordModal';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import type { ServiceEntry, ComparisonPair } from '../types/cloud';
import {
  PlusCircle,
  Upload,
  Link2,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  Layers,
  Key
} from 'lucide-react';

export const ManagePage: React.FC = () => {
  const {
    services,
    pairs,
    saveService,
    deleteService,
    deletePair,
    resetToSeedData
  } = useCloudData();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [editingService, setEditingService] = useState<ServiceEntry | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPairModalOpen, setIsPairModalOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [editingPair, setEditingPair] = useState<ComparisonPair | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredServices = services.filter(
    s =>
      s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartCreate = () => {
    setEditingService(undefined);
    setActiveTab('create');
  };

  const handleStartEdit = (service: ServiceEntry) => {
    setEditingService(service);
    setActiveTab('edit');
  };

  const handleSaveService = (service: ServiceEntry) => {
    saveService(service);
    setStatusMessage(`Saved service "${service.serviceName}" successfully!`);
    setActiveTab('list');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteService(id);
      setStatusMessage(`Deleted service "${name}".`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleDeletePair = (pairId: string) => {
    if (confirm('Delete this comparison pair?')) {
      deletePair(pairId);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Page Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 mb-2">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Admin Content Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
            Service Entry & Pair Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add, update, or pair cloud services with real-time markdown preview and bulk JSON tool
          </p>
        </div>

        {/* Global Manager Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsChangePassOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Key className="w-4 h-4 text-amber-500" /> Change Passcode
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-500" /> Bulk Import / Export
          </button>
          <button
            onClick={() => {
              setEditingPair(undefined);
              setIsPairModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Link2 className="w-4 h-4 text-emerald-500" /> Link Service Pair
          </button>
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add New Service
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Tabs Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All Services ({services.length})
            </button>
            <button
              onClick={handleStartCreate}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              + Create Service
            </button>
            {activeTab === 'edit' && (
              <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs">
                Editing: {editingService?.serviceName}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm('Reset to original seed data?')) resetToSeedData();
            }}
            className="text-xs text-slate-400 hover:text-rose-500 inline-flex items-center gap-1 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Database
          </button>
        </div>

        {activeTab === 'create' || activeTab === 'edit' ? (
          <ServiceForm
            initialData={editingService}
            existingServices={services}
            onSave={handleSaveService}
            onCancel={() => setActiveTab('list')}
          />
        ) : (
          <div className="space-y-6">
            {/* Search filter for service table */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter manager entries..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Showing {filteredServices.length} of {services.length} services
              </div>
            </div>

            {/* Services Management Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono uppercase">
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Service Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Linked Counterpart</th>
                    <th className="py-3 px-4">Configs</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredServices.map(service => (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <PlatformBadge platform={service.platform} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {service.serviceName}
                      </td>
                      <td className="py-3 px-4">
                        <CategoryBadge category={service.category} />
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                        {service.equivalentServiceId || (
                          <span className="text-slate-300 dark:text-slate-700 italic">Unlinked</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {service.configOptions.length} keys
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleStartEdit(service)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id, service.serviceName)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Existing Comparison Pairs Table */}
            <div className="pt-6 space-y-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
                  Linked Service Pair Summaries ({pairs.length})
                </h3>
                <button
                  onClick={() => {
                    setEditingPair(undefined);
                    setIsPairModalOpen(true);
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  + Add Pair Summary
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono uppercase">
                      <th className="py-3 px-4">Azure ID</th>
                      <th className="py-3 px-4">AWS ID</th>
                      <th className="py-3 px-4">Executive Summary</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pairs.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 px-4 font-bold text-[#0078D4] font-mono">
                          {p.azureServiceId}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FF9900] font-mono">
                          {p.awsServiceId}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 line-clamp-2">
                          {p.summaryOfDifferences}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingPair(p);
                              setIsPairModalOpen(true);
                            }}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePair(p.id)}
                            className="text-rose-500 hover:underline font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BulkImportModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} />
      <PairLinkerModal
        isOpen={isPairModalOpen}
        onClose={() => setIsPairModalOpen(false)}
        initialPair={editingPair}
      />
      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
      />
    </div>
  );
};
