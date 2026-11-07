import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Mic, 
  Lock, 
  GitBranch, 
  Activity, 
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { gnaniService } from '../services/gnaniService';

export default function About() {
  const handleLink = () => {
    gnaniService.playAudioFeedback('click');
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-12 text-center sm:text-left pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MANIFESTO & PHILOSOPHY</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About MNEME
        </h1>
        <p className="text-base text-mneme-lavender font-mono mt-1">
          THE INTELLIGENCE OF EXPERIENCE.
        </p>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-3 max-w-3xl leading-relaxed">
          Developed for the Great Indian AI Internship Challenge by Gnani.ai. A platform built to capture, preserve, investigate, and transform real human experience into interactive learning journeys.
        </p>
      </div>

      {/* Core Philosophy Manifesto */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-950/30 via-mneme-900 to-black border border-purple-500/30 p-8 sm:p-10 mb-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mneme-lavender font-bold">
            THE CENTRAL PHILOSOPHY
          </span>
          <blockquote className="font-serif text-xl sm:text-2xl font-bold text-white leading-relaxed italic">
            "People don't just carry knowledge. They carry experiences, decisions, mistakes, instincts and lessons that are rarely documented."
          </blockquote>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            Most institutional memory disappears the moment an expert retires or leaves the field. Standard manuals record policies and checklists; they rarely capture why a veteran ignored an ambiguous light or felt something was amiss at 11:02 AM. MNEME preserves the reasoning behind human decisions under uncertainty, not merely the final outcome.
          </p>
        </div>
      </div>

      {/* Product Pillars */}
      <div className="space-y-6 mb-12">
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Architectural Innovations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-mneme-accent font-mono text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>THE KNOWLEDGE LOCK™</span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Sequential Chronological Enforcement
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Prevents retrospective bias by strictly withholding future incident telemetry until you commit your decision at that exact second.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
              <GitBranch className="w-4 h-4" />
              <span>THE MULTIVERSE LAB</span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Counterfactual Branching Explorer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Explores "what if" branching consequences. Every alternate path is dynamically simulated and clearly marked <span className="text-purple-300 font-mono text-[11px]">SIMULATED SCENARIO</span>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
              <Mic className="w-4 h-4" />
              <span>GNANI AI VOICE ENGINE</span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Prisma STT & Timbre TTS Integration
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Integrated service layer supporting voice interrogation, audio readout, and spoken experience contributions with high-fidelity client fallback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Activity className="w-4 h-4" />
              <span>MY DECISION DNA</span>
            </div>
            <h3 className="font-serif text-base font-bold text-white">
              Empirical Cognitive Analytics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              A personal learning dashboard tracking real clue discovery rates, expert concordance percentages, and operational risk metrics across sessions.
            </p>
          </div>

        </div>
      </div>

      {/* Challenge Attribution Card */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 font-mono text-xs text-slate-300 space-y-4 mb-12">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-purple-300 font-bold uppercase">Great Indian AI Internship Challenge</span>
          <span className="text-slate-500">Gnani.ai</span>
        </div>

        <p className="leading-relaxed font-sans text-xs text-slate-400">
          MNEME was conceived and engineered specifically for the Great Indian AI Internship Challenge by Gnani.ai. It represents a bold divergence from generic chatbots and software dashboards, introducing an entirely new category: <strong className="text-white">Human Experience & Decision Intelligence</strong>.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px]">
          <span className="px-2 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/5">Stack: React + Vite + Tailwind + Framer Motion</span>
          <span className="px-2 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/5">Backend: Express API + Grounded AI Guardrail</span>
          <span className="px-2 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/5">Voice: Gnani Prisma STT & Gnani Timbre TTS</span>
        </div>
      </div>

      {/* CTA Bottom Bar */}
      <div className="text-center pt-4">
        <Link
          to="/universe"
          onClick={handleLink}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-mneme-accent/20 transition-all"
        >
          <span>Enter the Universe of Experience</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

