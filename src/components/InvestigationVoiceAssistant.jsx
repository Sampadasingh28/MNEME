import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Bot, Radio, AlertTriangle } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

const NOT_IN_RECORDS = {
  en: 'This information is not documented in the available case records.',
  hi: 'यह जानकारी उपलब्ध केस रिकॉर्ड में दर्ज नहीं है।',
  bn: 'এই তথ্য উপলব্ধ কেস রেকর্ডে নথিভুক্ত নেই।',
  ta: 'இந்த தகவல் கிடைக்கும் வழக்கு பதிவுகளில் ஆவணப்படுத்தப்படவில்லை.',
  te: 'ఈ సమాచారం అందుబాటులో ఉన్న కేసు రికార్డులలో నమోదు కాలేదు.',
  mr: 'ही माहिती उपलब्ध केस नोंदींमध्ये दस्तऐवजीकृत नाही.',
  gu: 'આ માહિતી ઉપલબ્ધ કેસ રેકોર્ડમાં નોંધાયેલ નથી.',
  kn: 'ಈ ಮಾಹಿತಿ ಲಭ್ಯವಿರುವ ಪ್ರಕರಣ ದಾಖಲೆಗಳಲ್ಲಿ ದಾಖಲಾಗಿಲ್ಲ.',
  ml: 'ഈ വിവരം ലഭ്യമായ കേസ് രേഖകളിൽ രേഖപ്പെടുത്തിയിട്ടില്ല.',
  pa: 'ਇਹ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਕੇਸ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਦਰਜ ਨਹੀਂ ਹੈ।',
  or: 'ଏହି ସୂଚନା ଉପଲବ୍ଧ କେସ୍ ରେକର୍ଡରେ ଦଲିଲଭୁକ୍ତ ନୁହେଁ।',
  as: 'এই তথ্য উপলব্ধ কেছ ৰেকৰ্ডত নথিভুক্ত কৰা হোৱা নাই।',
  ur: 'یہ معلومات دستیاب کیس ریکارڈ میں درج نہیں ہیں۔',
  bho: 'ई जानकारी उपलब्ध केस रिकॉर्ड में दर्ज नइखे।'
};

export default function InvestigationVoiceAssistant({ caseItem, currentStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState({ configured: false, mode: 'BROWSER_FALLBACK' });
  const { interfaceLanguage, narrationLanguage, currentInterfaceLang, currentNarrationLang, hasVoiceSupport, t } = useLanguage();

  useEffect(() => { voiceService.checkBackendStatus().then((s) => s && setVoiceStatus(s)).catch(() => {}); }, []);

  const notInRecords = NOT_IN_RECORDS[interfaceLanguage] || NOT_IN_RECORDS.en;
  const canSpeakResponse = hasVoiceSupport(narrationLanguage);
  const canRecognize = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const submitQuery = async (queryText) => {
    const text = (queryText || transcript).trim();
    if (!text) return;
    setIsEvaluating(true);
    voiceService.playAudioFeedback('click');
    try {
      const res = await fetch('/api/cross-examine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseItem?.id, query: text, language: interfaceLanguage })
      });
      let data = { answer: notInRecords, source: 'MNEME Evidence Passport', status: 'UNVERIFIED_IN_RECORDS' };
      if (res.ok) data = await res.json();
      // Localize the standard refusal when backend returns it in English.
      if (data.answer === NOT_IN_RECORDS.en && interfaceLanguage !== 'en') data = { ...data, answer: notInRecords };
      setAssistantResponse(data);
      voiceService.playAudioFeedback('alert');
      if (!voiceService.isMuted && canSpeakResponse) {
        setIsSpeaking(true);
        voiceService.speak(data.answer, { langCode: narrationLanguage }).finally(() => setIsSpeaking(false));
      }
    } catch {
      setAssistantResponse({ answer: notInRecords, source: 'MNEME Guardrail Protocol', status: 'UNVERIFIED_IN_RECORDS' });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      voiceService.stopSpeechRecognition();
      setIsListening(false);
      return;
    }
    if (!canRecognize) return;
    setIsListening(true);
    setTranscript('');
    voiceService.startSpeechRecognition({
      langCode: interfaceLanguage,
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          setIsListening(false);
          submitQuery(text);
        }
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false)
    });
  };

  const quickQuestions = [
    'What happened at the key timestamp in this case?',
    'What evidence is documented in the records?',
    'What was the documented expert decision?',
    'What outcome is documented in the records?'
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button onClick={() => { voiceService.playAudioFeedback('click'); setIsOpen(!isOpen); }} className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-700 text-white font-semibold text-xs tracking-wider shadow-2xl shadow-mneme-accent/30 border border-purple-400/40 transition-all transform hover:scale-105">
          <Mic className="w-4 h-4 text-white" /><span className="font-mono uppercase text-[11px]">{t('btn.askAssistant', 'Ask Voice Assistant')}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:pr-6 p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-mneme-950 border border-purple-500/40 p-5 shadow-2xl text-slate-100 font-sans max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center text-white"><Bot className="w-4 h-4" /></div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white">Case Assistant</h3>
                  <span className="text-[10px] text-mneme-lavender font-mono block">Grounded in case records • UI: {currentInterfaceLang?.nativeName} • Voice: {currentNarrationLang?.nativeName}</span>
                </div>
              </div>
              <button onClick={() => { voiceService.playAudioFeedback('click'); voiceService.stopSpeaking(); setIsOpen(false); }} className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/30 border border-purple-500/25 text-[10px] font-mono text-purple-300">
                <div className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-purple-400" /><span>Voice mode:</span></div>
                <span className="text-white font-semibold">{voiceStatus.configured ? 'Provider configured + fallback' : 'Browser/text fallback'}</span>
              </div>

              {!canRecognize && <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-[11px] flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />Speech recognition is unavailable in this browser. Use the text box below.</div>}

              <div className="py-2 text-center space-y-2">
                <button type="button" onClick={handleToggleListening} disabled={!canRecognize} className={`relative w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all ${isListening ? 'bg-rose-600 text-white' : 'bg-gradient-to-br from-mneme-accent to-purple-800 text-white'} disabled:opacity-40`}>
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
                <span className="text-xs font-mono font-bold block text-white">{isListening ? 'Listening...' : 'Tap to speak'}</span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-slate-500 block">Question (editable text)</label>
                <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={3} className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent" placeholder="Ask about documented evidence, decisions, or outcomes..." />
                <button onClick={() => submitQuery()} disabled={!transcript.trim() || isEvaluating} className="w-full py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 disabled:opacity-40 text-white text-xs font-semibold">Ask (grounded)</button>
              </div>

              {isEvaluating && <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-slate-400 animate-pulse">Checking documented case records...</div>}

              {assistantResponse && !isEvaluating && (
                <div className="p-4 rounded-xl bg-mneme-900 border border-purple-500/40 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-mono text-[10px]">
                    <span className={assistantResponse.status === 'VERIFIED_RECORD' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{assistantResponse.status === 'VERIFIED_RECORD' ? 'DOCUMENTED RECORD' : 'NOT IN RECORDS'}</span>
                    {isSpeaking && <button onClick={() => { voiceService.stopSpeaking(); setIsSpeaking(false); }} className="text-rose-400 flex items-center gap-1"><VolumeX className="w-3 h-3" /> Stop</button>}
                  </div>
                  <p className="text-slate-200 leading-relaxed">{assistantResponse.answer}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{assistantResponse.source || 'MNEME Evidence Record'}</span>
                    <button onClick={() => voiceService.speak(assistantResponse.answer, { langCode: narrationLanguage })} disabled={!canSpeakResponse} className="text-mneme-lavender hover:text-white flex items-center gap-1 disabled:opacity-40"><Volume2 className="w-3 h-3" /> Read Aloud</button>
                  </div>
                  {!canSpeakResponse && <p className="text-[10px] text-amber-200">{t('common.voiceUnavailable', 'Text is available.')}</p>}
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Suggested questions</span>
                {quickQuestions.map((q) => (
                  <button key={q} onClick={() => { setTranscript(q); submitQuery(q); }} className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[11px] text-slate-300 hover:text-white font-mono">{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
