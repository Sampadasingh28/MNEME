import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Lock, GitBranch, Activity, ArrowRight, Mic, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { voiceService } from '../services/voiceService';

export default function About() {
  const { t } = useLanguage();
  const handleLink = () => voiceService.playAudioFeedback('click');

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12 text-center sm:text-left pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MANIFESTO & POSITIONING</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">MNEME</h1>
        <p className="text-base text-mneme-lavender font-mono mt-1">THE INTELLIGENCE OF EXPERIENCE.</p>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-3 max-w-3xl leading-relaxed">
          MNEME is an independent Human Experience and Decision Intelligence Platform. It preserves the reasoning behind human decisions under uncertainty and turns documented incidents into interactive investigations.
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-purple-950/30 via-mneme-900 to-black border border-purple-500/30 p-8 sm:p-10 mb-12">
        <span className="text-[10px] font-mono uppercase tracking-widest text-mneme-lavender font-bold">CENTRAL PHILOSOPHY</span>
        <blockquote className="font-serif text-xl sm:text-2xl font-bold text-white leading-relaxed italic mt-3">
          "People don't just carry knowledge. They carry experiences, decisions, mistakes, instincts and lessons that are rarely documented."
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mt-4">
          MNEME is built to preserve practical judgment — warning signs, rejected options, rationale, and documented outcomes — without replacing historical facts with fabricated narratives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-mneme-accent font-mono text-xs font-bold"><Lock className="w-4 h-4" /><span>KNOWLEDGE LOCK™</span></div>
          <h3 className="font-serif text-base font-bold text-white">Sequential Chronological Reveal</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Future evidence and outcomes remain unavailable until decisions are committed at the current stage.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold"><GitBranch className="w-4 h-4" /><span>MULTIVERSE LAB</span></div>
          <h3 className="font-serif text-base font-bold text-white">Counterfactual Exploration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Alternate paths are explored as clearly labeled simulations, never presented as documented historical outcomes.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold"><Globe className="w-4 h-4" /><span>MULTILINGUAL ACCESS</span></div>
          <h3 className="font-serif text-base font-bold text-white">Interface and Narration Languages</h3>
          <p className="text-xs text-slate-400 leading-relaxed">MNEME supports extensible multilingual presentation with independent interface and narration language selection, including RTL support for Urdu.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold"><Mic className="w-4 h-4" /><span>VOICE WITH FALLBACKS</span></div>
          <h3 className="font-serif text-base font-bold text-white">Provider-Independent Voice Layer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Speech features use available browser capabilities and optional configured server providers. Unsupported languages fall back to text and transcripts.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 text-xs text-slate-300 space-y-3 mb-12">
        <div className="flex items-center gap-2 text-white font-semibold"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Independent Product Identity</div>
        <p className="text-slate-400 leading-relaxed">MNEME is presented as an independent product for learning, preservation, and decision intelligence. It avoids company-specific branding, recruitment framing, and fabricated integrations. Factual case records remain unchanged.</p>
      </div>

      <div className="text-center pt-4">
        <Link to="/universe" onClick={handleLink} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-mneme-accent/20 transition-all">
          <span>{t('btn.enterUniverse', 'ENTER THE UNIVERSE')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
