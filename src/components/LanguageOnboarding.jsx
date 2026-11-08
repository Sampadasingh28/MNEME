import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Mic2 } from 'lucide-react';

export default function LanguageOnboarding() {
  const { showOnboarding, supportedLanguages, interfaceLanguage, narrationLanguage, completeOnboarding, t } = useLanguage();
  const [uiLang, setUiLang] = useState(interfaceLanguage);
  const [narLang, setNarLang] = useState(narrationLanguage);

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-mneme-900/95 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-mneme-lavender font-mono text-[11px] uppercase tracking-wider mb-2">
          <Globe className="w-4 h-4" />
          <span>{t('lang.selectLanguage', 'Select Language')}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">MNEME</h2>
        <p className="text-sm text-slate-300 mb-6">{t('hero.tagline', 'THE INTELLIGENCE OF EXPERIENCE.')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <label className="text-xs font-mono text-slate-300">
            <span className="block mb-1.5">{t('lang.interfaceLang', 'Interface Language')}</span>
            <select
              value={uiLang}
              onChange={(e) => {
                setUiLang(e.target.value);
                setNarLang(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 focus:outline-none focus:border-mneme-accent"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900">
                  {l.nativeName} — {l.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-mono text-slate-300">
            <span className="block mb-1.5 flex items-center gap-1.5"><Mic2 className="w-3.5 h-3.5" />{t('lang.narrationLang', 'Voice Narration Language')}</span>
            <select
              value={narLang}
              onChange={(e) => setNarLang(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 focus:outline-none focus:border-mneme-accent"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900">
                  {l.nativeName} — {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-[11px] text-slate-400 mb-5">Interface and narration languages can be changed later in settings. Voice features may fall back to text where a selected language or provider is unavailable.</p>

        <div className="flex justify-end">
          <button
            onClick={() => completeOnboarding({ interfaceCode: uiLang, narrationCode: narLang })}
            className="px-5 py-2.5 rounded-xl bg-mneme-accent hover:bg-purple-600 text-white text-sm font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
