import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Info,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { storageService } from '../services/storageService';
import { gnaniService } from '../services/gnaniService';

export default function ExperienceCreator() {
  const [activeDictatingField, setActiveDictatingField] = useState(null);
  const [isSpeakingReview, setIsSpeakingReview] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [gnaniStatus, setGnaniStatus] = useState({ isLive: false, mode: 'SIMULATED_DEMO_MODE' });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Machine World',
    incidentDate: '',
    contributorName: '',
    organization: '',
    isAnonymous: false,
    consentGranted: false,
    description: '',
    cluesNoticed: '',
    decisionsConsidered: '',
    finalDecisionTaken: '',
    mistakesAvoided: '',
    lessonsLearned: ''
  });

  useEffect(() => {
    gnaniService.checkGnaniBackendStatus().then(st => {
      if (st) setGnaniStatus(st);
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Field-specific voice dictation with Gnani Prisma STT
  const handleToggleDictation = (field) => {
    if (activeDictatingField === field) {
      gnaniService.stopSpeechRecognition();
      setActiveDictatingField(null);
    } else {
      gnaniService.stopSpeechRecognition();
      setActiveDictatingField(field);
      gnaniService.playAudioFeedback('click');

      gnaniService.startSpeechRecognition({
        onResult: (transcript) => {
          setFormData(prev => ({
            ...prev,
            [field]: prev[field] ? `${prev[field]} ${transcript}` : transcript
          }));
        },
        onError: () => setActiveDictatingField(null),
        onEnd: () => setActiveDictatingField(null)
      });
    }
  };

  // Listen back to drafted experience with Gnani Timbre TTS
  const handleListenBack = () => {
    if (isSpeakingReview) {
      gnaniService.stopSpeaking();
      setIsSpeakingReview(false);
      return;
    }

    const reviewScript = `Case submission draft: ${formData.title || 'Untitled Incident'}. Domain: ${formData.domain}. Incident narrative: ${formData.description || 'No description entered.'} Clues noticed: ${formData.cluesNoticed || 'None specified.'} Lessons learned: ${formData.lessonsLearned || 'None specified.'}`;
    
    setIsSpeakingReview(true);
    gnaniService.speakCaseInvestigation(reviewScript).finally(() => {
      setIsSpeakingReview(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.consentGranted) {
      alert('Please fill out the incident title, narrative, and grant contributor consent.');
      return;
    }

    gnaniService.stopSpeechRecognition();
    gnaniService.stopSpeaking();
    gnaniService.playAudioFeedback('lock');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let resData;
      if (response.ok) {
        resData = await response.json();
      } else {
        resData = {
          submission: storageService.saveExperienceSubmission(formData)
        };
      }

      storageService.saveExperienceSubmission(formData);
      setSubmittedResult(resData.submission);
      gnaniService.playAudioFeedback('success');
    } catch {
      const saved = storageService.saveExperienceSubmission(formData);
      setSubmittedResult(saved);
    }
  };

  if (submittedResult) {
    return (
      <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
            INGESTION CONFIRMED
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Experience Archived For Forensic Review
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto font-light mb-6">
            Your incident submission <strong className="text-white font-mono">[{submittedResult.title}]</strong> has been stored in MNEME’s ingestion ledger under ID <span className="text-purple-300 font-mono">{submittedResult.id}</span>.
          </p>

          {/* Workflow Status Tracker */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono max-w-md mx-auto mb-8 text-left">
            <span className="text-slate-500 text-[10px] block mb-2 uppercase">VERIFICATION LIFECYCLE:</span>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400">
                <span>1. Ingested & Cryptographically Salted</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span>2. Under Editorial & De-identification Review</span>
                <Clock className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>3. Primary Evidence Cross-Check</span>
                <span>Pending</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>4. Case Library Publication</span>
                <span>Pending</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/universe"
              className="px-6 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white text-xs font-semibold tracking-wider uppercase transition-all"
            >
              Explore Existing Cases
            </Link>
            <button
              onClick={() => {
                setSubmittedResult(null);
                setFormData({
                  title: '',
                  domain: 'Machine World',
                  incidentDate: '',
                  contributorName: '',
                  organization: '',
                  isAnonymous: false,
                  consentGranted: false,
                  description: '',
                  cluesNoticed: '',
                  decisionsConsidered: '',
                  finalDecisionTaken: '',
                  mistakesAvoided: '',
                  lessonsLearned: ''
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/10"
            >
              Submit Another Incident
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>EXPERIENCE CREATOR STUDIO</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-purple-300 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>Gnani Voice Recording: {gnaniStatus.isLive ? 'LIVE' : 'DEMO MODE'}</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Contribute Your Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-2xl">
          Preserve the instincts, missed clues, and critical decisions of your professional career. You can dictate any field using speech-to-text, edit text freely, and listen back before submission.
        </p>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        
        {/* Row 1: Title & Domain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Incident / Case Title *
              </label>
              <button
                type="button"
                onClick={() => handleToggleDictation('title')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  activeDictatingField === 'title' 
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                }`}
              >
                {activeDictatingField === 'title' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>{activeDictatingField === 'title' ? 'Recording...' : 'Dictate'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. High-Pressure Oxygen Line Micro-Fracture"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Universe Domain *
            </label>
            <select
              value={formData.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-mneme-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-mneme-accent"
            >
              {UNIVERSES.map(u => (
                <option key={u.id} value={u.name}>{u.number} • {u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Date & Contributor */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Approximate Period / Year
            </label>
            <input
              type="text"
              value={formData.incidentDate}
              onChange={(e) => handleChange('incidentDate', e.target.value)}
              placeholder="e.g. October 2023 or 2021"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Contributor Name or Callsign
            </label>
            <input
              type="text"
              value={formData.contributorName}
              onChange={(e) => handleChange('contributorName', e.target.value)}
              placeholder="e.g. Lead Instrumentation Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Organization / Industry (Optional)
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g. Aerospace Propulsion"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent"
            />
          </div>
        </div>

        {/* Incident Narrative with Voice Recording */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono text-slate-300">
              The Incident Narrative & Initial Context *
            </label>
            
            <button
              type="button"
              onClick={() => handleToggleDictation('description')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                activeDictatingField === 'description' 
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              {activeDictatingField === 'description' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{activeDictatingField === 'description' ? 'Recording Speech...' : 'Dictate by Voice'}</span>
            </button>
          </div>

          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the operational setting, what went wrong, and what immediate warning signs surfaced (or tap Dictate by Voice to speak)..."
            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans leading-relaxed"
          />
        </div>

        {/* Forensic Core: Clues Noticed & Decisions Considered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Clues & Subtle Warning Signs
              </label>
              <button
                type="button"
                onClick={() => handleToggleDictation('cluesNoticed')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                  activeDictatingField === 'cluesNoticed' ? 'bg-rose-500 text-white animate-pulse' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                }`}
              >
                <Mic className="w-3 h-3" /> Dictate
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.cluesNoticed}
              onChange={(e) => handleChange('cluesNoticed', e.target.value)}
              placeholder="What telemetry anomalies, sounds, smells, or discrepancies did you notice before others did?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Rejected Options Considered
              </label>
              <button
                type="button"
                onClick={() => handleToggleDictation('decisionsConsidered')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                  activeDictatingField === 'decisionsConsidered' ? 'bg-rose-500 text-white animate-pulse' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                }`}
              >
                <Mic className="w-3 h-3" /> Dictate
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.decisionsConsidered}
              onChange={(e) => handleChange('decisionsConsidered', e.target.value)}
              placeholder="What other paths were on the table? Why did you decide against them?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>
        </div>

        {/* Final Decision & Lessons Learned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Final Decision & Actual Outcome
              </label>
              <button
                type="button"
                onClick={() => handleToggleDictation('finalDecisionTaken')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                  activeDictatingField === 'finalDecisionTaken' ? 'bg-rose-500 text-white animate-pulse' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                }`}
              >
                <Mic className="w-3 h-3" /> Dictate
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.finalDecisionTaken}
              onChange={(e) => handleChange('finalDecisionTaken', e.target.value)}
              placeholder="What exact command did you execute? What happened as a result?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Lessons & Permanent Instincts
              </label>
              <button
                type="button"
                onClick={() => handleToggleDictation('lessonsLearned')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                  activeDictatingField === 'lessonsLearned' ? 'bg-rose-500 text-white animate-pulse' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                }`}
              >
                <Mic className="w-3 h-3" /> Dictate
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.lessonsLearned}
              onChange={(e) => handleChange('lessonsLearned', e.target.value)}
              placeholder="What would you do differently today? What instinct will stay with you forever?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>
        </div>

        {/* Audio Review Utility: Listen back to drafted experience */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <div className="text-xs">
              <span className="font-bold text-white block">Audit Spoken Audio Preview</span>
              <span className="text-[11px] text-slate-400">Hear your drafted incident read aloud by Gnani Timbre voice.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleListenBack}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors"
          >
            {isSpeakingReview ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeakingReview ? 'Stop Audio' : 'Play Draft Preview'}</span>
          </button>
        </div>

        {/* Consent and Verification Agreement */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs font-mono">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              required
              checked={formData.consentGranted}
              onChange={(e) => handleChange('consentGranted', e.target.checked)}
              className="mt-1 accent-mneme-accent cursor-pointer"
            />
            <label htmlFor="consent" className="text-slate-300 cursor-pointer leading-relaxed">
              <strong className="text-white">Contributor Consent & Privacy Agreement:</strong> I grant permission for MNEME to de-identify, format into a structured investigation stage, and review this incident. I confirm this disclosure does not violate trade secret laws, patient privacy (HIPAA), or active classified defense protocols.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-mneme-accent/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit Incident For Editorial Ingestion</span>
          </button>
        </div>

      </form>

    </div>
  );
}
