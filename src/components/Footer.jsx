import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Compass, Mic, GitBranch, Clock, Sparkles } from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { gnaniService } from '../services/gnaniService';

export default function Footer() {
  const handleLink = () => {
    gnaniService.playAudioFeedback('click');
  };

  return (
    <footer className="relative bg-mneme-950 border-t border-white/10 z-10 pt-16 pb-12 overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-mneme-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mneme-accent to-purple-800 flex items-center justify-center font-serif font-black text-white text-base">
                M
              </div>
              <div>
                <span className="font-serif font-bold text-lg tracking-[0.2em] text-white">MNEME</span>
                <p className="text-[10px] uppercase tracking-wider text-mneme-muted">The Intelligence of Experience</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              "People don't just carry knowledge. They carry experiences, decisions, mistakes, instincts and lessons that are rarely documented."
            </p>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              MNEME preserves the reasoning behind human decisions under extreme uncertainty, converting high-stakes moments into interactive cognitive journeys.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-300 font-mono">
                Great Indian AI Challenge • Gnani.ai
              </div>
              <div className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-slate-400 font-mono">
                Gnani Prisma & Timbre Ready
              </div>
            </div>
          </div>

          {/* Platform Engines Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">
              Investigation Engines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/investigate/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-mneme-accent" />
                  The Knowledge Lock™
                </Link>
              </li>
              <li>
                <Link to="/time-machine/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Decision Time Machine
                </Link>
              </li>
              <li>
                <Link to="/multiverse/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <GitBranch className="w-3 h-3 text-slate-500" />
                  Multiverse Lab (Simulations)
                </Link>
              </li>
              <li>
                <Link to="/cross-examination/the-silent-failure" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Mic className="w-3 h-3 text-purple-400" />
                  Expert Cross-Examination
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={handleLink} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  My Decision DNA
                </Link>
              </li>
            </ul>
          </div>

          {/* Universes Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">
              Domains (01 - 05)
            </h4>
            <ul className="space-y-2 text-xs">
              {UNIVERSES.slice(0, 5).map(u => (
                <li key={u.id}>
                  <Link 
                    to={`/universe?domain=${u.id}`} 
                    onClick={handleLink}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[10px] font-mono text-slate-600">{u.number}</span>
                    <span>{u.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Universes Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">
              Domains (06 - 10)
            </h4>
            <ul className="space-y-2 text-xs">
              {UNIVERSES.slice(5, 10).map(u => (
                <li key={u.id}>
                  <Link 
                    to={`/universe?domain=${u.id}`} 
                    onClick={handleLink}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[10px] font-mono text-slate-600">{u.number}</span>
                    <span>{u.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/verification" onClick={handleLink} className="text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Evidence Passport Integrity
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Integrity Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} MNEME Platform.</span>
            <span>•</span>
            <span className="text-slate-400">Strict Data Integrity Protocol: Fictional & alternate outcomes are explicitly marked SIMULATED SCENARIO / SIMULATED DEMO.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/verification" onClick={handleLink} className="hover:text-slate-300 transition-colors">
              Verification Standards
            </Link>
            <Link to="/about" onClick={handleLink} className="hover:text-slate-300 transition-colors">
              Platform Philosophy
            </Link>
            <Link to="/experience/create" onClick={handleLink} className="text-mneme-lavender hover:underline">
              Contribute an Incident
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
