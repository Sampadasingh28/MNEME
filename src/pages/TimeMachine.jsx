import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Play, 
  Activity, 
  Sliders, 
  ChevronRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { getCaseById } from '../data/casesData';
import { storageService } from '../services/storageService';
import { gnaniService } from '../services/gnaniService';

export default function TimeMachine() {
  const { id } = useParams();
  const caseItem = getCaseById(id) || getCaseById('the-silent-failure');

  const stages = caseItem.stages || [];
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);

  // Retrieve any saved decisions
  const progress = storageService.getInvestigationProgress(caseItem.id);
  const userDecisions = progress?.decisions || {};

  const currentStage = stages[selectedStageIdx] || stages[0];
  const userDecision = userDecisions[selectedStageIdx];

  const handleStageSelect = (idx) => {
    gnaniService.playAudioFeedback('click');
    setSelectedStageIdx(idx);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to={`/case/${caseItem.id}`} className="hover:text-white transition-colors">
            {caseItem.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-mneme-lavender font-semibold">Decision Time Machine</span>
        </div>

        <Link
          to={`/investigate/${caseItem.id}`}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Investigation View</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>CHRONOLOGICAL PLAYBACK & REASONING SCRUBBER</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Decision Time Machine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Scrub through incident chronology. Compare the evolving physical telemetry with your decisions and documented expert interventions.
        </p>
      </div>

      {/* Scrubbable Timeline Control Bar */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-xl mb-8">
        <span className="text-[10px] font-mono uppercase text-slate-500 block mb-3">
          CHRONOLOGICAL SCRUBBER
        </span>

        {/* Step buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stages.map((st, idx) => {
            const isSelected = idx === selectedStageIdx;

            return (
              <button
                key={st.stageNumber}
                onClick={() => handleStageSelect(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="font-bold">{st.timestamp}</span>
                  <span className="text-[10px] text-slate-500">Stage {st.stageNumber}</span>
                </div>
                <p className="text-xs font-medium truncate">{st.stageName}</p>
              </button>
            );
          })}
        </div>

        {/* Interactive Scrub Range */}
        <input
          type="range"
          min="0"
          max={stages.length - 1}
          value={selectedStageIdx}
          onChange={(e) => handleStageSelect(parseInt(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
          <span>T+00:00 (Incident Commencement)</span>
          <span>T+00:40 (Safe Roll-down Complete)</span>
        </div>
      </div>

      {/* Selected Time Horizon Details */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl mb-8">
        
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-blue-400">{currentStage.timestamp}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-300">{currentStage.systemStatus}</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white mt-1">
              {currentStage.stageName}
            </h2>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
            TIMELINE HORIZON #{selectedStageIdx + 1}
          </span>
        </div>

        {/* Context Brief */}
        <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
          {currentStage.context}
        </p>

        {/* Telemetry Snapshot */}
        <div className="space-y-3 mb-6">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            TELEMETRY SENSOR MATRIX AT {currentStage.timestamp}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentStage.evidenceList?.map((ev) => (
              <div key={ev.id} className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">{ev.title}</span>
                <p className="text-amber-300 font-bold truncate">{ev.value}</p>
                <p className="text-[11px] text-slate-400 font-sans mt-2 line-clamp-2">{ev.significance}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confrontation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          
          {/* User Decision in Session */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs">
            <span className="text-slate-500 block text-[10px] uppercase">YOUR RECORDED COMMAND:</span>
            <p className="text-white font-bold mt-1">
              {userDecision ? userDecision.selectedOptionLabel : 'No decision locked yet for this stage.'}
            </p>
            {userDecision?.reasoning && (
              <p className="text-[11px] text-slate-400 italic mt-1">"{userDecision.reasoning}"</p>
            )}
          </div>

          {/* Expert Decision */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 font-mono text-xs">
            <span className="text-purple-300 block text-[10px] uppercase">DOCUMENTED EXPERT COMMAND:</span>
            <p className="text-emerald-300 font-bold mt-1">
              {currentStage.decisionOptions?.find(o => o.id === currentStage.expertActionTaken)?.label}
            </p>
            <p className="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
              {currentStage.expertReasoning}
            </p>
          </div>

        </div>

      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <button
          disabled={selectedStageIdx === 0}
          onClick={() => handleStageSelect(selectedStageIdx - 1)}
          className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Timestamp</span>
        </button>

        <button
          disabled={selectedStageIdx === stages.length - 1}
          onClick={() => handleStageSelect(selectedStageIdx + 1)}
          className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5"
        >
          <span>Next Timestamp</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
