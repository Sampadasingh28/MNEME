import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Volume2, 
  VolumeX, 
  Mic, 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  Activity, 
  PlusCircle, 
  Info,
  Layers
} from 'lucide-react';
import { gnaniService } from '../services/gnaniService';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gnaniStatus, setGnaniStatus] = useState({ isLive: false, mode: 'SIMULATED_DEMO_MODE' });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    gnaniService.checkGnaniBackendStatus().then(status => {
      if (status) setGnaniStatus(status);
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = gnaniService.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      gnaniService.playAudioFeedback('success');
    }
  };

  const navLinks = [
    { name: 'Universe', path: '/universe', icon: Compass },
    { name: 'Investigation', path: '/investigate/the-silent-failure', icon: Search, badge: 'Flagship' },
    { name: 'Decision DNA', path: '/dashboard', icon: Activity },
    { name: 'Contribute', path: '/experience/create', icon: PlusCircle },
    { name: 'Evidence Passport', path: '/verification', icon: ShieldCheck },
    { name: 'About', path: '/about', icon: Info },
  ];

  const handleLinkClick = () => {
    gnaniService.playAudioFeedback('click');
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-mneme-950/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <Link 
            to="/" 
            onClick={handleLinkClick}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-mneme-accent via-purple-600 to-indigo-900 flex items-center justify-center p-[1px] shadow-lg shadow-mneme-accent/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-mneme-950 rounded-[7px] flex items-center justify-center">
                <span className="font-serif font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-mneme-lavender to-mneme-accent">
                  M
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-extrabold tracking-[0.25em] text-lg text-white group-hover:text-mneme-lavender transition-colors">
                MNEME
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-mneme-muted font-medium">
                The Intelligence of Experience
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || 
                (link.path.includes('/investigate') && location.pathname.startsWith('/investigate'));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                    isActive 
                      ? 'text-white bg-white/[0.08] border border-white/10 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mneme-accent' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-mneme-accent/20 text-mneme-lavender border border-mneme-accent/30 font-mono uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-mneme-accent to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Utilities: Gnani status & Audio toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Gnani AI Badge */}
            <div 
              title={gnaniStatus.isLive ? 'Gnani Prisma & Timbre Live API Active' : 'Gnani Voice Layer Active (High-Fidelity Demo Mode)'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-500/25 text-[10px] text-purple-300 font-mono"
            >
              <Mic className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>Gnani AI Voice:</span>
              <span className="text-white font-semibold">
                {gnaniStatus.isLive ? 'LIVE' : 'DEMO'}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-mneme-accent" />
              )}
            </button>

            {/* Quick Action: Enter Universe */}
            <Link
              to="/universe"
              onClick={handleLinkClick}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-mneme-accent to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold tracking-wide shadow-md shadow-mneme-accent/20 transition-all transform hover:-translate-y-0.5"
            >
              Enter Universe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-mneme-accent" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-xl bg-mneme-900/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-mono">Gnani AI Voice: {gnaniStatus.isLive ? 'LIVE' : 'DEMO MODE'}</span>
              </div>
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                      isActive 
                        ? 'bg-mneme-accent/20 text-white border border-mneme-accent/30' 
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-mneme-lavender" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-mneme-accent/30 text-white font-mono">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <Link
                to="/universe"
                onClick={handleLinkClick}
                className="w-full flex items-center justify-center py-2.5 rounded-lg bg-mneme-accent text-white font-semibold text-xs tracking-wider uppercase"
              >
                Enter Universe
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

