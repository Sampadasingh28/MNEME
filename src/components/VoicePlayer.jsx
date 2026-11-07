import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Mic, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Headphones,
  Sliders
} from 'lucide-react';
import { documentaryNarrator } from '../services/documentaryNarrator';
import { gnaniService } from '../services/gnaniService';

export default function VoicePlayer({ title, compact = false }) {
  const [state, setState] = useState(documentaryNarrator.getState());
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = documentaryNarrator.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    gnaniService.playAudioFeedback('click');
    if (state.isPlaying) {
      documentaryNarrator.pause();
    } else if (state.isPaused) {
      documentaryNarrator.resume();
    } else {
      documentaryNarrator.play();
    }
  };

  const handleReplay = () => {
    gnaniService.playAudioFeedback('click');
    documentaryNarrator.replay();
  };

  const handlePrev = () => {
    gnaniService.playAudioFeedback('click');
    documentaryNarrator.seek(Math.max(0, state.currentIndex - 1));
  };

  const handleNext = () => {
    gnaniService.playAudioFeedback('click');
    documentaryNarrator.seek(Math.min(state.totalSegments - 1, state.currentIndex + 1));
  };

  const handleSpeedChange = (speed) => {
    gnaniService.playAudioFeedback('click');
    documentaryNarrator.setSpeed(speed);
    setShowSpeedMenu(false);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    documentaryNarrator.setVolume(val);
  };

  const currentSegment = state.currentSegment;
  const progressPct = state.totalSegments > 0 
    ? Math.round(((state.currentIndex + 1) / state.totalSegments) * 100)
    : 0;

  return (
    <div className="relative rounded-2xl bg-mneme-900/90 border border-purple-500/30 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-purple-950/20 text-slate-100 transition-all">
      
      {/* Top Bar: Title & Voice Engine Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center text-white shadow-md">
            <Headphones className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide">
                {title || 'Documentary Voice Narration'}
              </span>
              {state.isPlaying && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-mneme-accent"></span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              Audio Companion • Investigative Narrative Mode
            </span>
          </div>
        </div>

        {/* Engine Badge: Live Gnani Timbre vs Fallback Demo */}
        <div className="flex items-center gap-2">
          <div 
            title={state.liveMode ? 'Connected to Gnani Timbre Neural Voice API' : 'Using browser documentary speech engine in clearly labeled Demo Mode'}
            className="px-2.5 py-1 rounded-full bg-purple-950/50 border border-purple-500/25 text-[10px] font-mono text-purple-300 flex items-center gap-1.5"
          >
            <Mic className="w-3 h-3 text-purple-400" />
            <span>Voice Engine:</span>
            <span className="text-white font-semibold">
              {state.liveMode ? 'Gnani Timbre (Live API)' : 'Gnani Timbre Protocol (Demo Voice)'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Stage: Current Spoken Segment Display & Animated Waveform */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] text-mneme-lavender mb-1">
            <span className="uppercase font-bold tracking-wider">
              {currentSegment?.title || 'Ready to Narrate'}
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Part {state.currentIndex + 1} of {state.totalSegments || 1}
            </span>
          </div>
          <p className="text-white text-xs truncate leading-relaxed font-sans">
            "{currentSegment?.text || 'Click play to start investigative documentary audio.'}"
          </p>
        </div>

        {/* Frequency Equalizer Visualizer */}
        <div className="flex items-center gap-1 h-6 flex-shrink-0 px-2 py-1 bg-white/[0.02] rounded-lg border border-white/5">
          {[40, 75, 30, 90, 60, 85, 45, 95, 35, 70, 80, 50].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                state.isPlaying 
                  ? 'bg-gradient-to-t from-mneme-accent to-purple-300 animate-pulse'
                  : 'bg-white/20'
              }`}
              style={{
                height: state.isPlaying ? `${h}%` : '20%',
                animationDelay: `${i * 80}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Playback Button Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            title="Replay from start"
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrev}
            disabled={state.currentIndex === 0}
            title="Previous segment"
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Master Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-mneme-accent to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/25 flex items-center gap-1.5 transition-all transform hover:scale-105"
          >
            {state.isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : state.isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Listen Now</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={state.currentIndex >= state.totalSegments - 1}
            title="Next segment"
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed & Volume Tools */}
        <div className="flex items-center gap-3 text-xs font-mono">
          
          {/* Playback Speed Control */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center gap-1 font-bold text-[11px]"
            >
              <span>{state.speed}x Speed</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-full mb-1 right-0 w-24 rounded-xl bg-mneme-950 border border-white/15 p-1 shadow-2xl z-20 space-y-0.5">
                {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`w-full text-left px-2.5 py-1 rounded text-xs transition-colors ${
                      state.speed === spd 
                        ? 'bg-mneme-accent text-white font-bold' 
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 accent-mneme-accent cursor-pointer"
            />
          </div>

          {/* Toggle Transcript View */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
          >
            <span>Transcript</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

        </div>

      </div>

      {/* Expandable Spoken Transcript with Active Highlighting */}
      {showTranscript && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            NARRATIVE SCRIPT & REAL-TIME HIGHLIGHT:
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {documentaryNarrator.segments.map((seg, idx) => {
              const isCurrent = idx === state.currentIndex;

              return (
                <div
                  key={seg.id}
                  onClick={() => documentaryNarrator.seek(idx)}
                  className={`p-2 rounded-lg text-xs font-sans cursor-pointer transition-all ${
                    isCurrent 
                      ? 'bg-purple-950/60 border border-purple-500/60 text-white shadow-md' 
                      : 'bg-white/[0.01] text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-mneme-lavender mb-0.5">
                    <span>{seg.title}</span>
                    {isCurrent && <span className="text-emerald-400 font-bold">● SPEAKING</span>}
                  </div>
                  <p className="line-clamp-2">{seg.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-mneme-accent via-purple-500 to-indigo-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

    </div>
  );
}
