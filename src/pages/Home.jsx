import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  ArrowRight, 
  Lock, 
  GitBranch, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Activity, 
  Layers, 
  Cpu, 
  Users, 
  Compass, 
  HelpCircle,
  FileCheck2,
  Mic,
  Eye,
  ChevronRight
} from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { CASES } from '../data/casesData';
import CaseCard from '../components/CaseCard';
import { gnaniService } from '../services/gnaniService';

export default function Home() {
  const featuredCases = CASES.filter(c => c.featured);

  const handleCtaClick = () => {
    gnaniService.playAudioFeedback('lock');
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-mneme-accent/30 selection:text-white">
      
      {/* ==================================================== */}
      {/* SECTION 1 — HERO                                     */}
      {/* ==================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Deep ambient radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-mneme-accent/20 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        {/* Editorial grid watermark */}
        <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-inner mb-8">
            <span className="w-2 h-2 rounded-full bg-mneme-accent animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-mneme-lavender font-semibold">
              HUMAN EXPERIENCE & DECISION INTELLIGENCE PLATFORM
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            EVERY EXPERIENCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-mneme-lavender to-mneme-purple">
              HOLDS A DECISION.
            </span>
          </h1>

          {/* Supporting Manifesto Copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-10">
            "Explore the hidden reasoning, critical decisions and human experiences that shape the world around us."
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
            <Link
              to="/universe"
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm tracking-wider uppercase shadow-xl shadow-mneme-accent/25 hover:shadow-mneme-accent/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>ENTER THE UNIVERSE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              onClick={() => gnaniService.playAudioFeedback('click')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 hover:text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <span>DISCOVER HOW IT WORKS</span>
            </a>
          </div>

          {/* Live Flagship Teaser Banner */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2.5 sm:px-4 sm:py-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
              Interactive Flagship
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Turbine Anomaly at 11:02 AM: <strong className="text-white">The Silent Failure</strong>
            </span>
            <Link
              to="/investigate/the-silent-failure"
              onClick={handleCtaClick}
              className="text-xs font-semibold text-mneme-lavender hover:text-white flex items-center gap-1 underline underline-offset-4"
            >
              <span>Investigate Case Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 2 — THE MISSING KNOWLEDGE                     */}
      {/* ==================================================== */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/60">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-accent font-semibold">
              THE COGNITIVE DILEMMA
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              Knowledge is Documented. <br />
              <span className="text-mneme-lavender">Experience is Lost.</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When an expert engineer, trauma surgeon, or incident commander steps away, their textbooks remain. But their instincts, discarded options, and the quiet warning signs they spotted disappear forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-mneme-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 font-mono text-xs font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                The Warning Signs That Matter
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Veterans know which 1% of telemetry is critical and which 99% is background noise. Standard manuals document both equally; MNEME captures the distinction under live operational pressure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-mneme-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 font-mono text-xs font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                The Rejected Options
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Final reports only record what was done. They never document the six tempting alternatives that the expert consciously rejected—and why choosing them would have caused catastrophe.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-mneme-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 font-mono text-xs font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Decisions Before Retrospect
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hindsight makes every outcome seem obvious. MNEME recreates the fog of war using our signature Knowledge Lock, stripping away future certainty so you must decide with incomplete data.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 3 — EXPLORE THE UNIVERSE                      */}
      {/* ==================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-accent font-semibold">
                THE 10 UNIVERSES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                The Architecture of Experience
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Fifty structured cases across ten operational domains. From industrial rotating machinery to covert cyber intrusions and high-altitude cockpit emergencies.
              </p>
            </div>

            <Link
              to="/universe"
              onClick={() => gnaniService.playAudioFeedback('click')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-mneme-lavender hover:text-white uppercase tracking-wider font-mono"
            >
              <span>Explore All 50 Cases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {UNIVERSES.map((universe) => (
              <Link
                key={universe.id}
                to={`/universe?domain=${universe.id}`}
                onClick={() => gnaniService.playAudioFeedback('click')}
                className="group p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-mneme-accent/40 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-500 font-bold">{universe.number}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400">
                      {universe.totalCases} cases
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-mneme-lavender transition-colors mb-1">
                    {universe.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {universe.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Verified: {universe.verifiedCases}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 4 — FEATURED INVESTIGATIONS                   */}
      {/* ==================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-accent font-semibold">
              FIELD INCIDENTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1 mb-3">
              Featured Interactive Investigations
            </h2>
            <p className="text-sm text-slate-400">
              Enter real incidents as the primary commander. Explore telemetry, discover concealed clues, and submit decisions under pressure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCases.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 5 — THE SIGNATURE KNOWLEDGE LOCK™             */}
      {/* ==================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mneme-accent/15 border border-mneme-accent/30 text-[11px] font-mono text-mneme-lavender">
                <Lock className="w-3.5 h-3.5" />
                <span>SIGNATURE ENGINE</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                The Knowledge Lock™
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                In real emergencies, nobody hands you tomorrow’s post-mortem report today.
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                The Knowledge Lock is MNEME’s signature chronological enforcement mechanism. Future events, telemetry spikes, and catastrophic failures remain strictly encrypted and locked until you commit your decision based only on what was known at that second.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Strict Sequential Revelation</h4>
                    <p className="text-[11px] text-slate-400">At 11:02 AM, you only see 11:02 AM telemetry. Future timeline items are inaccessible.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Irreversible Decision Commitment</h4>
                    <p className="text-[11px] text-slate-400">Lock your tactical choice, confidence score, and rationale before time advances.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Post-Lock Expert Confrontation</h4>
                    <p className="text-[11px] text-slate-400">Confront the historical expert decision and discover what clues you noticed or overlooked.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/investigate/the-silent-failure"
                  onClick={handleCtaClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Experience The Knowledge Lock</span>
                </Link>
              </div>
            </div>

            {/* Interactive Visual Simulator Mockup */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-mneme-900 border border-white/15 p-6 shadow-2xl backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-mono text-xs text-white font-bold">11:02 AM • INCIDENT COMMENCED</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    STAGE 1 UNLOCKED
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300">
                    <span className="text-slate-500">// ACTIVE TELEMETRY</span>
                    <p className="text-white mt-1">Sensor X-44: 4.2 mm/s @ 14.2 Hz sub-synchronous</p>
                    <p className="text-amber-400 text-[11px] mt-0.5">Alert: Radial oscillation exceeds 2.5 mm/s baseline</p>
                  </div>

                  <div className="p-3 rounded-lg bg-mneme-accent/10 border border-mneme-accent/30 text-xs">
                    <span className="text-mneme-lavender font-semibold">Investigator Order Required:</span>
                    <p className="text-slate-300 text-[11px] mt-1">Throttle load to 60% OR initiate instant emergency trip?</p>
                  </div>
                </div>

                {/* Locked Future Event Preview */}
                <div className="relative rounded-xl border border-dashed border-white/15 p-4 bg-white/[0.01] overflow-hidden">
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[3px] flex flex-col items-center justify-center gap-2 z-10 text-center p-4">
                    <Lock className="w-5 h-5 text-mneme-lavender" />
                    <span className="font-mono text-xs font-semibold text-white">LOCKED STAGE 2 — 11:08 AM</span>
                    <span className="text-[10px] text-slate-400 max-w-xs">
                      Locked by Knowledge Lock protocol until 11:02 AM decision is confirmed.
                    </span>
                  </div>
                  <div className="opacity-20 blur-sm pointer-events-none text-xs font-mono space-y-1">
                    <p>Bearing #2 Journal TC-2A: 109°C</p>
                    <p>Silver flake detected in lube return sight glass</p>
                    <p>Catastrophic babbitt liquefaction warning</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 6 — MULTIVERSE LAB                            */}
      {/* ==================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 mb-3">
                <GitBranch className="w-3.5 h-3.5" />
                <span>HYPOTHETICAL SIMULATION ENGINE</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                The Multiverse Lab
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                What if the warning was ignored? What if the machine was stopped 6 minutes earlier? Explore branching hypothetical consequences clearly labeled <span className="text-purple-300 font-mono">SIMULATED SCENARIO</span>.
              </p>
            </div>

            <Link
              to="/multiverse/the-silent-failure"
              onClick={() => gnaniService.playAudioFeedback('click')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white text-xs font-semibold tracking-wider font-mono uppercase"
            >
              <span>Launch Multiverse Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  HISTORICAL DOCUMENTED
                </span>
                <span className="text-xs font-mono text-slate-400">Baseline</span>
              </div>
              <h3 className="font-serif text-base font-bold text-white mb-2">
                Controlled Staged Deceleration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Turbine throttled to 60%, followed by gradual roll-down with jacking oil pump engaged at 150 RPM. Shaft preserved with zero permanent warpage.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-white/5">
                Outcome: Unit back online in 38h ($60k repair)
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-rose-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  SIMULATED SCENARIO
                </span>
                <span className="text-xs font-mono text-rose-400">Alternate Path A</span>
              </div>
              <h3 className="font-serif text-base font-bold text-white mb-2">
                Ignored Spike & Full Load Retention
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Operator dismisses X-44 as sensor drift. At 11:24 AM, Babbitt melts completely. Rotor shears at coupling, shedding blades through outer shroud.
              </p>
              <div className="text-[11px] font-mono text-rose-400 pt-2 border-t border-white/5">
                Simulated Impact: $28.5M loss, 9 months outage
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  SIMULATED SCENARIO
                </span>
                <span className="text-xs font-mono text-amber-400">Alternate Path B</span>
              </div>
              <h3 className="font-serif text-base font-bold text-white mb-2">
                Premature Instant Emergency Scram
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Hard fuel cutoff without staged thermal relaxation. 12-ton hot rotor comes to stationary rest on damaged bearing, causing severe thermal bow.
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-white/5">
                Simulated Impact: $4.2M replacement, 6 weeks downtime
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 7 — CONTRIBUTE YOUR EXPERIENCE                */}
      {/* ==================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-purple-950/40 via-mneme-900 to-black border border-purple-500/30 p-8 sm:p-12 text-center relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-mneme-lavender font-semibold">
              PRESERVE YOUR KNOWLEDGE
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Have You Handled a Critical Incident?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Don’t let the lessons, mistakes, and instinctive decisions of your career disappear. Contribute your real-world experience to MNEME’s permanent forensic archive.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/experience/create"
                onClick={handleCtaClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mneme-accent/25 transition-all"
              >
                Submit an Incident
              </Link>
              <Link
                to="/verification"
                onClick={() => gnaniService.playAudioFeedback('click')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-300 text-xs font-medium transition-colors"
              >
                Read Verification Standards
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 8 — EVIDENCE AND TRUST                        */}
      {/* ==================================================== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-mneme-950/60">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>INTEGRITY & VERIFICATION</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Never Fictionalized As Fact.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-light">
                In an era of generative AI hallucinations, MNEME draws an uncompromising line between verified history and simulated demonstration.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>VERIFIED</strong>: Cross-referenced primary source telemetry, formal audit logs & legal review.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span><strong>PUBLIC CASE STUDY</strong>: Established institutional post-mortems (NTSB, CSB, NASA, IAEA).</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span><strong>SIMULATED DEMO</strong>: Explicitly labeled synthetic benchmarks created for cognitive training.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/verification"
                  onClick={() => gnaniService.playAudioFeedback('click')}
                  className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
                >
                  <span>Inspect Evidence Passport Framework</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-slate-400">EVIDENCE PASSPORT</span>
                <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  CHAIN OF CUSTODY
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <p><span className="text-slate-500">Case ID:</span> MN-01-SILENT-FAILURE</p>
                <p><span className="text-slate-500">Domain:</span> Machine World (Industrial Energy)</p>
                <p><span className="text-slate-500">Audit Status:</span> Simulated High-Fidelity Benchmark</p>
                <p><span className="text-slate-500">AI Disclosure:</span> Scenarios dynamically evaluated with strict grounded guardrails.</p>
                <p><span className="text-slate-500">Review Board:</span> Rotating Equipment Reliability Group</p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                "Cross-Examination AI is strictly prohibited from fabricating expert statements. Undocumented queries return strict standardized refusal."
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 9 — FINAL CTA                                 */}
      {/* ==================================================== */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
            Enter the Universe of Experience.
          </h2>

          <p className="text-base text-slate-400 font-light max-w-xl mx-auto">
            Test your decision-making against documented reality. Uncover clues, compare your reasoning with veteran experts, and build your Decision DNA.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/universe"
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-mneme-accent via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm tracking-wider uppercase shadow-xl shadow-mneme-accent/25 transition-all"
            >
              Start Exploring Cases
            </Link>
            <Link
              to="/dashboard"
              onClick={() => gnaniService.playAudioFeedback('click')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-slate-200 text-sm font-medium transition-colors"
            >
              View Decision DNA
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

