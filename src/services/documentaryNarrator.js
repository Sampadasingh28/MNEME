// MNEME Documentary Voice Narrator Engine
// Uses provider-independent voiceService. Respects selected narration language and falls back to text when voice is unavailable.

import { voiceService } from './voiceService';
import { getLanguageByCode } from '../data/languages';
import { getLocalizedCaseText } from '../data/translations';

class DocumentaryNarrator {
  constructor() {
    this.segments = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.speed = 1.0;
    this.volume = 1.0;
    this.currentSegment = null;
    this.listeners = new Set();
    this.activeUtterance = null;
    this.narrationLang = 'en';
    this._stopped = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      totalSegments: this.segments.length,
      currentSegment: this.currentSegment,
      speed: this.speed,
      volume: this.volume,
      narrationLang: this.narrationLang,
      liveMode: Boolean(voiceService.apiStatus?.configured)
    };
  }

  localizeCase(caseItem, langCode) {
    const lang = langCode || this.narrationLang || 'en';
    const loc = getLocalizedCaseText(caseItem?.id, lang) || {};
    return { ...caseItem, ...loc };
  }

  generateCaseBriefingScript(caseItem, langCode = 'en') {
    const c = this.localizeCase(caseItem, langCode);
    return [
      { id: 'brief-cold-open', highlightTarget: 'title', title: 'Case File', text: `MNEME case file: ${c.title}. Domain: ${c.domain}. Year: ${c.year || 'Documented period'}. Location: ${c.location || 'Documented location'}.` },
      { id: 'brief-summary', highlightTarget: 'summary', title: 'Incident Synopsis', text: c.summary || '' },
      { id: 'brief-role', highlightTarget: 'persona', title: 'Investigator Directive', text: `Investigator role: ${c.investigatorRole}. Primary objective: ${c.primaryObjective}.` }
    ].filter((s) => s.text);
  }

  generateStageScript(stage, stageIndex, totalStages, langCode = 'en') {
    if (!stage) return [];
    const loc = getLocalizedCaseText(stage.caseId, langCode)?.stages?.[stage.stageNumber - 1] || {};
    const context = loc.context || stage.context;
    const dilemma = loc.dilemma || stage.dilemma;
    const prompt = loc.decisionPrompt || stage.decisionPrompt;
    const list = [
      { id: `stage-${stage.stageNumber}-timestamp`, highlightTarget: 'timestamp-header', title: `Stage ${stage.stageNumber} of ${totalStages}`, text: `Timestamp ${stage.timestamp}. System status: ${stage.systemStatus}.` },
      { id: `stage-${stage.stageNumber}-context`, highlightTarget: 'incident-context', title: 'Field Context', text: context },
      { id: `stage-${stage.stageNumber}-dilemma`, highlightTarget: 'operational-dilemma', title: 'Operational Dilemma', text: `Operational dilemma: ${dilemma}` }
    ];
    if (stage.evidenceList?.length) {
      const evidenceOverview = stage.evidenceList
        .map((ev, i) => {
          const evLoc = loc.evidenceList?.[i] || {};
          return `Evidence ${i + 1}: ${evLoc.title || ev.title}. Value: ${ev.value}.`;
        })
        .join(' ');
      list.push({ id: `stage-${stage.stageNumber}-evidence`, highlightTarget: 'evidence-room', title: 'Evidence Signals', text: evidenceOverview });
    }
    list.push({ id: `stage-${stage.stageNumber}-decision`, highlightTarget: 'decision-point', title: 'Decision Required', text: `Decision required: ${prompt}` });
    return list.filter((s) => s.text);
  }

  generateLearningReportScript(caseItem, alignmentScore, foundClues, totalClues, langCode = 'en') {
    const c = this.localizeCase(caseItem, langCode);
    return [
      { id: 'report-assessment', highlightTarget: 'report-header', title: 'Forensic Assessment', text: `Investigation concluded for ${c.title}.` },
      { id: 'report-scores', highlightTarget: 'report-metrics', title: 'Performance Analysis', text: `Expert alignment ${alignmentScore} percent. Clues identified ${foundClues} of ${totalClues}.` },
      { id: 'report-closing', highlightTarget: 'report-consequence', title: 'Takeaway', text: 'Your decisions are recorded in your Decision DNA. Explore the Time Machine or Multiverse Lab for deeper review.' }
    ];
  }

  loadScript(segments, options = {}) {
    this.stop();
    this.segments = Array.isArray(segments) ? segments : [];
    this.currentIndex = 0;
    this.currentSegment = this.segments[0] || null;
    if (options.langCode) this.narrationLang = options.langCode;
    this.notify();
  }

  async play() {
    if (!this.segments.length) return;
    if (this.isPaused && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        this.isPlaying = true;
        this.isPaused = false;
        this.notify();
        return;
      } catch {
        // fall through
      }
    }
    this._stopped = false;
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();
    this.playSegment(this.currentIndex);
  }

  async playSegment(index) {
    if (index >= this.segments.length) {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentSegment = null;
      this.notify();
      return;
    }
    this.currentIndex = index;
    const segment = this.segments[index];
    this.currentSegment = segment;
    this.notify();

    const result = await voiceService.speak(segment.text, {
      langCode: this.narrationLang,
      rate: this.speed,
      volume: this.volume
    });

    if (this._stopped || this.isPaused) return;
    if (this.isPlaying) {
      // If browser voice is unsupported or text-only, move on after a short pause so highlighting/transcript still works.
      const delay = result?.status === 'UNSUPPORTED' || result?.fallback === 'text' ? 1200 : 120;
      setTimeout(() => {
        if (this.isPlaying && !this.isPaused && !this._stopped) this.playSegment(this.currentIndex + 1);
      }, delay);
    }
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.isPlaying = false;
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.pause();
    } catch {
      // ignore
    }
    this.notify();
  }

  resume() {
    if (this.isPaused) this.play();
  }

  replay() {
    this.stop();
    this.currentIndex = 0;
    this.currentSegment = this.segments[0] || null;
    this.play();
  }

  stop() {
    this._stopped = true;
    this.isPlaying = false;
    this.isPaused = false;
    voiceService.stopSpeaking();
    this.notify();
  }

  setSpeed(rate) {
    this.speed = Math.max(0.5, Math.min(2.0, rate));
    this.notify();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1.0, vol));
    this.notify();
  }

  seek(index) {
    if (index >= 0 && index < this.segments.length) {
      this.currentIndex = index;
      this.currentSegment = this.segments[index];
      this.notify();
      if (this.isPlaying) this.playSegment(index);
    }
  }

  setNarrationLanguage(langCode) {
    this.narrationLang = langCode || 'en';
    this.notify();
  }
}

export const documentaryNarrator = new DocumentaryNarrator();
