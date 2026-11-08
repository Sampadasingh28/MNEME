import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GitBranch, Clock, Mic } from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const handleLink = () => voiceService.playAudioFeedback('click');

  return (
    <footer className="relative bg-mneme-950 border-t border-white/10 z-10 pt-16 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-mneme-accent/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center font-serif font-black text-white text-base">M</div>
              <div>
                <span className="font-serif font-bold text-lg tracking-[0.2em] text-white">MNEME</span>
                <p className="text-[10px] uppercase tracking-wider text-mneme-muted">THE INTELLIGENCE OF EXPERIENCE.</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">Independent Human Experience and Decision Intelligence Platform.</p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">MNEME preserves the reasoning behind human decisions under uncertainty and presents case records with integrity, multilingual access, and text/voice fallbacks.</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">Investigation Engines</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/investigate/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-mneme-accent" />Knowledge Lock™</Link></li>
              <li><Link to="/time-machine/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-500" />Decision Time Machine</Link></li>
              <li><Link to="/multiverse/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><GitBranch className="w-3 h-3 text-slate-500" />Multiverse Lab</Link></li>
              <li><Link to="/cross-examination/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><Mic className="w-3 h-3 text-purple-400" />{t('nav.investigation', 'Investigation')} Assistant</Link></li>
              <li><Link to="/dashboard" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{t('nav.decisionDna', 'Decision DNA')}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">Domains (01 - 05)</h4>
            <ul className="space-y-2 text-xs">
              {UNIVERSES.slice(0, 5).map((u) => (
                <li key={u.id}><Link to={`/universe?domain=${u.id}`} onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><span className="text-[10px] font-mono text-slate-600">{u.number}</span><span>{u.name}</span></Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">Domains (06 - 10)</h4>
            <ul className="space-y-2 text-xs">
              {UNIVERSES.slice(5, 10).map((u) => (
                <li key={u.id}><Link to={`/universe?domain=${u.id}`} onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><span className="text-[10px] font-mono text-slate-600">{u.number}</span><span>{u.name}</span></Link></li>
              ))}
              <li className="pt-2"><Link to="/verification" onClick={handleLink} className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"><ShieldCheck className="w-3.5 h-3.5" />{t('nav.evidence', 'Evidence Passport')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} MNEME.</span>
            <span>•</span>
            <span className="text-slate-400">Independent product. Alternate outcomes remain explicitly labeled as simulations where applicable.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/verification" onClick={handleLink} className="hover:text-slate-300 transition-colors">Verification</Link>
            <Link to="/about" onClick={handleLink} className="hover:text-slate-300 transition-colors">{t('nav.about', 'About MNEME')}</Link>
            <Link to="/experience/create" onClick={handleLink} className="text-mneme-lavender hover:underline">{t('nav.contribute', 'Contribute')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
