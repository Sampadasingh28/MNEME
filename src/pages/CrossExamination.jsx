import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mic, MicOff, Send, Volume2, ShieldCheck, ChevronRight, Bot, User, AlertTriangle } from 'lucide-react';
import { getCaseById } from '../data/casesData';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

const NOT_IN_RECORDS = { en: 'This information is not documented in the available case records.', hi: 'यह जानकारी उपलब्ध केस रिकॉर्ड में दर्ज नहीं है।', bn: 'এই তথ্য উপলব্ধ কেস রেকর্ডে নথিভুক্ত নেই।', ta: 'இந்த தகவல் கிடைக்கும் வழக்கு பதிவுகளில் ஆவணப்படுத்தப்படவில்லை।', te: 'ఈ సమాచారం అందుబాటులో ఉన్న కేసు రికార్డులలో నమోదు కాలేదు।', mr: 'ही माहिती उपलब्ध केस नोंदींमध्ये दस्तऐवजीकृत नाही.', gu: 'આ માહિતી ઉપલબ્ધ કેસ રેકોર્ડમાં નોંધાયેલ નથી.', kn: 'ಈ ಮಾಹಿತಿ ಲಭ್ಯವಿರುವ ಪ್ರಕರಣ ದಾಖಲೆಗಳಲ್ಲಿ ದಾಖಲಾಗಿಲ್ಲ.', ml: 'ഈ വിവരം ലഭ്യമായ കേസ് രേഖകളിൽ രേഖപ്പെടുത്തിയിട്ടില്ല.', pa: 'ਇਹ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਕੇਸ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਦਰਜ ਨਹੀਂ ਹੈ।', or: 'ଏହି ସୂଚନା ଉପଲବ୍ଧ କେସ୍ ରେକର୍ଡରେ ଦଲିଲଭୁକ୍ତ ନୁହେଁ।', as: 'এই তথ্য উপলব্ধ কেছ ৰেকৰ্ডত নথিভুক্ত কৰা হোৱা নাই।', ur: 'یہ معلومات دستیاب کیس ریکارڈ میں درج نہیں ہیں۔', bho: 'ई जानकारी उपलब्ध केस रिकॉर्ड में दर्ज नइखे।' };

export default function CrossExamination() {
  const { id } = useParams();
  const caseItem = getCaseById(id) || getCaseById('the-silent-failure');
  const { t, interfaceLanguage, narrationLanguage, getCaseContent, hasVoiceSupport } = useLanguage();
  const localized = getCaseContent(caseItem);
  const notInRecords = NOT_IN_RECORDS[interfaceLanguage] || NOT_IN_RECORDS.en;

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    setMessages([{ id: 'init', sender: 'ai', text: `Grounded cross-examination for [${localized.title}]. Answers are restricted to documented case records.`, status: 'GROUNDED_RECORD', timestamp: '' }]);
  }, [caseItem.id, interfaceLanguage]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const presetQueries = ['What happened at 11:02 AM?', 'What was the expert decision and why?', 'What was the documented root cause?', 'What were the documented costs?', 'What was not documented in the records?'];
  const canRecognize = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleSend = async (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend) return;
    voiceService.playAudioFeedback('click');
    setMessages((p) => [...p, { id: `u-${Date.now()}`, sender: 'user', text: textToSend }]);
    setInputQuery('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/cross-examine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ caseId: caseItem.id, query: textToSend, language: interfaceLanguage }) });
      let answerData = { answer: notInRecords, source: 'MNEME Evidence Passport', status: 'UNVERIFIED_IN_RECORDS' };
      if (response.ok) answerData = await response.json();
      if (answerData.answer === NOT_IN_RECORDS.en && interfaceLanguage !== 'en') answerData = { ...answerData, answer: notInRecords };
      setMessages((p) => [...p, { id: `a-${Date.now()}`, sender: 'ai', text: answerData.answer, status: answerData.status, source: answerData.source }]);
      if (hasVoiceSupport(narrationLanguage) && !voiceService.isMuted) voiceService.speak(answerData.answer, { langCode: narrationLanguage });
    } catch {
      setMessages((p) => [...p, { id: `a-${Date.now()}`, sender: 'ai', text: notInRecords, status: 'UNVERIFIED_IN_RECORDS', source: 'MNEME Guardrail Protocol' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVoice = () => {
    if (isListening) { voiceService.stopSpeechRecognition(); setIsListening(false); return; }
    if (!canRecognize) return;
    setIsListening(true);
    voiceService.startSpeechRecognition({
      langCode: interfaceLanguage,
      onResult: (transcript, isFinal) => { setInputQuery(transcript); if (isFinal && transcript.trim()) { setIsListening(false); handleSend(transcript); } },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false)
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400"><Link to={`/case/${caseItem.id}`} className="hover:text-white">{localized.title}</Link><ChevronRight className="w-3.5 h-3.5 text-slate-600" /><span className="text-mneme-lavender font-semibold">Grounded Assistant</span></div>
        <div className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-slate-300">{t('lang.interfaceLang', 'Interface')}/{t('lang.narrationLang', 'Narration')}: {interfaceLanguage.toUpperCase()}/{narrationLanguage.toUpperCase()}</div>
      </div>
      <div className="mb-6"><h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">Case Assistant</h1><p className="text-xs text-slate-400 font-light mt-1">Answers are grounded in documented case records. If information is not documented, MNEME states that clearly.</p></div>
      {!canRecognize && <div className="mb-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5" />Speech recognition unavailable in this browser. Text input is available.</div>}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 sm:p-6 mb-4 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
              {isAi && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center text-white flex-shrink-0"><Bot className="w-4 h-4" /></div>}
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${isAi ? 'bg-mneme-900/90 border border-white/10 text-slate-200' : 'bg-mneme-accent text-white'}`}>
                {isAi && msg.status && <div className="pb-1.5 mb-2 border-b border-white/5 font-mono text-[10px]"><span className={msg.status === 'VERIFIED_RECORD' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{msg.status === 'VERIFIED_RECORD' ? 'DOCUMENTED RECORD' : 'NOT IN RECORDS'}</span></div>}
                <p>{msg.text}</p>
                {isAi && <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500"><span>{msg.source || 'MNEME Evidence Passport'}</span><button onClick={() => voiceService.speak(msg.text, { langCode: narrationLanguage })} className="text-mneme-lavender hover:text-white flex items-center gap-1"><Volume2 className="w-3 h-3" /> Read Aloud</button></div>}
              </div>
              {!isAi && <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0"><User className="w-4 h-4" /></div>}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="mb-4"><span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">Suggested questions</span><div className="flex flex-wrap gap-2">{presetQueries.map((q) => <button key={q} onClick={() => handleSend(q)} className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-[11px] text-slate-300 hover:text-white text-left font-mono">{q}</button>)}</div></div>
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/15 focus-within:border-mneme-accent">
        <button type="button" onClick={handleToggleVoice} disabled={!canRecognize} className={`p-3 rounded-xl ${isListening ? 'bg-rose-500 text-white' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'} disabled:opacity-40`}>{isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>
        <input type="text" value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} placeholder="Ask a question about documented case records..." className="flex-1 bg-transparent px-2 text-xs text-white placeholder-slate-500 focus:outline-none" />
        <button type="submit" disabled={!inputQuery.trim() || isSubmitting} className="px-4 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 disabled:opacity-30 text-white text-xs font-semibold flex items-center gap-1.5"><span>Ask</span><Send className="w-3.5 h-3.5" /></button>
      </form>
    </div>
  );
}
