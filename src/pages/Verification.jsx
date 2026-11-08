import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Search, 
  Layers, 
  Lock, 
  ArrowRight,
  ExternalLink,
  Scale
} from 'lucide-react';
import { CASES } from '../data/casesData';

export default function Verification() {
  const { t, getTranslationStatus } = useLanguage();
  const coverageNote = getTranslationStatus('nav.evidence');
  const verifiedCount = CASES.filter(c => c.status === 'VERIFIED').length;
  const publicCaseStudies = CASES.filter(c => c.status === 'PUBLIC CASE STUDY').length;
  const simulatedDemos = CASES.filter(c => c.status === 'SIMULATED DEMO').length;

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DATA INTEGRITY & EVIDENCE FRAMEWORK</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Evidence & Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-2 max-w-3xl leading-relaxed">
          {coverageNote.status !== 'translated' && (<span className="inline-block mr-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-300">English fallback shown for untranslated UI</span>)}
          The foundation of MNEME is uncompromising truth. We distinguish verified historical fact from public case studies and high-fidelity simulations. Here is how evidence is validated, preserved, and guarded against generative hallucination.
        </p>
      </div>

      {/* 5-Pillar Verification Protocol */}
      <div className="space-y-6 mb-12">
        <h2 className="font-serif text-xl font-bold text-white mb-4">
          The 5-Pillar Verification Standard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
              01
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Primary Source Telemetry & Public Inquiries
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Every documented case must be rooted in official investigative reports (such as NTSB, US CSB, IAEA, NASA, or judicial trial exhibits), verified flight data recorder (FDR) streams, or authenticated SCADA logs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
              02
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Cognitive Rationale Over Simple Outcomes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              We reject retrospective bias. Cases must document the incomplete information state, the tempting alternatives that were considered and rejected, and why the practitioner acted under uncertainty.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
              03
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Strict Non-Fabrication AI Grounding Guardrail
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Our AI service layer is programmatically barred from inventing statements, quotes, or missing data. Inquiries regarding undocumented facts strictly return: <code className="text-amber-300 font-mono text-[11px]">"This information is not documented in the available case records."</code>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
              04
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Explicit Simulation Labeling
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Any scenario created for training benchmarks or hypothetical counterfactual exploration is prominently watermarked with <span className="text-purple-300 font-mono text-[11px]">SIMULATED DEMO</span> or <span className="text-rose-300 font-mono text-[11px]">SIMULATED SCENARIO</span>.
            </p>
          </div>

        </div>
      </div>

      {/* Anatomy of an Evidence Passport */}
      <div className="rounded-2xl bg-mneme-900 border border-white/10 p-6 sm:p-8 backdrop-blur-xl mb-12">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Anatomy of the Evidence Passport™
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Every case in the MNEME universe is bound to this cryptographic ledger record.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SPECIFICATION v1.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-500 text-[10px] uppercase block mb-1">1. PRIMARY SOURCE & CITATION</span>
            <p>Official investigation report reference, URL, or de-identified verified contributor testimony.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-500 text-[10px] uppercase block mb-1">2. CHAIN OF CUSTODY</span>
            <p>Cryptographic hash of the ingest dossier, audit timestamp, and contributing working group.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-500 text-[10px] uppercase block mb-1">3. EXPERT DECISION PROVENANCE</span>
            <p>Documented rationale behind the final command, including recorded alternatives that were bypassed.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-500 text-[10px] uppercase block mb-1">4. AI CONTENT DISCLOSURE</span>
            <p>Explicit declaration confirming that all conversational outputs are restricted to documented facts.</p>
          </div>
        </div>
      </div>

      {/* Catalog Status Distribution */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8">
        <h3 className="font-serif text-lg font-bold text-white mb-2">
          Case Status Classification in MNEME
        </h3>
        <p className="text-xs text-slate-400 mb-6 font-light">
          We maintain transparent status badges across all 50 case library slots.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                VERIFIED
              </span>
              <span className="text-slate-300">Primary evidence reviewed and certified by domain panel</span>
            </div>
            <span className="text-slate-500">Certified Archive</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 font-bold text-[10px]">
                PUBLIC CASE STUDY
              </span>
              <span className="text-slate-300">Derived from public agency post-mortems (NTSB, CSB, IAEA, NASA)</span>
            </div>
            <span className="text-slate-500">Public Domain</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold text-[10px]">
                SIMULATED DEMO
              </span>
              <span className="text-slate-300">Synthetic high-fidelity benchmark engineered for interactive training</span>
            </div>
            <span className="text-slate-500">Interactive Demo</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-700/30 text-slate-400 border border-slate-600/30 font-bold text-[10px]">
                COMING SOON
              </span>
              <span className="text-slate-300">Catalog slots undergoing research and de-identification</span>
            </div>
            <span className="text-slate-500">In Research</span>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
          <Link
            to="/universe"
            className="px-5 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white text-xs font-semibold tracking-wider uppercase transition-all"
          >
            Explore Case Library
          </Link>
          <Link
            to="/experience/create"
            className="text-xs font-mono text-mneme-lavender hover:underline"
          >
            Submit an Experience for Verification →
          </Link>
        </div>
      </div>

    </div>
  );
}



