import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft, 
  ChevronRight,
  Bot,
  User,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { getCaseById } from '../data/casesData';
import { gnaniService } from '../services/gnaniService';

export default function CrossExamination() {
  const { id } = useParams();
  const caseItem = getCaseById(id) || getCaseById('the-silent-failure');

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Lead Investigator cross-examination channel open for [${caseItem.title}]. You may interrogate the documented telemetry, recorded orders, and forensic findings. All answers are strictly grounded in case records.`,
      status: 'GROUNDED_RECORD',
      timestamp: '11:45 AM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gnaniStatus, setGnaniStatus] = useState({ isLive: false, mode: 'SIMULATED_DEMO_MODE' });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    gnaniService.checkGnaniBackendStatus().then(st => {
      if (st) setGnaniStatus(st);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Preset interrogation prompts
  const presetQueries = [
    'Why was the 11:02 AM vibration spike throttled instead of tripped?',
    'What was the critical missing clue in the oil return sight glass?',
    'What was the documented root cause of the bearing failure?',
    'What was the monetary cost of downtime per hour?',
    'What was the turbine operator doing at 09:00 AM before the shift?' // Intentionally unrecorded to test strict grounding!
  ];

  // Send query to case-grounded endpoint
  const handleSend = async (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend) return;

    gnaniService.playAudioFeedback('click');

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: caseItem.id,
          query: textToSend
        })
      });

      let answerData;
      if (response.ok) {
        answerData = await response.json();
      } else {
        answerData = {
          answer: 'This information is not documented in the available case records.',
          source: 'MNEME Evidence Passport',
          status: 'UNVERIFIED_IN_RECORDS'
        };
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answerData.answer,
        status: answerData.status || 'VERIFIED_RECORD',
        source: answerData.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      gnaniService.playAudioFeedback('alert');

      // Optional auto-TTS using Gnani Timbre
      if (!gnaniService.isMuted) {
        setIsSpeaking(true);
        gnaniService.speakCaseInvestigation(answerData.answer).finally(() => {
          setIsSpeaking(false);
        });
      }
    } catch {
      // Fallback
      const fallbackMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'This information is not documented in the available case records.',
        status: 'UNVERIFIED_IN_RECORDS',
        source: 'MNEME Guardrail Protocol',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // GNANI PRISMA: Toggle voice listening
  const handleToggleVoice = () => {
    if (isListening) {
      gnaniService.stopSpeechRecognition();
      setIsListening(false);
    } else {
      setIsListening(true);
      gnaniService.startSpeechRecognition({
        onResult: (transcript, isFinal) => {
          setInputQuery(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSend(transcript);
          }
        },
        onError: (err) => {
          console.warn('Voice error', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to={`/case/${caseItem.id}`} className="hover:text-white transition-colors">
            {caseItem.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-mneme-lavender font-semibold">Expert Cross-Examination</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-500/25 text-purple-300">
          <Mic className="w-3 h-3 text-purple-400 animate-pulse" />
          <span>Gnani Prisma/Timbre: {gnaniStatus.isLive ? 'LIVE' : 'DEMO MODE'}</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
          Expert Cross-Examination
        </h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          Direct inquiry with the case records. The system is strictly grounded in evidence passport records and refuses to hallucinate undocumented facts.
        </p>
      </div>

      {/* Strict Grounding Badge */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Grounded In: {caseItem.title} Evidence Dossier</span>
        </div>
        <span className="text-[10px] text-slate-500">Hallucination Threshold: ZERO</span>
      </div>

      {/* Chat Messages Thread */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 sm:p-6 backdrop-blur-xl mb-4 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center text-white flex-shrink-0 font-serif text-xs font-bold shadow-md">
                  M
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-sans leading-relaxed ${
                isAi 
                  ? 'bg-mneme-900/90 border border-white/10 text-slate-200'
                  : 'bg-mneme-accent text-white shadow-md shadow-mneme-accent/20'
              }`}>
                {isAi && msg.status && (
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/5 font-mono text-[10px]">
                    <span className={msg.status === 'VERIFIED_RECORD' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {msg.status === 'VERIFIED_RECORD' ? '✓ VERIFIED RECORD' : '⚠️ UNDOCUMENTED'}
                    </span>
                    <span className="text-slate-500">{msg.timestamp}</span>
                  </div>
                )}

                <p>{msg.text}</p>

                {isAi && (
                  <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{msg.source || 'MNEME Evidence Passport'}</span>
                    <button
                      onClick={() => gnaniService.speakCaseInvestigation(msg.text)}
                      className="text-mneme-lavender hover:text-white flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Timbre Readout</span>
                    </button>
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/10 flex items-center justify-center text-white flex-shrink-0 font-mono text-xs">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Interrogation Questions */}
      <div className="mb-4">
        <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
          SUGGESTED FORENSIC INQUIRIES
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(query)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors text-left font-mono"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar with Gnani Prisma STT */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/15 focus-within:border-mneme-accent transition-colors"
      >
        {/* Gnani Prisma Voice Capture Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          title={isListening ? 'Stop speech recognition' : 'Speak inquiry using Gnani Prisma STT'}
          className={`p-3 rounded-xl transition-all ${
            isListening 
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/30'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isListening ? 'Listening via Gnani Prisma...' : 'Type or speak a question regarding the case records...'}
          className="flex-1 bg-transparent px-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isSubmitting}
          className="px-4 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 disabled:opacity-30 text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all"
        >
          <span>Examine</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
