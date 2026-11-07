import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  GitBranch, 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  Mic, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { getCaseById, getStatusBadge } from '../data/casesData';
import { gnaniService } from '../services/gnaniService';

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseItem = getCaseById(id);

  if (!caseItem) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center max-w-xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Case Dossier Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The requested case ID does not match any archived slot in the MNEME repository.
        </p>
        <Link to="/universe" className="px-4 py-2 rounded-lg bg-mneme-accent text-white text-xs font-semibold">
          Return to Universe Catalog
        </Link>
      </div>
    );
  }

  const badge = getStatusBadge(caseItem.status);

  const handleStart = () => {
    gnaniService.playAudioFeedback('lock');
    navigate(`/investigate/${caseItem.id}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
        <Link to="/universe" className="hover:text-white transition-colors">Universe</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to={`/universe?domain=${caseItem.universeId}`} className="hover:text-white transition-colors">{caseItem.domain}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-mneme-lavender font-semibold">{caseItem.title}</span>
      </div>

      {/* Main Dossier Header */}
      <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-muted px-2.5 py-1 rounded bg-white/[0.04] border border-white/5">
            {caseItem.domain}
          </span>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-3 py-1 rounded-full border font-bold ${badge.classes}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          {caseItem.title}
        </h1>

        <p className="text-sm font-mono text-mneme-lavender/80 mb-6">
          {caseItem.subtitle || caseItem.location}
        </p>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-light mb-8">
          {caseItem.summary}
        </p>

        {/* Quick Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-white/10 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Difficulty</span>
            <span className="text-white font-semibold">{caseItem.difficulty}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Estimated Time</span>
            <span className="text-white font-semibold">{caseItem.duration}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Incident Year</span>
            <span className="text-white font-semibold">{caseItem.year || '2024'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Location Node</span>
            <span className="text-white font-semibold truncate block">{caseItem.location || 'Classified'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 flex flex-wrap items-center gap-4">
          {caseItem.playable ? (
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-mneme-accent/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Investigation (Knowledge Lock)</span>
            </button>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-400 font-mono">
              Status: Public Historical Analysis Dossier (Interactive stages pending field verification)
            </div>
          )}

          {caseItem.multiverseBranches && (
            <Link
              to={`/multiverse/${caseItem.id}`}
              onClick={() => gnaniService.playAudioFeedback('click')}
              className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <GitBranch className="w-4 h-4 text-blue-400" />
              <span>Multiverse Lab</span>
            </Link>
          )}

          <Link
            to={`/cross-examination/${caseItem.id}`}
            onClick={() => gnaniService.playAudioFeedback('click')}
            className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Mic className="w-4 h-4 text-purple-400" />
            <span>Cross-Examination</span>
          </Link>

          <Link
            to={`/time-machine/${caseItem.id}`}
            onClick={() => gnaniService.playAudioFeedback('click')}
            className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Time Machine</span>
          </Link>
        </div>
      </div>

      {/* Role & Objective Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-[10px] font-mono uppercase text-mneme-accent block mb-1">Assigned Investigator Persona</span>
          <h3 className="font-serif text-base font-bold text-white mb-2">{caseItem.investigatorRole}</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            You enter this incident with the authority, responsibility, and cognitive load of this operational position.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">Primary Operational Objective</span>
          <h3 className="font-serif text-base font-bold text-white mb-2">Tactical Mission Directive</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            {caseItem.primaryObjective}
          </p>
        </div>
      </div>

      {/* Evidence Passport Box */}
      <div className="rounded-2xl bg-mneme-900/60 border border-white/10 p-6 font-mono text-xs mb-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">EVIDENCE PASSPORT & INTEGRITY RECORD</span>
          </div>
          <Link to="/verification" className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]">
            <span>Verification Criteria</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px]">EVIDENCE SOURCE:</span>
            <span>{caseItem.evidencePassport?.source || caseItem.statusNote}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CONFIDENCE CLASSIFICATION:</span>
            <span className="text-emerald-400">{caseItem.evidencePassport?.confidenceRating || 'Documented Public Archive'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CHAIN OF CUSTODY:</span>
            <span>{caseItem.evidencePassport?.chainOfCustody || 'Historical post-mortem inquiry reports and public agency hearings.'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">AI USAGE DISCLOSURE:</span>
            <span className="text-purple-300">
              {caseItem.evidencePassport?.publicDisclosure || 'Factual parameters grounded strictly in verified case records.'}
            </span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="pt-4">
        <Link
          to="/universe"
          onClick={() => gnaniService.playAudioFeedback('click')}
          className="text-xs font-mono text-slate-400 hover:text-white inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Universe Library</span>
        </Link>
      </div>

    </div>
  );
}
