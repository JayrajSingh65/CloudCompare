import React, { useState } from 'react';
import type { ServiceEntry } from '../../types/cloud';
import { PlatformBadge } from '../common/PlatformBadge';
import { Calculator, Cpu, HardDrive, Network, TrendingDown, Layers } from 'lucide-react';

interface CostEstimatorWidgetProps {
  azureService: ServiceEntry;
  awsService: ServiceEntry;
}

export const CostEstimatorWidget: React.FC<CostEstimatorWidgetProps> = ({
  azureService,
  awsService
}) => {
  const [vcpu, setVcpu] = useState<number>(4);
  const [ramGb, setRamGb] = useState<number>(16);
  const [storageGb, setStorageGb] = useState<number>(200);
  const [transferGb, setTransferGb] = useState<number>(500);

  // Industry baseline hourly / monthly rate approximations for side-by-side estimations
  const azureHourlyCompute = vcpu * 0.024 + ramGb * 0.0035;
  const awsHourlyCompute = vcpu * 0.0252 + ramGb * 0.0034;

  const azureMonthlyCompute = azureHourlyCompute * 730;
  const awsMonthlyCompute = awsHourlyCompute * 730;

  const azureStorageCost = storageGb * 0.08; // Azure Managed Disk / Premium SSD ($0.08/GB)
  const awsStorageCost = storageGb * 0.088; // AWS EBS gp3 ($0.088/GB)

  const azureTransferCost = Math.max(0, transferGb - 100) * 0.087; // First 100GB free
  const awsTransferCost = Math.max(0, transferGb - 100) * 0.09;

  const azureTotalMonthly = Math.round(azureMonthlyCompute + azureStorageCost + azureTransferCost);
  const awsTotalMonthly = Math.round(awsMonthlyCompute + awsStorageCost + awsTransferCost);

  const diff = Math.abs(azureTotalMonthly - awsTotalMonthly);
  const cheaperPlatform = azureTotalMonthly <= awsTotalMonthly ? 'azure' : 'aws';
  const percentageSavings = Math.round((diff / Math.max(azureTotalMonthly, awsTotalMonthly)) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-mono">
              Interactive Sizing & Monthly Cost Estimator
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Adjust capacity sliders to calculate estimated monthly costs ($/mo) side-by-side for {azureService.serviceName} vs {awsService.serviceName}
          </p>
        </div>

        {/* Savings Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
          <TrendingDown className="w-4 h-4 text-emerald-500" />
          <span>
            {cheaperPlatform === 'azure' ? 'Azure' : 'AWS'} is ~{percentageSavings}% lower in this sizing profile
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
        {/* vCPU Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-500" /> Compute vCPUs
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">
              {vcpu} Cores
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="64"
            step="1"
            value={vcpu}
            onChange={e => setVcpu(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* RAM Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-500" /> Memory RAM
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400">
              {ramGb} GB
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="256"
            step="2"
            value={ramGb}
            onChange={e => setRamGb(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Storage Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-500" /> SSD Storage
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400">
              {storageGb} GB
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="2000"
            step="10"
            value={storageGb}
            onChange={e => setStorageGb(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>

        {/* Bandwidth Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Network className="w-4 h-4 text-emerald-500" /> Egress Traffic
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
              {transferGb} GB/mo
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={transferGb}
            onChange={e => setTransferGb(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Cost Cards Output Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Azure Monthly Cost Card */}
        <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-blue-950/40 border border-sky-200 dark:border-sky-800/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PlatformBadge platform="azure" />
            <span className="text-[11px] font-mono text-slate-400">Estimated Total</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[#0078D4] dark:text-sky-300 font-mono">
              ${azureTotalMonthly}
            </span>
            <span className="text-xs font-mono text-slate-400">/ month</span>
          </div>

          <div className="pt-3 border-t border-sky-100 dark:border-sky-900/60 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Compute ({vcpu} cores, {ramGb}GB RAM):</span>
              <span className="font-bold">${Math.round(azureMonthlyCompute)}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage ({storageGb}GB SSD):</span>
              <span className="font-bold">${Math.round(azureStorageCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Outbound Egress ({transferGb}GB):</span>
              <span className="font-bold">${Math.round(azureTransferCost)}</span>
            </div>
          </div>
        </div>

        {/* AWS Monthly Cost Card */}
        <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PlatformBadge platform="aws" />
            <span className="text-[11px] font-mono text-slate-400">Estimated Total</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[#FF9900] dark:text-amber-300 font-mono">
              ${awsTotalMonthly}
            </span>
            <span className="text-xs font-mono text-slate-400">/ month</span>
          </div>

          <div className="pt-3 border-t border-amber-100 dark:border-amber-900/60 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Compute ({vcpu} cores, {ramGb}GB RAM):</span>
              <span className="font-bold">${Math.round(awsMonthlyCompute)}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage ({storageGb}GB SSD):</span>
              <span className="font-bold">${Math.round(awsStorageCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Outbound Egress ({transferGb}GB):</span>
              <span className="font-bold">${Math.round(awsTransferCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
