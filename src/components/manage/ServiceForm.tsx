import React, { useState } from 'react';
import type { ServiceEntry, Platform, ServiceCategory, ConfigOption } from '../../types/cloud';
import { MarkdownViewer } from '../common/MarkdownViewer';
import { Plus, Trash2, Eye, Edit3, Save, X } from 'lucide-react';

interface ServiceFormProps {
  initialData?: ServiceEntry;
  existingServices: ServiceEntry[];
  onSave: (service: ServiceEntry) => void;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  existingServices,
  onSave,
  onCancel
}) => {
  const [platform, setPlatform] = useState<Platform>(initialData?.platform || 'azure');
  const [serviceName, setServiceName] = useState(initialData?.serviceName || '');
  const [category, setCategory] = useState<ServiceCategory>(initialData?.category || 'Compute');
  const [description, setDescription] = useState(initialData?.description || '');
  const [pricingModel, setPricingModel] = useState(initialData?.pricingModel || '');
  const [documentationLink, setDocumentationLink] = useState(initialData?.documentationLink || '');
  const [equivalentServiceId, setEquivalentServiceId] = useState(initialData?.equivalentServiceId || '');

  // Dynamic Lists
  const [keyFeatures, setKeyFeatures] = useState<string[]>(
    initialData?.keyFeatures || ['']
  );
  const [useCases, setUseCases] = useState<string[]>(
    initialData?.useCases || ['']
  );
  const [limitations, setLimitations] = useState<string[]>(
    initialData?.limitations || ['']
  );

  // Config Options Key-Value Array
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>(
    initialData?.configOptions || [
      { name: '', description: '', defaultValue: '' }
    ]
  );

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const categories: ServiceCategory[] = [
    'Compute',
    'Storage',
    'Database',
    'Networking',
    'Containers',
    'AI / ML'
  ];

  const counterpartOptions = existingServices.filter(
    s => s.platform !== platform
  );

  // Handlers for dynamic lists
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...keyFeatures];
    updated[index] = val;
    setKeyFeatures(updated);
  };
  const addFeature = () => setKeyFeatures([...keyFeatures, '']);
  const removeFeature = (index: number) => setKeyFeatures(keyFeatures.filter((_, i) => i !== index));

  const handleUseCaseChange = (index: number, val: string) => {
    const updated = [...useCases];
    updated[index] = val;
    setUseCases(updated);
  };
  const addUseCase = () => setUseCases([...useCases, '']);
  const removeUseCase = (index: number) => setUseCases(useCases.filter((_, i) => i !== index));

  const handleLimitationChange = (index: number, val: string) => {
    const updated = [...limitations];
    updated[index] = val;
    setLimitations(updated);
  };
  const addLimitation = () => setLimitations([...limitations, '']);
  const removeLimitation = (index: number) => setLimitations(limitations.filter((_, i) => i !== index));

  // Handlers for Config Options
  const handleConfigChange = (index: number, field: keyof ConfigOption, val: string) => {
    const updated = [...configOptions];
    updated[index] = { ...updated[index], [field]: val };
    setConfigOptions(updated);
  };
  const addConfigOption = () =>
    setConfigOptions([...configOptions, { name: '', description: '', defaultValue: '' }]);
  const removeConfigOption = (index: number) =>
    setConfigOptions(configOptions.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !description.trim()) return;

    const id =
      initialData?.id ||
      `${platform}-${serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const newService: ServiceEntry = {
      id,
      platform,
      serviceName: serviceName.trim(),
      category,
      description: description.trim(),
      keyFeatures: keyFeatures.filter(f => f.trim() !== ''),
      pricingModel: pricingModel.trim() || 'Pay-as-you-go',
      configOptions: configOptions.filter(c => c.name.trim() !== ''),
      equivalentServiceId: equivalentServiceId || undefined,
      useCases: useCases.filter(u => u.trim() !== ''),
      limitations: limitations.filter(l => l.trim() !== ''),
      documentationLink: documentationLink.trim() || undefined
    };

    onSave(newService);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-xs">
      {/* Platform & Basic Meta */}
      <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          Platform & Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cloud Platform *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlatform('azure')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all ${
                  platform === 'azure'
                    ? 'bg-[#0078D4] text-white border-[#0078D4]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                Azure
              </button>
              <button
                type="button"
                onClick={() => setPlatform('aws')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all ${
                  platform === 'aws'
                    ? 'bg-[#FF9900] text-white border-[#FF9900]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                AWS
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Service Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Azure Blob Storage or AWS S3"
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Domain / Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ServiceCategory)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Link Counterpart Equivalent Service
            </label>
            <select
              value={equivalentServiceId}
              onChange={e => setEquivalentServiceId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="">-- None Linked --</option>
              {counterpartOptions.map(s => (
                <option key={s.id} value={s.id}>
                  {s.platform.toUpperCase()}: {s.serviceName} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Documentation URL
            </label>
            <input
              type="url"
              placeholder="https://learn.microsoft.com/... or https://docs.aws.amazon.com/..."
              value={documentationLink}
              onChange={e => setDocumentationLink(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Description & Real-time Markdown Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Overview & Architecture Description (Markdown Supported) *
          </label>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-500" /> Preview
            </button>
          </div>
        </div>

        {activeTab === 'edit' ? (
          <textarea
            rows={8}
            required
            placeholder="Write a clear, technical overview using Markdown formatting..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 font-mono text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        ) : (
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl min-h-[160px]">
            <MarkdownViewer content={description || '*No description provided yet.*'} />
          </div>
        )}
      </div>

      {/* Pricing Model & Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pricing Architecture Summary
          </label>
          <textarea
            rows={4}
            placeholder="e.g. Pay-per-GB per month + API requests + outbound data transfer..."
            value={pricingModel}
            onChange={e => setPricingModel(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Key Capabilities / Features
            </label>
            <button
              type="button"
              onClick={addFeature}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Bullet
            </button>
          </div>
          <div className="space-y-2">
            {keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Feature bullet point..."
                  value={feat}
                  onChange={e => handleFeatureChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                />
                {keyFeatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Use Cases */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Ideal Use Cases
            </label>
            <button
              type="button"
              onClick={addUseCase}
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Use Case
            </button>
          </div>
          <div className="space-y-2">
            {useCases.map((uc, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Big Data Analytics & Data Lakes"
                  value={uc}
                  onChange={e => handleUseCaseChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                />
                {useCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUseCase(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Limitations & Technical Constraints
            </label>
            <button
              type="button"
              onClick={addLimitation}
              className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Constraint
            </button>
          </div>
          <div className="space-y-2">
            {limitations.map((lim, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Max single block size is 5 TB"
                  value={lim}
                  onChange={e => handleLimitationChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                />
                {limitations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLimitation(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Matrix Key-Value Editor Table */}
      <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
              Configuration Matrix Settings Table ({configOptions.length} keys)
            </h3>
            <p className="text-xs text-slate-500">
              Define setting key names, descriptions, and default values to be aligned with the counterpart service
            </p>
          </div>
          <button
            type="button"
            onClick={addConfigOption}
            className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Config Key
          </button>
        </div>

        <div className="space-y-3">
          {configOptions.map((opt, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl items-center"
            >
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Option Name (e.g. Redundancy)"
                  value={opt.name}
                  onChange={e => handleConfigChange(idx, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Description..."
                  value={opt.description}
                  onChange={e => handleConfigChange(idx, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Default Value (e.g. LRS)"
                  value={opt.defaultValue}
                  onChange={e => handleConfigChange(idx, 'defaultValue', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeConfigOption(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Service Entry
        </button>
      </div>
    </form>
  );
};
