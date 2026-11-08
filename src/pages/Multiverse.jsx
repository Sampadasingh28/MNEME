import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  GitBranch, 
  ArrowLeft, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { getCaseById } from '../data/casesData';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function Multiverse() {
  const { id } = useParams();
  const caseItem = getCaseById(id) || getCaseById('the-silent-failure');

  const { t, getCaseContent } = useLanguage();
  const localizedCase = getCaseContent(caseItem);

  const branches = caseItem.multiverseBranches || [];
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 'branch-1');

  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const handleSelectBranch = (branchId) => {
    voiceService.playAudioFeedback('click');
    setSelectedBranchId(branchId);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to={`/case/${caseItem.id}`} className="hover:text-white transition-colors">
            {localizedCase.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-mneme-lavender font-semibold">Multiverse Lab</span>
        </div>

        <Link
          to={`/investigate/${caseItem.id}`}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('common.returnToInvestigation','Return to Investigation')}</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 mb-2">
          <GitBranch className="w-3.5 h-3.5" />
          <span>BRANCHING COUNTERFACTUAL SIMULATION ENGINE</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          The Multiverse Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-3xl">
          Explore hypothetical counterfactual scenarios. What if alternative tactical commands had been chosen under uncertainty?
        </p>
      </div>

      {/* Strict Integrity Disclaimer */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs font-mono text-purple-200 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-white mb-0.5">MANDATORY INTEGRITY DISCLOSURE:</strong>
          All alternate paths presented below carry the explicit label <strong className="text-purple-300">SIMULATED SCENARIO</strong>. They represent synthetic dynamic simulations and risk projections, and are never presented as historical recorded outcomes.
        </div>
      </div>

      {/* Multiverse Branching Tree Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Baseline Reality */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DOCUMENTED BASELINE
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h3 className="text-white font-bold mb-1">Controlled Staged Deceleration</h3>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Turbine throttled to 60%, followed by gradual deceleration with continuous jacking oil engaged at 150 RPM. Shaft preserved.
          </p>
        </div>

        {/* Counterfactual Branches */}
        {branches.map((branch, idx) => {
          const isSelected = branch.id === selectedBranchId;

          return (
            <div
              key={branch.id}
              onClick={() => handleSelectBranch(branch.id)}
              className={`p-4 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                isSelected
                  ? 'bg-purple-950/30 border-purple-500 text-white shadow-xl shadow-purple-500/10'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                  {branch.scenarioLabel}
                </span>
                <span className="text-slate-500 text-[10px]">Branch #{idx + 1}</span>
              </div>
              <h3 className="text-white font-bold mb-1">{branch.title}</h3>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                {branch.choicePoint}
              </p>
            </div>
          );
        })}

      </div>

      {/* Selected Branch Detailed Analysis */}
      {activeBranch && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10 font-mono">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                  {activeBranch.scenarioLabel}
                </span>
                <span className="text-xs text-slate-400">{activeBranch.probability}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                {activeBranch.title}
              </h2>
            </div>

            <span className="text-xs text-slate-500">
              Trigger: {activeBranch.choicePoint}
            </span>
          </div>

          {/* Outcome Narrative */}
          <div className="space-y-4 mb-8">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider font-mono">
              Hypothetical Simulation Runout:
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {activeBranch.outcomeSummary}
            </p>
          </div>

          {/* Impact Matrix */}
          <div>
            <h3 className="text-xs font-mono uppercase text-slate-400 block mb-3">
              SIMULATED IMPACT MATRIX
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block mb-1">Financial Loss</span>
                <span className="text-base font-bold text-rose-400">{activeBranch.impactMetrics?.cost}</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block mb-1">Personnel Safety</span>
                <span className="text-base font-bold text-amber-300">{activeBranch.impactMetrics?.safety}</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block mb-1">System Downtime</span>
                <span className="text-base font-bold text-slate-200">{activeBranch.impactMetrics?.downtime}</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] uppercase block mb-1">Institutional Fallout</span>
                <span className="text-base font-bold text-purple-300 truncate block">{activeBranch.impactMetrics?.reputation}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}


