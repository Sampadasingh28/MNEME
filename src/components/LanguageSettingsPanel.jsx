import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Settings, X, AlertTriangle } from 'lucide-react';

export default function LanguageSettingsPanel() {
  const {
    settingsOpen,
    setSettingsOpen,
    supportedLanguages,
    interfaceLanguage,
    narrationLanguage,
    setInterfaceLanguage,
    setNarrationLanguage,
    hasVoiceSupport,
    t,
    currentInterfaceLang,
    currentNarrationLang
  } = useLanguage();

  if (!settingsOpen) return null;

  const narrationSupported = hasVoiceSupport(narrationLanguage);

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex justify-end" onClick={() => setSettingsOpen(false)}>
      <div className="w-full max-w-md h-full bg-mneme-900 border-l border-white/10 p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white font-semibold"><Settings className="w-4 h-4 text-mneme-lavender" /> Language & Voice</div>
          <button onClick={() => setSettingsOpen(false)} className="p-1.5 rounded bg-white/[0.04] text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-mono text-slate-300">
            <span className="block mb-1.5">{t('lang.interfaceLang', 'Interface Language')}</span>
            <select value={interfaceLanguage} onChange={(e) => setInterfaceLanguage(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100">
              {supportedLanguages.map((l) => <option key={l.code} value={l.code} className="text-slate-900">{l.nativeName} — {l.name}</option>)}
            </select>
            <span className="block mt-1 text-[11px] text-slate-500">Current: {currentInterfaceLang?.nativeName}</span>
          </label>

          <label className="block text-xs font-mono text-slate-300">
            <span className="block mb-1.5">{t('lang.narrationLang', 'Voice Narration Language')}</span>
            <select value={narrationLanguage} onChange={(e) => setNarrationLanguage(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100">
              {supportedLanguages.map((l) => <option key={l.code} value={l.code} className="text-slate-900">{l.nativeName} — {l.name}</option>)}
            </select>
            <span className="block mt-1 text-[11px] text-slate-500">Current: {currentNarrationLang?.nativeName}</span>
          </label>

          {!narrationSupported && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>No browser voice was detected for this narration language. MNEME will keep text/transcripts available and attempt configured providers or fallbacks when supported.</p>
            </div>
          )}

          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-[11px] text-slate-400">
            Urdu uses right-to-left layout for the interface. Factual case numbers, dates, telemetry, and documented outcomes remain unchanged.
          </div>
        </div>
      </div>
    </div>
  );
}
