import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCloudData } from '../context/CloudDataContext';
import { ComparisonCard } from '../components/compare/ComparisonCard';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import type { ServiceCategory } from '../types/cloud';
import {
  Search,
  ArrowRight,
  Columns2,
  TableProperties,
  Zap,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Layers,
  Cpu,
  Database,
  HardDrive
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { services, pairs, getService, categories } = useCloudData();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPairs = pairs.filter(p => p.featured).slice(0, 6);
  const displayPairs = featuredPairs.length > 0 ? featuredPairs : pairs.slice(0, 6);

  const azureCount = services.filter(s => s.platform === 'azure').length;
  const awsCount = services.filter(s => s.platform === 'aws').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const domainPills: { label: string; cat: ServiceCategory; icon: React.ReactNode }[] = [
    { label: 'Compute & VM', cat: 'Compute', icon: <Cpu className="w-3.5 h-3.5 text-sky-400" /> },
    { label: 'Storage & Blob', cat: 'Storage', icon: <HardDrive className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Database & SQL', cat: 'Database', icon: <Database className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Security & Identity', cat: 'Security', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Premium Mesh Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800/80 shadow-2xl p-8 sm:p-14">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0078D4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF9900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[#0078D4] font-bold">Azure #0078D4</span>
            <span className="text-slate-500">vs</span>
            <span className="text-[#FF9900] font-bold">AWS #FF9900</span>
            <span className="text-slate-400">• Multi-Cloud Specs Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Cloud Architecture, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-amber-400">
              Side-by-Side Reference.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The definitive technical directory for cloud engineers, solution architects, and DevOps teams comparing equivalent Azure and AWS services and configuration specs.
          </p>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl focus-within:ring-2 focus-within:ring-blue-500/80 transition-all"
          >
            <div className="flex items-center pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by service or concept (e.g. S3, Functions, Blob, EC2, NoSQL)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-transparent text-white placeholder-slate-400 outline-none font-sans"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-xs text-white transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
            >
              Search Specs <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Domain Quick Jump Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-mono mr-1">Popular:</span>
            {domainPills.map(item => (
              <button
                key={item.cat}
                onClick={() => navigate(`/browse?category=${encodeURIComponent(item.cat)}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Stats Counters Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <PlatformBadge platform="azure" size="sm" />
              <span className="font-bold text-white">{azureCount}</span> Azure Services
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <PlatformBadge platform="aws" size="sm" />
              <span className="font-bold text-white">{awsCount}</span> AWS Services
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-slate-800 text-sky-300">
              <Columns2 className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">{pairs.length}</span> Comparison Pairs
            </div>
          </div>
        </div>
      </section>

      {/* Category Domain Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" /> Browse Cloud Domains
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore Azure vs AWS services categorized by architectural domain
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => {
            const count = services.filter(s => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all text-left group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <CategoryBadge category={cat} className="mb-3" />
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {count} {count === 1 ? 'service' : 'services'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Comparisons Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
              Featured Side-by-Side Comparisons
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated cloud service equivalencies with aligned technical specifications
            </p>
          </div>
          <Link
            to="/matrix"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
          >
            <TableProperties className="w-4 h-4 text-blue-500" /> Open Full Matrix
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPairs.map(pair => {
            const azureService = getService(pair.azureServiceId);
            const awsService = getService(pair.awsServiceId);
            return (
              <ComparisonCard
                key={pair.id}
                pair={pair}
                azureService={azureService}
                awsService={awsService}
              />
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md hover:shadow-xl transition-all">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-[#0078D4] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-mono">
            Aligned Configuration Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Spot exact configuration key name differences, default settings, and capability divergence in a clean side-by-side spec grid.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md hover:shadow-xl transition-all">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-[#FF9900] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-mono">
            Architect Decision Guidance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Concise executive summaries and architect recommendations detailing when to choose Azure vs AWS for specific enterprise workloads.
          </p>
        </div>
      </section>
    </div>
  );
};
