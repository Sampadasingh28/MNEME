import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../data/languages';
import { UI_TRANSLATIONS, CASE_TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

function getInitialValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved || fallback;
  } catch {
    return fallback;
  }
}

export function LanguageProvider({ children }) {
  const [interfaceLanguage, setInterfaceLanguageState] = useState(() => getInitialValue('mneme_interface_language', 'en'));
  const [narrationLanguage, setNarrationLanguageState] = useState(() => getInitialValue('mneme_narration_language', 'en'));
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem('mneme_onboarding_completed');
    } catch {
      return false;
    }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        setAvailableVoices(window.speechSynthesis.getVoices() || []);
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const persist = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage may be unavailable; keep in-memory state.
    }
  };

  const setInterfaceLanguage = (code) => {
    setInterfaceLanguageState(code);
    persist('mneme_interface_language', code);
  };

  const setNarrationLanguage = (code) => {
    setNarrationLanguageState(code);
    persist('mneme_narration_language', code);
  };

  const completeOnboarding = ({ interfaceCode, narrationCode }) => {
    const ui = interfaceCode || interfaceLanguage || 'en';
    const nar = narrationCode || narrationLanguage || ui;
    setInterfaceLanguage(ui);
    setNarrationLanguage(nar);
    persist('mneme_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const hasVoiceSupport = (langCode) => {
    const langObj = getLanguageByCode(langCode);
    if (!langObj) return false;
    const prefixes = [langObj.bcp47, langObj.speechLocale, langObj.code].filter(Boolean).map((v) => v.toLowerCase());
    return availableVoices.some((v) => {
      const vl = (v.lang || '').toLowerCase();
      return prefixes.some((p) => vl === p.toLowerCase() || vl.startsWith(p.split('-')[0]));
    });
  };

  const getTranslationStatus = (key) => {
    const entry = UI_TRANSLATIONS[key];
    if (!entry) return { text: key, status: 'missing_key', language: interfaceLanguage };
    if (entry[interfaceLanguage]) return { text: entry[interfaceLanguage], status: 'translated', language: interfaceLanguage };
    if (entry.en) return { text: entry.en, status: 'english_fallback', language: interfaceLanguage };
    return { text: key, status: 'missing_key', language: interfaceLanguage };
  };

  // Returns localized UI text. Missing translations may fall back to English.
  // Use getTranslationStatus() where callers must explicitly identify incomplete translations.
  const t = (key, fallback = '') => {
    const entry = UI_TRANSLATIONS[key];
    if (entry) {
      return entry[interfaceLanguage] || entry.en || fallback || key;
    }
    return fallback || key;
  };

  // Returns localized presentation text only. Does not mutate or fabricate factual case records.
  const getCaseContent = (caseItem) => {
    if (!caseItem) return null;
    const localized = CASE_TRANSLATIONS[caseItem.id]?.[interfaceLanguage];
    if (!localized) return caseItem;
    return {
      ...caseItem,
      title: localized.title || caseItem.title,
      subtitle: localized.subtitle || caseItem.subtitle,
      summary: localized.summary || caseItem.summary,
      investigatorRole: localized.investigatorRole || caseItem.investigatorRole,
      primaryObjective: localized.primaryObjective || caseItem.primaryObjective
    };
  };

  const value = useMemo(
    () => ({
      interfaceLanguage,
      narrationLanguage,
      setInterfaceLanguage,
      setNarrationLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentInterfaceLang: getLanguageByCode(interfaceLanguage),
      currentNarrationLang: getLanguageByCode(narrationLanguage),
      availableVoices,
      hasVoiceSupport,
      t,
      getTranslationStatus,
      getCaseContent,
      showOnboarding,
      setShowOnboarding,
      completeOnboarding,
      settingsOpen,
      setSettingsOpen
    }),
    [interfaceLanguage, narrationLanguage, availableVoices, showOnboarding, settingsOpen]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
