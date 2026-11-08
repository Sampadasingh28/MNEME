import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward, Mic, ChevronDown, ChevronUp, Headphones } from 'lucide-react';
import { documentaryNarrator } from '../services/documentaryNarrator';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function VoicePlayer({ title, segments, langCode, compact = false }) {
  const [state, setState] = useState(documentaryNarrator.getState());
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const { narrationLanguage, currentNarrationLang, hasVoiceSupport, t } = useLanguage();
  const activeLang = langCode || narrationLanguage;
  const voiceOk = hasVoiceSupport(activeLang);

  useEffect(() => {
    if (segments) documentaryNarrator.loadScript(segments, { langCode: activeLang });
    else if (activeLang) documentaryNarrator.setNarrationLanguage(activeLang);
  }, [JSON.stringify(segments?.map((s) => s.id || s.text)), activeLang]);

  useEffect(() => {
    const unsubscribe = documentaryNarrator.subscribe((newState) => setState(newState));
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    voiceService.playAudioFeedback('click');
    if (state.isPlaying) documentaryNarrator.pause();
    else if (state.isPaused) documentaryNarrator.resume();
    else documentaryNarrator.play();
  };

  const speeds = [0.75, 1, 1.25, 1.5, 2];
  const currentSegment = state.currentSegment;
  const progressPct = state.totalSegments > 0 ? Math.round(((state.currentIndex + 1) / state.totalSegments) * 100) : 0;

  return (
    <div className="relative rounded-2xl bg-mneme-900/90 border border-purple-500/30 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-purple-950/20 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center text-white shadow-md"><Headphones className="w-3.5 h-3.5" /></div>
          <div>
            <span className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide">{title || 'Voice Narration'}</span>
            <span className="text-[10px] text-slate-400 font-mono block">{t('lang.narrationLang', 'Narration')}: {currentNarrationLang?.nativeName} • {voiceOk ? 'voice/transcript available' : t('common.voiceUnavailable', 'Text available')}</span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-purple-950/50 border border-purple-500/25 text-[10px] font-mono text-purple-300 flex items-center gap-1.5">
          <Mic className="w-3 h-3 text-purple-400" /><span>{voiceService.apiStatus?.configured ? 'Provider + browser fallback' : 'Browser voice / text fallback'}</span>
        </div>
      </div>

      {!voiceOk && <div className="mb-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200">{t('common.voiceUnavailable', 'Voice unavailable for this language or device. Text is available.')}</div>}

      <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs mb-3">
        <div className="flex items-center gap-2 text-[10px] text-mneme-lavender mb-1"><span className="uppercase font-bold tracking-wider">{currentSegment?.title || 'Ready'}</span><span>•</span><span className="text-slate-400">Part {state.currentIndex + 1} of {state.totalSegments || 1}</span></div>
        <p className="text-white text-xs leading-relaxed font-sans">"{currentSegment?.text || 'Select play to start narration. Transcript remains available if voice is unsupported.'}"</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => { voiceService.playAudioFeedback('click'); documentaryNarrator.replay(); }} title={t('common.replay', 'Replay')} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={() => { voiceService.playAudioFeedback('click'); documentaryNarrator.seek(Math.max(0, state.currentIndex - 1)); }} disabled={state.currentIndex === 0} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-slate-300 border border-white/10"><SkipBack className="w-3.5 h-3.5" /></button>
          <button onClick={handleTogglePlay} className="px-4 py-2 rounded-xl bg-gradient-to-r from-mneme-accent to-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/25 flex items-center gap-1.5">
            {state.isPlaying ? <><Pause className="w-4 h-4 fill-current" /><span>{t('common.pause', 'Pause')}</span></> : state.isPaused ? <><Play className="w-4 h-4 fill-current" /><span>{t('common.resume', 'Resume')}</span></> : <><Play className="w-4 h-4 fill-current" /><span>{t('common.play', 'Play')}</span></>}
          </button>
          <button onClick={() => { voiceService.playAudioFeedback('click'); documentaryNarrator.stop(); }} className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 text-[11px] font-mono">{t('common.stop', 'Stop')}</button>
          <button onClick={() => { voiceService.playAudioFeedback('click'); documentaryNarrator.seek(Math.min(state.totalSegments - 1, state.currentIndex + 1)); }} disabled={state.currentIndex >= state.totalSegments - 1} className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-slate-300 border border-white/10"><SkipForward className="w-3.5 h-3.5" /></button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="relative">
            <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 flex items-center gap-1 font-bold text-[11px]"><span>{state.speed}x {t('common.speed', 'Speed')}</span><ChevronDown className="w-3 h-3 text-slate-400" /></button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-1 right-0 w-28 rounded-xl bg-mneme-950 border border-white/15 p-1 shadow-2xl z-20">
                {speeds.map((spd) => (
                  <button key={spd} onClick={() => { voiceService.playAudioFeedback('click'); documentaryNarrator.setSpeed(spd); setShowSpeedMenu(false); }} className={`w-full text-left px-2.5 py-1 rounded text-xs ${state.speed === spd ? 'bg-mneme-accent text-white font-bold' : 'text-slate-300 hover:bg-white/10'}`}>{spd}x</button>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-slate-400" /><input type="range" min="0" max="1" step="0.05" value={state.volume} onChange={(e) => documentaryNarrator.setVolume(parseFloat(e.target.value))} className="w-16 h-1 accent-mneme-accent cursor-pointer" /></div>
          <button onClick={() => setShowTranscript(!showTranscript)} className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 flex items-center gap-1 text-[11px]"><span>{t('common.transcript', 'Transcript')}</span>{showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</button>
        </div>
      </div>

      {showTranscript && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">{t('common.captions', 'Captions')} / {t('common.transcript', 'Transcript')}</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {documentaryNarrator.segments.map((seg, idx) => {
              const isCurrent = idx === state.currentIndex;
              return (
                <div key={seg.id || idx} onClick={() => documentaryNarrator.seek(idx)} className={`p-2 rounded-lg text-xs font-sans cursor-pointer transition-all ${isCurrent ? 'bg-purple-950/60 border border-purple-500/60 text-white' : 'bg-white/[0.01] text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'}`}>
                  <div className="flex items-center justify-between font-mono text-[10px] text-mneme-lavender mb-0.5"><span>{seg.title}</span>{isCurrent && <span className="text-emerald-400 font-bold">●</span>}</div>
                  <p>{seg.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden"><div className="h-full bg-gradient-to-r from-mneme-accent via-purple-500 to-indigo-400 transition-all duration-300" style={{ width: `${progressPct}%` }} /></div>
    </div>
  );
}
