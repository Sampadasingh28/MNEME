import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MicOff, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function ExperienceCreator() {
  const { supportedLanguages, interfaceLanguage, narrationLanguage, t, getLanguageByCode } = useLanguage();
  const [activeDictatingField, setActiveDictatingField] = useState(null);
  const [isSpeakingReview, setIsSpeakingReview] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState({ configured: false });
  const [transcript, setTranscript] = useState('');
  const [formData, setFormData] = useState({
    title: '', domain: 'Machine World', incidentDate: '', contributorName: '', organization: '',
    submissionLanguage: interfaceLanguage, narrationLanguage: narrationLanguage,
    consentGranted: false, description: '', cluesNoticed: '', decisionsConsidered: '',
    finalDecisionTaken: '', mistakesAvoided: '', lessonsLearned: ''
  });

  useEffect(() => { voiceService.checkBackendStatus().then((s) => s && setVoiceStatus(s)).catch(() => {}); }, []);
  useEffect(() => { setFormData((p) => ({ ...p, submissionLanguage: interfaceLanguage, narrationLanguage })); }, [interfaceLanguage, narrationLanguage]);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const canRecognize = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleToggleDictation = (field) => {
    if (activeDictatingField === field) { voiceService.stopSpeechRecognition(); setActiveDictatingField(null); return; }
    if (!canRecognize) return;
    voiceService.stopSpeechRecognition();
    setActiveDictatingField(field);
    voiceService.startSpeechRecognition({
      langCode: formData.submissionLanguage,
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          setFormData((prev) => ({ ...prev, [field]: prev[field] ? `${prev[field]}\n${text}`.trim() : text }));
        }
      },
      onError: () => setActiveDictatingField(null),
      onEnd: () => setActiveDictatingField(null)
    });
  };

  const handleListenBack = async () => {
    if (isSpeakingReview) { voiceService.stopSpeaking(); setIsSpeakingReview(false); return; }
    const reviewScript = `Case draft: ${formData.title || 'Untitled'}. ${formData.description || ''}. Lessons: ${formData.lessonsLearned || ''}`;
    if (!reviewScript.trim()) return;
    setIsSpeakingReview(true);
    await voiceService.speak(reviewScript, { langCode: formData.narrationLanguage || narrationLanguage });
    setIsSpeakingReview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.consentGranted) {
      alert('Title, description, and consent are required.');
      return;
    }
    voiceService.stopSpeechRecognition();
    voiceService.stopSpeaking();
    voiceService.playAudioFeedback('lock');
    const payload = {
      ...formData,
      originalLanguage: formData.submissionLanguage,
      originalDescription: formData.description, // preserve original; never overwrite
      description: formData.description,
      translatedDescription: '', // generated translations, if added later, must be stored separately
      voiceTranscript: transcript
    };
    try {
      const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      let resData = { submission: null };
      if (response.ok) resData = await response.json();
      const local = storageService.saveExperienceSubmission(payload);
      setSubmittedResult(resData.submission || local);
      voiceService.playAudioFeedback('success');
    } catch {
      setSubmittedResult(storageService.saveExperienceSubmission(payload));
    }
  };

  if (submittedResult) {
    return (
      <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4"><CheckCircle2 className="w-6 h-6" /></div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-3">Submission Received</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">Original-language content was preserved. Status: <span className="font-mono text-purple-300">{submittedResult.status || 'SUBMITTED'}</span></p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono max-w-md mx-auto mb-8 text-left space-y-1.5">
            <div className="flex items-center justify-between text-emerald-400"><span>Submitted</span><CheckCircle2 className="w-3.5 h-3.5" /></div>
            <div className="flex items-center justify-between text-purple-300"><span>Under review</span><Clock className="w-3.5 h-3.5" /></div>
            <div className="flex items-center justify-between text-slate-500"><span>Verification / publication</span><span>Pending</span></div>
          </div>
          <Link to="/universe" className="px-6 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white text-xs font-semibold tracking-wider uppercase">{t('btn.enterUniverse', 'Explore Cases')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">{t('nav.contribute', 'Contribute')} Experience</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-2xl">Submit in your preferred language. You can dictate text where browser speech recognition is available, edit transcripts, and keep original-language content intact.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">Submission Language</span>
            <select value={formData.submissionLanguage} onChange={(e) => handleChange('submissionLanguage', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-100">{supportedLanguages.map((l) => <option key={l.code} value={l.code} className="text-slate-900">{l.nativeName} — {l.name}</option>)}</select>
          </label>
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">{t('lang.narrationLang', 'Narration Language')}</span>
            <select value={formData.narrationLanguage} onChange={(e) => handleChange('narrationLanguage', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-100">{supportedLanguages.map((l) => <option key={l.code} value={l.code} className="text-slate-900">{l.nativeName} — {l.name}</option>)}</select>
          </label>
        </div>

        {!canRecognize && <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5" />Speech recognition is unavailable in this browser. You can still type and edit your submission.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">Incident / Case Title *</span><input required value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent" /></label>
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">Universe Domain *</span><select value={formData.domain} onChange={(e) => handleChange('domain', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-mneme-900 border border-white/10 text-xs text-slate-200">{UNIVERSES.map((u) => <option key={u.id} value={u.name}>{u.number} • {u.name}</option>)}</select></label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">Period / Year</span><input value={formData.incidentDate} onChange={(e) => handleChange('incidentDate', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white" /></label>
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">Contributor Name / Callsign</span><input value={formData.contributorName} onChange={(e) => handleChange('contributorName', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white" /></label>
          <label className="text-xs font-mono text-slate-300"><span className="block mb-1.5">Organization (Optional)</span><input value={formData.organization} onChange={(e) => handleChange('organization', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white" /></label>
        </div>

        {[
          ['description', 'Incident Narrative *', true],
          ['cluesNoticed', 'Clues / Warning Signs', false],
          ['decisionsConsidered', 'Options Considered / Rejected', false],
          ['finalDecisionTaken', 'Final Decision & Outcome', false],
          ['lessonsLearned', 'Lessons / Instincts', false]
        ].map(([field, label, required]) => (
          <div key={field}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">{label}</label>
              <button type="button" onClick={() => handleToggleDictation(field)} disabled={!canRecognize} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono ${activeDictatingField === field ? 'bg-rose-500 text-white' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'} disabled:opacity-40`}>
                {activeDictatingField === field ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}<span>{activeDictatingField === field ? 'Recording' : 'Dictate'}</span>
              </button>
            </div>
            <textarea required={required} rows={field === 'description' ? 4 : 3} value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent" />
          </div>
        ))}

        {transcript && <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs"><span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Latest recognized speech (editable text is saved in the field)</span><p className="text-slate-300">{transcript}</p></div>}

        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3">
          <div><span className="font-bold text-white block text-xs">Draft audio preview</span><span className="text-[11px] text-slate-400">Uses selected narration language where supported; otherwise text remains available.</span></div>
          <button type="button" onClick={handleListenBack} className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] text-xs font-mono text-purple-300 border border-purple-500/30 flex items-center gap-1.5">{isSpeakingReview ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}<span>{isSpeakingReview ? 'Stop' : 'Play'}</span></button>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 cursor-pointer">
          <input type="checkbox" required checked={formData.consentGranted} onChange={(e) => handleChange('consentGranted', e.target.checked)} className="mt-1 accent-mneme-accent" />
          <span>I consent to review/de-identification for this submission and confirm it does not violate privacy, trade-secret, or classified-information obligations. Original-language content will be preserved.</span>
        </label>

        <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-mneme-accent/25 flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /><span>Submit for Review</span></button>
      </form>
    </div>
  );
}
