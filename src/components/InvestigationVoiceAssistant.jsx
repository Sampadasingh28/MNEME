import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  User, 
  HelpCircle,
  Clock,
  Radio
} from 'lucide-react';
import { gnaniService } from '../services/gnaniService';

export default function InvestigationVoiceAssistant({ caseItem, currentStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [gnaniStatus, setGnaniStatus] = useState({ isLive: false, mode: 'SIMULATED_DEMO_MODE' });

  useEffect(() => {
    gnaniService.checkGnaniBackendStatus().then(st => {
      if (st) setGnaniStatus(st);
    });
  }, []);

  const quickQuestions = [
    'Why was the turbine throttled to 60% instead of tripped?',
    'What did the silver flake in the sight glass prove?',
    'What was the documented root cause of this failure?',
    'What was the hourly cost of machine downtime?'
  ];

  // Start / Stop listening via Gnani Prisma STT
  const handleToggleListening = () => {
    if (isListening) {
      gnaniService.stopSpeechRecognition();
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript('');
      gnaniService.playAudioFeedback('click');

      gnaniService.startSpeechRecognition({
        onResult: (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            submitQuery(text);
          }
        },
        onError: (err) => {
          console.warn('Voice STT error:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  // Submit query to case-grounded endpoint
  const submitQuery = async (queryText) => {
    const text = (queryText || transcript).trim();
    if (!text) return;

    setIsEvaluating(true);
    gnaniService.playAudioFeedback('click');

    try {
      const res = await fetch('/api/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: caseItem.id,
          query: text
        })
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        data = {
          answer: 'This information is not documented in the available case records.',
          source: 'MNEME Evidence Passport',
          status: 'UNVERIFIED_IN_RECORDS'
        };
      }

      setAssistantResponse(data);
      gnaniService.playAudioFeedback('alert');

      // Speak answer using Gnani Timbre TTS
      if (!gnaniService.isMuted) {
        setIsSpeaking(true);
        gnaniService.speakCaseInvestigation(data.answer).finally(() => {
          setIsSpeaking(false);
        });
      }
    } catch {
      setAssistantResponse({
        answer: 'This information is not documented in the available case records.',
        source: 'MNEME Guardrail Protocol',
        status: 'UNVERIFIED_IN_RECORDS'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStopSpeaking = () => {
    gnaniService.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            gnaniService.playAudioFeedback('click');
            setIsOpen(!isOpen);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold text-xs tracking-wider shadow-2xl shadow-mneme-accent/30 border border-purple-400/40 transition-all transform hover:scale-105"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Mic className="w-4 h-4 text-white" />
          <span className="font-mono uppercase text-[11px]">Ask Voice Assistant</span>
        </button>
      </div>

      {/* Slide-out / Modal Voice Assistant Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:pr-6 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-mneme-950 border border-purple-500/40 p-5 shadow-2xl shadow-purple-950/40 text-slate-100 font-sans max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white">
                    Investigation Voice Assistant
                  </h3>
                  <span className="text-[10px] text-mneme-lavender font-mono block">
                    Case Grounded • Gnani Prisma & Timbre
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  gnaniService.playAudioFeedback('click');
                  handleStopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* Voice Engine Pill */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/30 border border-purple-500/25 text-[10px] font-mono text-purple-300">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>STT / TTS Engine:</span>
                </div>
                <span className="text-white font-semibold">
                  {gnaniStatus.isLive ? 'Live Gnani API' : 'Gnani Protocol (Demo Fallback)'}
                </span>
              </div>

              {/* Central Voice Capture Button */}
              <div className="py-4 text-center space-y-3">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`relative w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/50 scale-110'
                      : 'bg-gradient-to-br from-mneme-accent to-purple-800 text-white shadow-lg shadow-mneme-accent/30 hover:scale-105'
                  }`}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-75 pointer-events-none" />
                  )}
                  {isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>

                <div>
                  <span className="text-xs font-mono font-bold block text-white">
                    {isListening ? 'Listening via Gnani Prisma...' : 'Tap to Speak Question'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ask about clues, telemetry, expert decisions, or consequences.
                  </span>
                </div>
              </div>

              {/* Live Transcript / Input Display */}
              {transcript && (
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Your Spoken Question:</span>
                  <p className="text-white">"{transcript}"</p>
                </div>
              )}

              {/* Assistant Response Box */}
              {isEvaluating && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-slate-400">
                  <span className="animate-pulse">Consulting Evidence Passport records...</span>
                </div>
              )}

              {assistantResponse && !isEvaluating && (
                <div className="p-4 rounded-xl bg-mneme-900 border border-purple-500/40 text-xs font-sans space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-mono text-[10px]">
                    <span className={assistantResponse.status === 'VERIFIED_RECORD' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {assistantResponse.status === 'VERIFIED_RECORD' ? '✓ VERIFIED RECORD' : '⚠️ UNDOCUMENTED IN CASE'}
                    </span>
                    {isSpeaking && (
                      <button 
                        onClick={handleStopSpeaking}
                        className="text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <VolumeX className="w-3 h-3" /> Stop Voice
                      </button>
                    )}
                  </div>

                  <p className="text-slate-200 leading-relaxed font-light">
                    {assistantResponse.answer}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{assistantResponse.source || 'MNEME Evidence Record'}</span>
                    <button
                      onClick={() => gnaniService.speakCaseInvestigation(assistantResponse.answer)}
                      className="text-mneme-lavender hover:text-white flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" /> Read Aloud
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Spoken Inquiries */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  SUGGESTED CASE INQUIRIES:
                </span>
                <div className="space-y-1">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setTranscript(q);
                        submitQuery(q);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[11px] text-slate-300 hover:text-white font-mono transition-colors"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
