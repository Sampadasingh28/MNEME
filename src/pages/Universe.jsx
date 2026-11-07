import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Compass, 
  Sparkles, 
  Layers, 
  RotateCcw,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { CASES } from '../data/casesData';
import CaseCard from '../components/CaseCard';
import { gnaniService } from '../services/gnaniService';

export default function Universe() {
  const [searchParams, setSearchParams] = useSearchParams();
  const domainQuery = searchParams.get('domain') || 'all';

  const [search, setSearch] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState(domainQuery);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (domainQuery) {
      setSelectedUniverse(domainQuery);
    }
  }, [domainQuery]);

  const handleUniverseChange = (id) => {
    gnaniService.playAudioFeedback('click');
    setSelectedUniverse(id);
    if (id === 'all') {
      searchParams.delete('domain');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ domain: id });
    }
  };

  const handleResetFilters = () => {
    gnaniService.playAudioFeedback('click');
    setSearch('');
    setSelectedUniverse('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and sort logic
  const filteredCases = useMemo(() => {
    return CASES.filter((c) => {
      // Domain filter
      if (selectedUniverse !== 'all' && c.universeId !== selectedUniverse) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && c.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchSub = (c.subtitle || '').toLowerCase().includes(query);
        const matchSum = c.summary.toLowerCase().includes(query);
        const matchDomain = c.domain.toLowerCase().includes(query);
        const matchLoc = (c.location || '').toLowerCase().includes(query);
        if (!matchTitle && !matchSub && !matchSum && !matchDomain && !matchLoc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === 'difficulty') {
        const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4, 'Master': 5 };
        return (order[b.difficulty] || 0) - (order[a.difficulty] || 0);
      }
      if (sortBy === 'duration') {
        return parseInt(a.duration) - parseInt(b.duration);
      }
      return 0;
    });
  }, [selectedUniverse, selectedDifficulty, selectedStatus, search, sortBy]);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mneme-accent/10 border border-mneme-accent/25 text-[11px] font-mono text-mneme-lavender mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>CASE REPOSITORY • 50 ARCHIVED SLOTS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore the Universe
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl font-light">
            Ten universes of human decision-making under fire. Investigate real telemetry, analyze public post-mortems, or stress-test your instincts in synthetic demo benchmarks.
          </p>
        </div>

        {/* Global Catalog Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center min-w-[90px]">
            <span className="block text-lg font-bold text-white">50</span>
            <span className="text-[10px] text-slate-400 uppercase">Case Slots</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center min-w-[90px]">
            <span className="block text-lg font-bold text-purple-400">10</span>
            <span className="text-[10px] text-slate-400 uppercase">Domains</span>
          </div>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="space-y-4 mb-8">
        
        {/* Search & Main Selectors */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by case title, keyword, failure mode, location, or domain..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-mneme-accent text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              gnaniService.playAudioFeedback('click');
              setSelectedDifficulty(e.target.value);
            }}
            className="px-3 py-2.5 rounded-xl bg-mneme-900 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-mneme-accent"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
            <option value="Master">Master</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              gnaniService.playAudioFeedback('click');
              setSelectedStatus(e.target.value);
            }}
            className="px-3 py-2.5 rounded-xl bg-mneme-900 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-mneme-accent"
          >
            <option value="all">All Verification Statuses</option>
            <option value="SIMULATED DEMO">Simulated Demo</option>
            <option value="PUBLIC CASE STUDY">Public Case Study</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED SUBMISSION">Unverified Submission</option>
            <option value="COMING SOON">Coming Soon</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => {
              gnaniService.playAudioFeedback('click');
              setSortBy(e.target.value);
            }}
            className="px-3 py-2.5 rounded-xl bg-mneme-900 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-mneme-accent"
          >
            <option value="featured">Sort: Featured First</option>
            <option value="difficulty">Sort: Highest Difficulty</option>
            <option value="duration">Sort: Shortest Duration</option>
          </select>

          {/* Reset Filters */}
          {(search || selectedUniverse !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-rose-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Universe Domain Pill Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          <button
            onClick={() => handleUniverseChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedUniverse === 'all'
                ? 'bg-mneme-accent text-white shadow-md shadow-mneme-accent/20'
                : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
            }`}
          >
            All Universes (50)
          </button>

          {UNIVERSES.map((u) => (
            <button
              key={u.id}
              onClick={() => handleUniverseChange(u.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedUniverse === u.id
                  ? 'bg-mneme-accent text-white shadow-md shadow-mneme-accent/20'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-500">{u.number}</span>
              <span>{u.name}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-6">
        <span>
          Showing <strong className="text-white">{filteredCases.length}</strong> of 50 case slots
          {selectedUniverse !== 'all' && ` in ${UNIVERSES.find(u => u.id === selectedUniverse)?.name}`}
        </span>
      </div>

      {/* Case Grid */}
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 p-8">
          <SlidersHorizontal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-white mb-1">No Matching Cases Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try broadening your search term or clearing active difficulty and status filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-mneme-accent text-white text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}
