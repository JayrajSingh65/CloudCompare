import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCloudData } from '../context/CloudDataContext';
import { ComparisonCard } from '../components/compare/ComparisonCard';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import {
  Search,
  ArrowRight,
  Columns2,
  TableProperties,
  Sparkles,
  Zap,
  ShieldCheck
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

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section - Technical Reference Docs Aesthetic */}
      <section className="relative overflow-hidden pt-8 pb-12 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Azure <span className="text-[#0078D4]">#0078D4</span> vs AWS <span className="text-[#FF9900]">#FF9900</span> Specs Engine
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Cloud Architecture, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-amber-300">
              Side by Side.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The definitive precision reference tool for cloud engineers and software architects comparing equivalent Azure and AWS services, configuration options, and pricing models.
          </p>

          {/* Live Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
          >
            <div className="flex items-center pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by service or concept (e.g. S3, Functions, Blob, EC2, NoSQL)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent text-white placeholder-slate-400 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Platform Stats */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <PlatformBadge platform="azure" size="sm" />
              <span>{azureCount} Azure Services</span>
            </div>
            <div className="flex items-center gap-2">
              <PlatformBadge platform="aws" size="sm" />
              <span>{awsCount} AWS Services</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Columns2 className="w-4 h-4 text-blue-400" />
              <span>{pairs.length} Comparison Pairs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Jump */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
            Browse Cloud Domains
          </h2>
          <Link
            to="/browse"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <CategoryBadge category={cat} className="mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {cat}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                {services.filter(s => s.category === cat).length} services
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Side-by-Side Comparison Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
              Featured Side-by-Side Comparisons
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated cloud service equivalencies with aligned technical specifications
            </p>
          </div>
          <Link
            to="/matrix"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <TableProperties className="w-3.5 h-3.5" /> Open Matrix View
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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#0078D4] flex items-center justify-center font-bold mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Aligned Configuration Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Spot exact configuration key name differences, default settings, and capability divergence in a clean side-by-side grid.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-[#FF9900] flex items-center justify-center font-bold mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Architect Decision Guidance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Concise executive summaries and architect recommendations detailing when to choose Azure vs AWS for specific workloads.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Content Editor & Bulk Importer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Add custom services, modify existing specs, preview markdown in real-time, or bulk import custom JSON/CSV service definitions.
          </p>
        </div>
      </section>
    </div>
  );
};
