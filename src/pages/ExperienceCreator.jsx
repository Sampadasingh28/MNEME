import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { storageService } from '../services/storageService';
import { gnaniService } from '../services/gnaniService';

export default function ExperienceCreator() {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState('');
  const [submittedResult, setSubmittedResult] = useState(null);

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Voice recording support
  const handleToggleVoice = () => {
    if (isRecording) {
      gnaniService.stopSpeechRecognition();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      gnaniService.startSpeechRecognition({
        onResult: (transcript) => {
          setRecordedNotes(transcript);
          // Auto-append to description
          setFormData(prev => ({
            ...prev,
            description: prev.description ? `${prev.description} ${transcript}` : transcript
          }));
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.consentGranted) {
      alert('Please fill out the incident title, narrative, and grant contributor consent.');
      return;
    }

    gnaniService.playAudioFeedback('lock');

    try {
      // 1. Send to server endpoint
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

      // Also persist to local storage
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-2">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>EXPERIENCE CREATOR STUDIO</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Contribute Your Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-2xl">
          Preserve the instincts, missed clues, and critical decisions of your professional career. Submissions undergo expert de-identification before community archiving.
        </p>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        
        {/* Row 1: Title & Domain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Incident / Case Title *
            </label>
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
            
            {/* Voice dictate button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                isRecording 
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? 'Recording...' : 'Dictate by Voice'}</span>
            </button>
          </div>

          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the operational setting, what went wrong, and what immediate warning signs surfaced..."
            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans leading-relaxed"
          />
        </div>

        {/* Forensic Core: Clues Noticed & Decisions Considered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Clues & Subtle Warning Signs Noticed
            </label>
            <textarea
              rows={3}
              value={formData.cluesNoticed}
              onChange={(e) => handleChange('cluesNoticed', e.target.value)}
              placeholder="What telemetry anomalies, sounds, smells, or discrepancies did you notice before others did?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Alternative Options Considered & Rejected
            </label>
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
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Final Decision Taken & Actual Outcome
            </label>
            <textarea
              rows={3}
              value={formData.finalDecisionTaken}
              onChange={(e) => handleChange('finalDecisionTaken', e.target.value)}
              placeholder="What exact command did you execute? What happened as a result?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Mistakes, Regrets & Permanent Lessons
            </label>
            <textarea
              rows={3}
              value={formData.lessonsLearned}
              onChange={(e) => handleChange('lessonsLearned', e.target.value)}
              placeholder="What would you do differently today? What instinct will stay with you forever?"
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-mneme-accent font-sans"
            />
          </div>
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
