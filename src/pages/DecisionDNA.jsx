import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  FileText,
  Sparkles,
  Award
} from 'lucide-react';
import { storageService, INITIAL_DECISION_DNA } from '../services/storageService';
import { gnaniService } from '../services/gnaniService';

export default function DecisionDNA() {
  const [dna, setDna] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const activeDna = storageService.getDecisionDNA();
    const activeUser = storageService.getUser();
    setDna(activeDna);
    setUser(activeUser);
  }, []);

  if (!dna) return null;

  const totalCluesEncountered = dna.cluesDiscovered + dna.cluesMissed;
  const clueDiscoveryPct = totalCluesEncountered > 0 
    ? Math.round((dna.cluesDiscovered / totalCluesEncountered) * 100) 
    : 78;

  const domainEntries = Object.entries(dna.exploredDomains || {});

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header Profile Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>INVESTIGATOR COGNITIVE PROFILE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            My Decision DNA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-2xl">
            A real-time cognitive mirror derived strictly from your decisions, clue discovery rate, and adherence to documented expert doctrine.
          </p>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-white font-bold mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{user?.name || 'Cadet Investigator'}</span>
          </div>
          <span className="text-[11px] text-mneme-lavender block">{user?.badge || 'Level 2 Field Forensic Analyst'}</span>
          <span className="text-[10px] text-slate-500">ID: {user?.callsign || 'INVESTIGATOR-01'}</span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Cases Completed</span>
          <span className="text-3xl font-extrabold font-mono text-white">{dna.totalInvestigated}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Archived investigations</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Expert Concordance</span>
          <span className="text-3xl font-extrabold font-mono text-emerald-400">{dna.expertAlignmentScore}%</span>
          <span className="text-[11px] text-slate-400 block mt-1">Average tactical alignment</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Clue Discovery Rate</span>
          <span className="text-3xl font-extrabold font-mono text-mneme-lavender">{clueDiscoveryPct}%</span>
          <span className="text-[11px] text-slate-400 block mt-1">{dna.cluesDiscovered} identified / {dna.cluesMissed} missed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Decisions Committed</span>
          <span className="text-3xl font-extrabold font-mono text-purple-400">{dna.decisionsMade}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Irreversible locks</span>
        </div>

      </div>

      {/* Behavioral Trait Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Risk Appetite & Hesitation Metric */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h3 className="font-serif text-base font-bold text-white">
            Operational Heuristics
          </h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            These traits reflect strictly your choices in historical high-pressure situations—not a psychological diagnosis.
          </p>

          <div className="space-y-3 font-mono text-xs pt-2">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Risk Profile:</span>
              <span className="text-emerald-400 font-bold">{dna.riskAppetite}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Hesitation Metric:</span>
              <span className="text-purple-300 font-bold">{dna.hesitationIndex}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Pace:</span>
              <span className="text-white font-bold">{dna.averageCompletionTime}</span>
            </div>
          </div>
        </div>

        {/* Domain Footprint Breakdown */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <h3 className="font-serif text-base font-bold text-white mb-2">
            Domain Investigation Footprint
          </h3>
          <p className="text-xs text-slate-400 font-light mb-4">
            Distribution of investigations across the 10 universes.
          </p>

          <div className="space-y-2">
            {domainEntries.map(([domName, count]) => (
              <div key={domName} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 truncate max-w-[200px]">{domName}</span>
                <div className="flex items-center gap-2 flex-1 max-w-[180px] ml-4">
                  <div className="h-1.5 flex-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-mneme-accent rounded-full" 
                      style={{ width: `${Math.min(100, (count / 3) * 100)}%` }} 
                    />
                  </div>
                  <span className="text-white font-bold w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Investigation History Log */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl mb-8">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Recent Case History & Session Log
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Verified sessions logged in browser storage.
            </p>
          </div>

          <Link
            to="/universe"
            className="text-xs font-mono text-mneme-lavender hover:text-white flex items-center gap-1"
          >
            <span>Explore More Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dna.history && dna.history.length > 0 ? (
          <div className="space-y-3">
            {dna.history.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
              >
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">{item.domain}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.caseTitle}</h4>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Completed: {new Date(item.timestamp).toLocaleDateString()} • Clues: {item.cluesRate}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-400">{item.score}%</span>
                    <span className="text-[9px] uppercase text-slate-500 block">Alignment</span>
                  </div>

                  <Link
                    to={`/investigate/${item.caseId}`}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-colors"
                  >
                    Replay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            No completed investigations yet. Launch a case from the Universe library to begin tracking your Decision DNA.
          </div>
        )}
      </div>

    </div>
  );
}
