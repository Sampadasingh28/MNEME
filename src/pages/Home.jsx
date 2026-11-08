import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, GitBranch, ShieldCheck, Clock, ChevronRight, Mic } from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { CASES } from '../data/casesData';
import CaseCard from '../components/CaseCard';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t, getCaseContent, currentNarrationLang } = useLanguage();
  const featuredCases = CASES.filter((c) => c.featured).map(getCaseContent);
  const handleCtaClick = () => voiceService.playAudioFeedback('lock');

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-mneme-accent/30 selection:text-white">
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-mneme-accent/20 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-inner mb-8">
            <span className="w-2 h-2 rounded-full bg-mneme-accent animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-mneme-lavender font-semibold">MNEME • INDEPENDENT DECISION INTELLIGENCE</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            {t('hero.headline1', 'EVERY EXPERIENCE')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-mneme-lavender to-mneme-purple">{t('hero.headline2', 'HOLDS A DECISION.')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-10">{t('hero.subtitle', 'Explore the hidden reasoning, critical decisions and human experiences that shape the world around us.')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-8">
            <Link to="/universe" onClick={handleCtaClick} className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm tracking-wider uppercase shadow-xl shadow-mneme-accent/25 transition-all flex items-center justify-center gap-2">
              <span>{t('btn.enterUniverse', 'ENTER THE UNIVERSE')}</span><ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" onClick={() => voiceService.playAudioFeedback('click')} className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 hover:text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2">
              <span>{t('btn.howItWorks', 'DISCOVER HOW IT WORKS')}</span>
            </a>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-slate-300">
            <Mic className="w-3.5 h-3.5 text-purple-300" />
            <span>{t('lang.narrationLang', 'Narration')}: {currentNarrationLang?.nativeName}</span>
            <span className="text-slate-500">•</span>
            <span>Text fallback available</span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-accent font-semibold">THE COGNITIVE DILEMMA</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">Knowledge is Documented. <br /><span className="text-mneme-lavender">Experience is Lost.</span></h2>
            <p className="text-sm text-slate-400 leading-relaxed">MNEME preserves practical judgment and documented case records while keeping facts, dates, numbers, and outcomes unchanged.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[['01', 'Warning Signs', 'Capture the signals experts notice under pressure.'], ['02', 'Rejected Options', 'Document alternatives that were considered and why they were not chosen.'], ['03', 'Before Retrospect', 'Investigate with chronological constraints, not hindsight certainty.']].map(([n, title, desc]) => (
              <div key={n} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 mb-4 font-mono text-xs font-bold">{n}</div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-accent font-semibold">THE 10 UNIVERSES</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">The Architecture of Experience</h2>
            </div>
            <Link to="/universe" onClick={() => voiceService.playAudioFeedback('click')} className="inline-flex items-center gap-2 text-xs font-semibold text-mneme-lavender hover:text-white uppercase tracking-wider font-mono">
              <span>Explore All 50 Cases</span><ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {UNIVERSES.map((universe) => (
              <Link key={universe.id} to={`/universe?domain=${universe.id}`} onClick={() => voiceService.playAudioFeedback('click')} className="group p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-mneme-accent/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-500 font-bold">{universe.number}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400">{universe.totalCases} cases</span>
                </div>
                <h3 className="font-serif text-sm font-bold text-white group-hover:text-mneme-lavender transition-colors mb-1">{universe.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{universe.tagline}</p>
                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono"><span>Verified: {universe.verifiedCases}</span><ChevronRight className="w-3 h-3 text-slate-400" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-accent font-semibold">FIELD INCIDENTS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1 mb-3">Featured Interactive Investigations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCases.map((caseItem) => <CaseCard key={caseItem.id} caseItem={caseItem} />)}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mneme-accent/15 border border-mneme-accent/30 text-[11px] font-mono text-mneme-lavender"><Lock className="w-3.5 h-3.5" /><span>SIGNATURE ENGINE</span></div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">{t('inv.knowledgeLock', 'The Knowledge Lock™')}</h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">Chronological enforcement keeps future evidence and outcomes unavailable until decisions are committed.</p>
            <Link to="/investigate/the-silent-failure" onClick={handleCtaClick} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/20 transition-all"><span>{t('btn.investigate', 'Investigate')}</span><ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="lg:col-span-6 rounded-2xl bg-mneme-900 border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4"><span className="font-mono text-xs text-white font-bold">11:02 AM • INCIDENT COMMENCED</span><span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">STAGE 1 UNLOCKED</span></div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300 mb-3"><p className="text-white">Sensor X-44: 4.2 mm/s @ 14.2 Hz</p><p className="text-amber-400 text-[11px] mt-0.5">Alert: exceeds 2.5 mm/s baseline</p></div>
            <div className="relative rounded-xl border border-dashed border-white/15 p-4 bg-white/[0.01] overflow-hidden"><div className="absolute inset-0 bg-black/80 backdrop-blur-[3px] flex flex-col items-center justify-center gap-2 z-10 text-center p-4"><Lock className="w-5 h-5 text-mneme-lavender" /><span className="font-mono text-xs font-semibold text-white">LOCKED STAGE 2</span><span className="text-[10px] text-slate-400">Unlocks after decision commit.</span></div><div className="opacity-20 blur-sm text-xs font-mono space-y-1"><p>11:08 AM • Bearing #2 TC-2A: 109°C</p><p>Silver flake in lube return sight glass</p></div></div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 mb-3"><GitBranch className="w-3.5 h-3.5" /><span>SIMULATED SCENARIOS LABELED</span></div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Multiverse Lab</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">Explore counterfactual consequences clearly labeled as simulations.</p>
          </div>
          <Link to="/multiverse/the-silent-failure" onClick={() => voiceService.playAudioFeedback('click')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white text-xs font-semibold tracking-wider font-mono uppercase"><span>Launch Multiverse Lab</span><ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-purple-950/40 via-mneme-900 to-black border border-purple-500/30 p-8 sm:p-12 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Contribute a Real Experience</h2>
          <p className="text-sm text-slate-300 leading-relaxed mt-3 max-w-2xl mx-auto">Submit incidents in your preferred language. Original submissions are preserved; generated translations (if any) are stored separately.</p>
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/experience/create" onClick={handleCtaClick} className="px-8 py-3.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/25 transition-all">{t('nav.contribute', 'Contribute')}</Link>
            <Link to="/verification" onClick={() => voiceService.playAudioFeedback('click')} className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-300 text-xs font-medium transition-colors">{t('nav.evidence', 'Evidence Passport')}</Link>
          </div>
        </div>
      </section>

      <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">Enter the Universe of Experience.</h2>
          <p className="text-base text-slate-400 font-light max-w-xl mx-auto">Investigate documented cases, compare reasoning, and build your Decision DNA.</p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/universe" onClick={handleCtaClick} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 text-white font-semibold text-sm tracking-wider uppercase shadow-xl shadow-mneme-accent/25 transition-all">Start Exploring Cases</Link>
            <Link to="/dashboard" onClick={() => voiceService.playAudioFeedback('click')} className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 text-sm font-medium transition-colors">{t('nav.decisionDna', 'Decision DNA')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
