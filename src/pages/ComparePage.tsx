import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCloudData } from '../context/CloudDataContext';
import { useAuth } from '../context/AuthContext';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { ConfigDifferencesTable } from '../components/compare/ConfigDifferencesTable';
import { SummaryCallout } from '../components/compare/SummaryCallout';
import { IacSnippetsViewer } from '../components/compare/IacSnippetsViewer';
import { CostEstimatorWidget } from '../components/compare/CostEstimatorWidget';
import {
  Columns2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Layers,
  ArrowLeftRight,
  Share2,
  Check
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { services, getService, getPair } = useCloudData();
  const { isAdmin } = useAuth();

  const azureServices = services.filter(s => s.platform === 'azure');
  const awsServices = services.filter(s => s.platform === 'aws');

  const paramAzure = searchParams.get('azure');
  const paramAws = searchParams.get('aws');

  const [selectedAzureId, setSelectedAzureId] = useState<string>(
    paramAzure && azureServices.some(s => s.id === paramAzure)
      ? paramAzure
      : azureServices[0]?.id || ''
  );

  const [selectedAwsId, setSelectedAwsId] = useState<string>(
    paramAws && awsServices.some(s => s.id === paramAws)
      ? paramAws
      : awsServices[0]?.id || ''
  );

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (paramAzure && azureServices.some(s => s.id === paramAzure)) {
      setSelectedAzureId(paramAzure);
    }
    if (paramAws && awsServices.some(s => s.id === paramAws)) {
      setSelectedAwsId(paramAws);
    }
  }, [paramAzure, paramAws, services]);

  const handleSelectAzure = (id: string) => {
    setSelectedAzureId(id);
    const azureServ = getService(id);
    if (azureServ?.equivalentServiceId) {
      setSelectedAwsId(azureServ.equivalentServiceId);
      setSearchParams({ azure: id, aws: azureServ.equivalentServiceId });
    } else {
      setSearchParams({ azure: id, aws: selectedAwsId });
    }
  };

  const handleSelectAws = (id: string) => {
    setSelectedAwsId(id);
    const awsServ = getService(id);
    if (awsServ?.equivalentServiceId) {
      setSelectedAzureId(awsServ.equivalentServiceId);
      setSearchParams({ azure: awsServ.equivalentServiceId, aws: id });
    } else {
      setSearchParams({ azure: selectedAzureId, aws: id });
    }
  };

  const azureService = getService(selectedAzureId);
  const awsService = getService(selectedAwsId);
  const currentPair =
    selectedAzureId && selectedAwsId ? getPair(selectedAzureId, selectedAwsId) : undefined;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Header & Pair Selector Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 mb-2">
              <Columns2 className="w-3.5 h-3.5 text-blue-500" /> Side-by-Side Spec Inspector
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {azureService?.serviceName || 'Azure Service'} <span className="text-slate-400 font-normal">vs</span>{' '}
              {awsService?.serviceName || 'AWS Service'}
            </h1>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer self-start md:self-auto"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" /> Link Copied to Clipboard
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> Share Comparison URL
              </>
            )}
          </button>
        </div>

        {/* Dropdown Selectors for Azure Left & AWS Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 items-center">
          {/* Azure Dropdown */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-[#0078D4] uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#0078D4]" />
              Select Azure Service
            </label>
            <select
              value={selectedAzureId}
              onChange={e => handleSelectAzure(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 shadow-xs focus:ring-2 focus:ring-[#0078D4] outline-none"
            >
              {azureServices.map(s => (
                <option key={s.id} value={s.id}>
                  Azure: {s.serviceName} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Indicator Icon */}
          <div className="md:col-span-2 flex justify-center text-slate-400">
            <div className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* AWS Dropdown */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-[#FF9900] uppercase tracking-wider flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
              Select AWS Service
            </label>
            <select
              value={selectedAwsId}
              onChange={e => handleSelectAws(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 shadow-xs focus:ring-2 focus:ring-[#FF9900] outline-none"
            >
              {awsServices.map(s => (
                <option key={s.id} value={s.id}>
                  AWS: {s.serviceName} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Executive Summary Callout Box */}
      {currentPair ? (
        <SummaryCallout
          azureServiceName={azureService?.serviceName || 'Azure'}
          awsServiceName={awsService?.serviceName || 'AWS'}
          summary={currentPair.summaryOfDifferences}
          verdict={currentPair.keyVerdict}
        />
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs text-amber-800 dark:text-amber-300 font-mono flex items-center justify-between">
          <span>
            Custom selection: No pre-written executive summary pair exists for this specific combination yet.
          </span>
          {isAdmin && (
            <Link
              to="/manage"
              className="font-bold underline text-amber-900 dark:text-amber-200 ml-2"
            >
              Create Pair Summary in Manager
            </Link>
          )}
        </div>
      )}

      {/* Main 2-Column Side-by-Side Comparison Container */}
      {azureService && awsService ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Azure Service (#0078D4 Header Tag) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#0078D4]/40 dark:border-[#0078D4]/50 shadow-md overflow-hidden flex flex-col justify-between">
              <div>
                {/* Azure Column Header */}
                <div className="p-6 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border-b border-[#0078D4]/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <PlatformBadge platform="azure" size="lg" />
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight pt-1">
                      {azureService.serviceName}
                    </h2>
                  </div>
                  <CategoryBadge category={azureService.category} />
                </div>

                <div className="p-6 space-y-6 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {/* Overview Markdown */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0078D4] font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Overview & Key Concepts
                    </h4>
                    <MarkdownViewer content={azureService.description} />
                  </div>

                  {/* Key Features */}
                  <div className="pt-6 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Key Features
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {azureService.keyFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Model */}
                  <div className="pt-6 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Pricing Architecture
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      {azureService.pricingModel}
                    </p>
                  </div>

                  {/* Primary Use Cases */}
                  <div className="pt-6 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Ideal Use Cases
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {azureService.useCases.map((uc, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/60 text-[#0078D4] dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60"
                        >
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Limitations */}
                  {azureService.limitations && azureService.limitations.length > 0 && (
                    <div className="pt-6 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Limitations & Constraints
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {azureService.limitations.map((lim, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentation Footer Link */}
              {azureService.documentationLink && (
                <div className="p-4 bg-sky-50/50 dark:bg-sky-950/40 border-t border-sky-100 dark:border-sky-900/60 text-center">
                  <a
                    href={azureService.documentationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0078D4] hover:underline"
                  >
                    Official Azure Documentation <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: AWS Service (#FF9900 Header Tag) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#FF9900]/40 dark:border-[#FF9900]/50 shadow-md overflow-hidden flex flex-col justify-between">
              <div>
                {/* AWS Column Header */}
                <div className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-[#FF9900]/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <PlatformBadge platform="aws" size="lg" />
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight pt-1">
                      {awsService.serviceName}
                    </h2>
                  </div>
                  <CategoryBadge category={awsService.category} />
                </div>

                <div className="p-6 space-y-6 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {/* Overview Markdown */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF9900] font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Overview & Key Concepts
                    </h4>
                    <MarkdownViewer content={awsService.description} />
                  </div>

                  {/* Key Features */}
                  <div className="pt-6 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Key Features
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {awsService.keyFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900] mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Model */}
                  <div className="pt-6 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Pricing Architecture
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      {awsService.pricingModel}
                    </p>
                  </div>

                  {/* Primary Use Cases */}
                  <div className="pt-6 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Ideal Use Cases
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {awsService.useCases.map((uc, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                        >
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Limitations */}
                  {awsService.limitations && awsService.limitations.length > 0 && (
                    <div className="pt-6 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Limitations & Constraints
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {awsService.limitations.map((lim, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentation Footer Link */}
              {awsService.documentationLink && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/40 border-t border-amber-100 dark:border-amber-900/60 text-center">
                  <a
                    href={awsService.documentationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:underline"
                  >
                    Official AWS Documentation <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Sizing & Cost Estimator Widget */}
          <CostEstimatorWidget azureService={azureService} awsService={awsService} />

          {/* Infrastructure-as-Code (IaC) Snippets Viewer */}
          <IacSnippetsViewer azureService={azureService} awsService={awsService} />

          {/* Dedicated Configuration Differences Table */}
          <ConfigDifferencesTable
            azureConfigs={azureService.configOptions}
            awsConfigs={awsService.configOptions}
            azureServiceName={azureService.serviceName}
            awsServiceName={awsService.serviceName}
          />
        </div>
      ) : null}
    </div>
  );
};
