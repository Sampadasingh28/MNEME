import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Mic, 
  GitBranch, 
  FileText, 
  Sparkles,
  HelpCircle,
  Activity,
  Layers,
  Award,
  Headphones
} from 'lucide-react';
import { getCaseById, getStatusBadge } from '../data/casesData';
import { gnaniService } from '../services/gnaniService';
import { storageService } from '../services/storageService';
import { documentaryNarrator } from '../services/documentaryNarrator';
import VoicePlayer from '../components/VoicePlayer';
import InvestigationVoiceAssistant from '../components/InvestigationVoiceAssistant';

export default function Investigation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseItem = getCaseById(id) || getCaseById('the-silent-failure');

  // Stages count
  const stages = caseItem.stages || [];
  const totalStages = stages.length;

  // Active Stage Index (0-based)
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  // Clues discovered by user: Set of evidence IDs
  const [discoveredClues, setDiscoveredClues] = useState({});

  // Active decision selections per stage: { [stageIdx]: { optionId, confidence, reasoning, lockedAt } }
  const [decisions, setDecisions] = useState({});

  // Has user confirmed/locked the current stage decision?
  const [isCurrentStageLocked, setIsCurrentStageLocked] = useState(false);

  // Is investigation complete (all stages finished)?
  const [isCompleted, setIsCompleted] = useState(false);

  // Selected option currently in draft before locking
  const [draftOption, setDraftOption] = useState(null);
  const [draftConfidence, setDraftConfidence] = useState(80);
  const [draftReasoning, setDraftReasoning] = useState('');

  // Selected evidence item currently opened in modal/inspection drawer
  const [inspectingEvidence, setInspectingEvidence] = useState(null);

  // Documentary Narrator State for real-time highlighting
  const [narratorState, setNarratorState] = useState(documentaryNarrator.getState());

  useEffect(() => {
    const unsubscribe = documentaryNarrator.subscribe((st) => setNarratorState(st));
    return () => {
      unsubscribe();
      documentaryNarrator.stop();
    };
  }, []);

  // Load saved session or initialize
  useEffect(() => {
    const saved = storageService.getInvestigationProgress(caseItem.id);
    if (saved && saved.currentStageIdx !== undefined) {
      setCurrentStageIdx(saved.currentStageIdx);
      setDiscoveredClues(saved.discoveredClues || {});
      setDecisions(saved.decisions || {});
      setIsCurrentStageLocked(Boolean(saved.isCurrentStageLocked));
      setIsCompleted(Boolean(saved.isCompleted));
    }
  }, [caseItem.id]);

  // Current stage data
  const currentStage = stages[currentStageIdx] || stages[0];

  // Strictly integrate voice narration with Knowledge Lock:
  // When stage changes or investigation loads, load the narration script for current stage ONLY.
  // NEVER include future locked stages.
  useEffect(() => {
    if (!isCompleted && currentStage) {
      const script = documentaryNarrator.generateStageScript(currentStage, currentStageIdx + 1, totalStages);
      documentaryNarrator.loadScript(script);
    }
  }, [currentStageIdx, isCompleted, caseItem.id]);

  // When completed, load the learning report script!
  useEffect(() => {
    if (isCompleted) {
      let expertMatches = 0;
      Object.values(decisions).forEach(d => {
        if (d.isExpertMatch) expertMatches++;
      });
      const totalClues = stages.reduce((acc, st) => acc + (st.evidenceList?.filter(e => e.isClue).length || 0), 0);
      const foundCluesCount = Object.keys(discoveredClues).length;
      const alignmentPct = Math.round((expertMatches / totalStages) * 100) || 75;
      const reportScript = documentaryNarrator.generateLearningReportScript(caseItem, alignmentPct, foundCluesCount, totalClues);
      documentaryNarrator.loadScript(reportScript);
    }
  }, [isCompleted]);

  // Inspect evidence item & mark clue as discovered
  const handleInspectEvidence = (evidence) => {
    gnaniService.playAudioFeedback('alert');
    setInspectingEvidence(evidence);

    if (evidence.isClue && !discoveredClues[evidence.id]) {
      const updated = { ...discoveredClues, [evidence.id]: true };
      setDiscoveredClues(updated);
      gnaniService.playAudioFeedback('success');
      // Save progress
      storageService.saveInvestigationProgress(caseItem.id, {
        currentStageIdx,
        discoveredClues: updated,
        decisions,
        isCurrentStageLocked,
        isCompleted
      });
    }
  };

  // Lock user decision for current stage
  const handleLockDecision = () => {
    if (!draftOption) return;

    documentaryNarrator.stop();
    gnaniService.playAudioFeedback('lock');

    const stageDecision = {
      stageNumber: currentStage.stageNumber,
      timestamp: currentStage.timestamp,
      selectedOptionId: draftOption.id,
      selectedOptionLabel: draftOption.label,
      confidence: draftConfidence,
      reasoning: draftReasoning,
      expertActionTaken: currentStage.expertActionTaken,
      isExpertMatch: draftOption.id === currentStage.expertActionTaken,
      lockedAt: new Date().toISOString()
    };

    const updatedDecisions = {
      ...decisions,
      [currentStageIdx]: stageDecision
    };

    setDecisions(updatedDecisions);
    setIsCurrentStageLocked(true);

    // Save progress
    storageService.saveInvestigationProgress(caseItem.id, {
      currentStageIdx,
      discoveredClues,
      decisions: updatedDecisions,
      isCurrentStageLocked: true,
      isCompleted: false
    });
  };

  // Advance to next unlocked stage or finish
  const handleNextStage = () => {
    documentaryNarrator.stop();
    gnaniService.playAudioFeedback('click');

    if (currentStageIdx + 1 < totalStages) {
      const nextIdx = currentStageIdx + 1;
      setCurrentStageIdx(nextIdx);
      setIsCurrentStageLocked(false);
      setDraftOption(null);
      setDraftReasoning('');

      storageService.saveInvestigationProgress(caseItem.id, {
        currentStageIdx: nextIdx,
        discoveredClues,
        decisions,
        isCurrentStageLocked: false,
        isCompleted: false
      });
    } else {
      // Completed all stages!
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Calculate final scores
      let expertMatches = 0;
      Object.values(decisions).forEach(d => {
        if (d.isExpertMatch) expertMatches++;
      });

      const totalClues = stages.reduce((acc, st) => acc + (st.evidenceList?.filter(e => e.isClue).length || 0), 0);
      const foundCluesCount = Object.keys(discoveredClues).length;
      const missedCluesCount = Math.max(0, totalClues - foundCluesCount);
      const alignmentPct = Math.round((expertMatches / totalStages) * 100) || 75;

      const summary = {
        caseId: caseItem.id,
        caseTitle: caseItem.title,
        domain: caseItem.domain,
        decisionsCount: totalStages,
        expertAlignmentPercentage: alignmentPct,
        cluesDiscovered: foundCluesCount,
        cluesMissed: missedCluesCount,
        completedAt: new Date().toISOString()
      };

      storageService.recordCompletedInvestigation(summary);
      storageService.clearInvestigationProgress(caseItem.id);
    }
  };

  // Reset / Restart investigation
  const handleRestart = () => {
    documentaryNarrator.stop();
    gnaniService.playAudioFeedback('click');
    if (window.confirm('Reset this investigation? Your locked decisions for this session will be cleared.')) {
      setCurrentStageIdx(0);
      setDiscoveredClues({});
      setDecisions({});
      setIsCurrentStageLocked(false);
      setIsCompleted(false);
      setDraftOption(null);
      setDraftReasoning('');
      storageService.clearInvestigationProgress(caseItem.id);
    }
  };

  const badge = getStatusBadge(caseItem.status);
  const isNarrating = narratorState.isPlaying;
  const activeTarget = narratorState.currentSegment?.highlightTarget;

  // If already completed, show comprehensive Learning Report
  if (isCompleted) {
    const totalClues = stages.reduce((acc, st) => acc + (st.evidenceList?.filter(e => e.isClue).length || 0), 0);
    const foundCluesCount = Object.keys(discoveredClues).length;
    let expertMatches = 0;
    Object.values(decisions).forEach(d => {
      if (d.isExpertMatch) expertMatches++;
    });
    const alignmentPct = Math.round((expertMatches / totalStages) * 100) || 75;

    return (
      <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Voice Player at top of Learning Report */}
        <div className="mb-6">
          <VoicePlayer title="Documentary Report: Final Forensic Assessment" />
        </div>

        {/* Completed Dossier Card */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-10 backdrop-blur-xl shadow-2xl mb-8">
          
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>INVESTIGATION COMPLETED & RECORDED</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Forensic Learning Report
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Case: {caseItem.title} • {caseItem.domain}
              </p>
            </div>

            <div className="text-right">
              <span className="block text-3xl font-extrabold font-mono text-mneme-lavender">
                {alignmentPct}%
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400">Expert Alignment</span>
            </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 transition-all duration-300 ${
            isNarrating && activeTarget === 'report-metrics' ? 'p-1.5 rounded-2xl bg-purple-500/20' : ''
          }`}>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Clues Discovered</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{foundCluesCount} of {totalClues}</span>
              <p className="text-[11px] text-slate-400 mt-1">Critical telemetry signals identified before decision locks.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Decision Concordance</span>
              <span className="text-xl font-bold font-mono text-purple-400">{expertMatches} of {totalStages}</span>
              <p className="text-[11px] text-slate-400 mt-1">Tactical orders aligned with lead investigator actions.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">Knowledge Lock Status</span>
              <span className="text-xl font-bold font-mono text-white">100% Sequential</span>
              <p className="text-[11px] text-slate-400 mt-1">Zero future timeline data leaked prior to decision commit.</p>
            </div>
          </div>

          {/* Stage by stage autopsy */}
          <div className="space-y-4 mb-8">
            <h3 className="font-serif text-base font-bold text-white mb-2">Sequential Decision Breakdown</h3>
            {stages.map((st, idx) => {
              const userDec = decisions[idx];
              const expertOpt = st.decisionOptions.find(o => o.id === st.expertActionTaken);
              const userOpt = st.decisionOptions.find(o => o.id === userDec?.selectedOptionId);

              return (
                <div key={st.stageNumber} className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-mneme-lavender font-bold">
                      STAGE {st.stageNumber} • {st.timestamp}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      userDec?.isExpertMatch ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {userDec?.isExpertMatch ? 'MATCHED DOCUMENTED EXPERT' : 'DIVERGED FROM EXPERT'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-slate-500 block text-[10px]">YOUR LOCKED COMMAND:</span>
                      <p className="text-white font-medium mt-0.5">{userOpt?.label || 'None'}</p>
                      {userDec?.reasoning && (
                        <p className="text-[11px] text-slate-400 italic mt-1">"{userDec.reasoning}"</p>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">DOCUMENTED EXPERT ACTION:</span>
                      <p className="text-emerald-300 font-medium mt-0.5">{expertOpt?.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{st.expertReasoning}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions & Exploration */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-mneme-accent/20 transition-all"
              >
                View My Decision DNA
              </Link>

              <Link
                to={`/multiverse/${caseItem.id}`}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                <span>Explore Multiverse Scenarios</span>
              </Link>

              <Link
                to={`/time-machine/${caseItem.id}`}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time Machine</span>
              </Link>
            </div>

            <button
              onClick={handleRestart}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Investigate Again</span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  // Active Stage Investigation View
  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      
      {/* Investigation Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${badge.classes}`}>
              {badge.label}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {caseItem.domain}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
            {caseItem.title}
          </h1>
        </div>

        {/* Knowledge Lock Indicator */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2">
            <Lock className="w-4 h-4 text-mneme-lavender animate-pulse" />
            <div className="text-left font-mono">
              <span className="block text-[9px] uppercase tracking-wider text-slate-400">Knowledge Lock</span>
              <span className="block text-xs text-white font-bold">Stage {currentStageIdx + 1} of {totalStages}</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            title="Restart Investigation"
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Player Docked at Top of Investigation Stage */}
      <div className="mb-6">
        <VoicePlayer 
          title={`Documentary Narration: Stage ${currentStageIdx + 1} (${currentStage.timestamp})`} 
        />
      </div>

      {/* Sequential Timeline Stepper Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        {stages.map((st, idx) => {
          const isCurrent = idx === currentStageIdx;
          const isPast = idx < currentStageIdx;
          const isLockedFuture = idx > currentStageIdx;

          return (
            <div 
              key={st.stageNumber}
              className={`p-3 rounded-xl border font-mono text-xs transition-all ${
                isCurrent 
                  ? 'bg-mneme-accent/15 border-mneme-accent text-white shadow-lg shadow-mneme-accent/10'
                  : isPast
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-white/[0.01] border-white/5 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold">
                  {st.timestamp}
                </span>
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Activity className="w-3.5 h-3.5 text-mneme-accent animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <p className="truncate text-[11px] font-sans font-medium text-slate-300">
                {st.stageName}
              </p>
            </div>
          );
        })}
      </div>

      {/* STAGE 1: INCIDENT BRIEF & CONTEXT WITH LIVE AUDIO HIGHLIGHTS */}
      <div className={`rounded-2xl bg-white/[0.02] border p-6 sm:p-8 backdrop-blur-xl mb-8 transition-all duration-300 ${
        isNarrating && (activeTarget === 'timestamp-header' || activeTarget === 'incident-context')
          ? 'border-purple-500/80 shadow-2xl shadow-purple-950/40 bg-purple-950/10'
          : 'border-white/10'
      }`}>
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-mneme-lavender" />
            <span className="font-mono text-sm text-white font-bold">{currentStage.timestamp}</span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="text-xs text-amber-400 font-mono">{currentStage.systemStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            {isNarrating && activeTarget === 'incident-context' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 animate-pulse">
                ● Narrator Reading Context
              </span>
            )}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
              Current Knowledge Horizon
            </span>
          </div>
        </div>

        <p className={`text-sm leading-relaxed font-light mb-4 transition-colors duration-300 ${
          isNarrating && activeTarget === 'incident-context' ? 'text-white font-normal' : 'text-slate-200'
        }`}>
          {currentStage.context}
        </p>

        {/* Operational Dilemma with Audio Highlight */}
        <div className={`p-4 rounded-xl border text-xs leading-relaxed font-mono transition-all duration-300 ${
          isNarrating && activeTarget === 'operational-dilemma'
            ? 'bg-amber-500/25 border-amber-400 text-white shadow-lg shadow-amber-500/20'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <strong className="block text-amber-400">OPERATIONAL DILEMMA:</strong>
            {isNarrating && activeTarget === 'operational-dilemma' && (
              <span className="text-[10px] px-2 py-0.2 rounded bg-amber-400/20 text-amber-200 animate-pulse">
                ● Narrator Explaining Dilemma
              </span>
            )}
          </div>
          {currentStage.dilemma}
        </div>
      </div>

      {/* STAGE 2: EVIDENCE ROOM & CLUE DISCOVERY WITH AUDIO HIGHLIGHTS */}
      <div className={`rounded-2xl bg-white/[0.02] border p-6 sm:p-8 backdrop-blur-xl mb-8 transition-all duration-300 ${
        isNarrating && activeTarget === 'evidence-room'
          ? 'border-purple-500/80 shadow-2xl shadow-purple-950/40 bg-purple-950/10'
          : 'border-white/10'
      }`}>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-white">
                The Evidence Room
              </h2>
              {isNarrating && activeTarget === 'evidence-room' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 animate-pulse">
                  ● Narrator Explaining Signals
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Inspect current telemetry, gauges, and audio intercepts to discover hidden clues.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Clues Discovered: <strong className="text-emerald-400">{Object.keys(discoveredClues).length}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentStage.evidenceList?.map((ev) => {
            const isFound = discoveredClues[ev.id];

            return (
              <button
                key={ev.id}
                onClick={() => handleInspectEvidence(ev)}
                className={`p-4 rounded-xl border text-left transition-all hover:-translate-y-1 ${
                  isFound
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-white/[0.03] border-white/10 hover:border-mneme-accent/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">{ev.category}</span>
                  {isFound ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Clue Identified
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-mneme-lavender flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Inspect
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mb-1.5">{ev.title}</h4>
                <p className="text-[11px] font-mono text-slate-300 line-clamp-2">{ev.value}</p>
              </button>
            );
          })}
        </div>

        {/* Evidence Inspection Modal / Detailed Overlay */}
        {inspectingEvidence && (
          <div className="mt-6 p-5 rounded-xl bg-mneme-900 border border-mneme-accent/40 animate-in fade-in duration-200 shadow-xl shadow-black/50">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mneme-accent animate-ping" />
                <span className="text-xs font-mono font-bold text-mneme-lavender uppercase tracking-wider">
                  {inspectingEvidence.category} Telemetry File • {inspectingEvidence.type.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setInspectingEvidence(null)}
                className="text-xs text-slate-400 hover:text-white font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 transition-colors"
              >
                Close [✕]
              </button>
            </div>
            
            <h3 className="font-serif text-base font-bold text-white mb-2">{inspectingEvidence.title}</h3>
            
            {/* Visual Telemetry Sparkline if Sensor / Gauge */}
            {(inspectingEvidence.type === 'sensor' || inspectingEvidence.type === 'gauge') && (
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-xs mb-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                  <span>REAL-TIME OSCILLOSCOPE TRACE (200 Hz Sampling)</span>
                  <span className="text-rose-400 font-bold">ALARM THRESHOLD EXCEEDED</span>
                </div>
                {/* SVG Telemetry Oscilloscope */}
                <svg className="w-full h-16 stroke-amber-400 fill-none" viewBox="0 0 300 60">
                  <path 
                    d="M 0 30 Q 15 28, 30 30 T 60 30 T 90 29 T 120 32 T 150 15 T 165 48 T 180 8 T 195 52 T 210 12 T 225 45 T 240 18 T 255 42 T 270 20 T 300 24" 
                    strokeWidth="2" 
                    className="stroke-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                  />
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(239,68,68,0.5)" strokeDasharray="4" strokeWidth="1" />
                </svg>
                <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 font-mono">
                  <span>Baseline: 2.5 mm/s</span>
                  <span className="text-amber-300 font-bold">Current Peak: {inspectingEvidence.value}</span>
                </div>
              </div>
            )}

            {/* Audio Waveform Player if Audio Evidence */}
            {inspectingEvidence.type === 'audio' && (
              <div className="p-3.5 rounded-lg bg-black/60 border border-purple-500/30 font-mono text-xs mb-3 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-purple-300">
                  <span>VHF AUDIO INTERCEPT CAPTURE</span>
                  <span className="text-emerald-400 font-bold">AUTHENTICATED RADIO LOG</span>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <button
                    onClick={() => gnaniService.speakCaseInvestigation(inspectingEvidence.value)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Play Gnani Timbre Readout</span>
                  </button>
                  <div className="flex-1 flex items-center gap-1 h-6">
                    {[40, 65, 30, 85, 95, 45, 70, 80, 50, 90, 60, 75, 85, 40, 70, 55, 90, 35, 60, 80].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-purple-400/60 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-black/50 border border-white/5 font-mono text-xs text-amber-300 mb-3">
              <span className="text-slate-500 text-[10px] block uppercase mb-0.5">Recorded Sensor Value / Transcript:</span>
              {inspectingEvidence.value}
            </div>

            <div className="text-xs text-slate-300 leading-relaxed font-light p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <strong className="text-white font-mono block text-[10px] uppercase mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-mneme-lavender" />
                Forensic Significance & Clue Analysis:
              </strong>
              {inspectingEvidence.significance}
            </div>
          </div>
        )}
      </div>

      {/* STAGE 4 & 5: DECISION POINT & KNOWLEDGE LOCK COMMITMENT */}
      {!isCurrentStageLocked ? (
        <div className={`rounded-2xl bg-white/[0.02] border p-6 sm:p-8 backdrop-blur-xl mb-8 transition-all duration-300 ${
          isNarrating && activeTarget === 'decision-point'
            ? 'border-purple-500/80 shadow-2xl shadow-purple-950/40 bg-purple-950/10'
            : 'border-white/10'
        }`}>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Decision Point ({currentStage.timestamp})
              </span>
            </div>

            {isNarrating && activeTarget === 'decision-point' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 animate-pulse">
                ● Narrator Announcing Options
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-white mb-2">
            {currentStage.decisionPrompt}
          </h3>

          <p className="text-xs text-slate-400 mb-6">
            Choose your command based only on the evidence above. Once locked, the Knowledge Lock advances the incident timeline irreversibly.
          </p>

          {/* Decision Options Radio List */}
          <div className="space-y-3 mb-6">
            {currentStage.decisionOptions?.map((opt) => {
              const isSelected = draftOption?.id === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    gnaniService.playAudioFeedback('click');
                    setDraftOption(opt);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-mneme-accent/20 border-mneme-accent shadow-md shadow-mneme-accent/15'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                        isSelected ? 'border-mneme-accent bg-mneme-accent' : 'border-slate-500'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{opt.label}</h4>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-light">{opt.description}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 whitespace-nowrap">
                      {opt.riskScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidence & Reasoning */}
          {draftOption && (
            <div className="space-y-4 pt-4 border-t border-white/10 animate-in fade-in duration-200">
              
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Decision Confidence Level</span>
                  <span className="text-mneme-lavender font-bold">{draftConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={draftConfidence}
                  onChange={(e) => setDraftConfidence(parseInt(e.target.value))}
                  className="w-full accent-mneme-accent cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Tactical Reasoning / Rationale Notes (Optional)
                </label>
                <textarea
                  value={draftReasoning}
                  onChange={(e) => setDraftReasoning(e.target.value)}
                  placeholder="Record why you chose this path over alternative options..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-mneme-accent"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLockDecision}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-mneme-accent/25 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Decision & Advance Timeline</span>
                </button>
              </div>

            </div>
          )}

        </div>
      ) : (
        /* STAGE 7: POST-LOCK EXPERT CONFRONTATION */
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl mb-8 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Decision Locked at {currentStage.timestamp}
              </span>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              IRREVERSIBLE COMMITMENT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            {/* User Choice */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
              <span className="text-slate-500 block text-[10px] uppercase">YOUR COMMAND:</span>
              <p className="text-white font-bold mt-1">
                {decisions[currentStageIdx]?.selectedOptionLabel}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                <span>Confidence: {decisions[currentStageIdx]?.confidence}%</span>
                {decisions[currentStageIdx]?.reasoning && (
                  <span>• "{decisions[currentStageIdx].reasoning}"</span>
                )}
              </div>
            </div>

            {/* Documented Expert Choice */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 block text-[10px] uppercase">DOCUMENTED EXPERT DECISION:</span>
                <span className={`text-[10px] font-bold ${
                  decisions[currentStageIdx]?.isExpertMatch ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {decisions[currentStageIdx]?.isExpertMatch ? '✓ ALIGNED' : '⚡ DIVERGENT'}
                </span>
              </div>
              <p className="text-emerald-300 font-bold mt-1">
                {currentStage.decisionOptions?.find(o => o.id === currentStage.expertActionTaken)?.label}
              </p>
              <p className="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
                {currentStage.expertReasoning}
              </p>
            </div>

          </div>

          {/* Unlocked Subsequent Historical Event */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs mb-6">
            <span className="text-mneme-lavender block text-[10px] uppercase font-bold mb-1">
              CONSEQUENCE TIMELINE UNLOCKED:
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {currentStage.historicalEventUnlocked}
            </p>
          </div>

          {/* Advance button */}
          <button
            onClick={handleNextStage}
            className="w-full py-3.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/20 flex items-center justify-center gap-2"
          >
            <span>
              {currentStageIdx + 1 < totalStages ? 'Advance to Next Incident Stage' : 'Complete Investigation & Generate Learning Report'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      )}

      {/* LOCKED FUTURE STAGES VISUALIZER */}
      {currentStageIdx + 1 < totalStages && (
        <div className="relative rounded-2xl border border-dashed border-white/15 p-6 bg-white/[0.01] overflow-hidden">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-[4px] flex flex-col items-center justify-center gap-2 z-10 text-center p-4">
            <Lock className="w-6 h-6 text-mneme-lavender" />
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Knowledge Lock Engaged • Stage {currentStageIdx + 2} Encrypted
            </h4>
            <p className="text-[11px] text-slate-400 max-w-md font-light">
              Future telemetry spikes and subsequent alarms remain locked until the current stage is completed.
            </p>
          </div>

          <div className="opacity-15 blur-sm pointer-events-none text-xs font-mono space-y-2">
            <p>11:08 AM • Secondary Thermal Cascade TC-2A: 109°C</p>
            <p>Differential pressure filter DP-12 reaches critical threshold</p>
            <p>Silver flake detected in lube return manifold</p>
          </div>
        </div>
      )}

      {/* Interactive Case Intelligence Voice Assistant (Floating Action & Drawer) */}
      <InvestigationVoiceAssistant 
        caseItem={caseItem} 
        currentStage={currentStage} 
      />

    </div>
  );
}
