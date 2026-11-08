// MNEME Provider-Independent Voice Service
// Supports browser Web Speech API by default and optional configured server-side providers.
// Never assumes provider language support. Never fabricates API responses.

import { getLanguageByCode } from '../data/languages';

class VoiceService {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
    this.activeUtterance = null;
    this.recognitionInstance = null;
    this.apiStatus = {
      configured: false,
      mode: 'BROWSER_FALLBACK',
      sttProvider: 'Browser Web Speech',
      ttsProvider: 'Browser Speech Synthesis',
      supportedLanguages: []
    };
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioContext = new AudioCtx();
    } catch {
      // ignore
    }
  }

  playAudioFeedback(type) {
    if (this.isMuted) return;
    try {
      if (!this.audioContext) this.initAudioContext();
      if (!this.audioContext) return;
      if (this.audioContext.state === 'suspended') this.audioContext.resume();
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      const map = {
        lock: [420, 140, 0.18, 0.12, 'sine'],
        alert: [650, 880, 0.12, 0.22, 'triangle'],
        success: [523.25, 659.25, 0.15, 0.35, 'sine'],
        click: [800, 800, 0.08, 0.04, 'sine']
      };
      const [f1, f2, g, d, t] = map[type] || map.click;
      osc.type = t;
      osc.frequency.setValueAtTime(f1, now);
      if (f2 !== f1) osc.frequency.exponentialRampToValueAtTime(f2, now + d * (type === 'alert' ? 0.36 : 1));
      gain.gain.setValueAtTime(g, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + d);
      osc.start(now);
      osc.stop(now + d);
    } catch {
      // ignore
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stopSpeaking();
    return this.isMuted;
  }

  async checkBackendStatus() {
    try {
      const res = await fetch('/api/voice/status');
      if (res.ok) {
        const data = await res.json();
        this.apiStatus = data;
        return data;
      }
    } catch {
      // offline/standalone
    }
    this.apiStatus = {
      configured: false,
      mode: 'BROWSER_FALLBACK',
      sttProvider: 'Browser Web Speech',
      ttsProvider: 'Browser Speech Synthesis',
      supportedLanguages: [],
      notice: 'No server voice provider configured. Using browser capabilities where available; text fallback is always available.'
    };
    return this.apiStatus;
  }

  getSpeechLocale(langCode) {
    const lang = getLanguageByCode(langCode);
    return lang?.speechLocale || lang?.bcp47 || 'en-US';
  }

  findVoice(langCode, availableVoices = []) {
    const lang = getLanguageByCode(langCode);
    const prefixes = [lang?.bcp47, lang?.speechLocale, lang?.code].filter(Boolean).map((v) => String(v).toLowerCase());
    return (
      availableVoices.find((v) => prefixes.some((p) => (v.lang || '').toLowerCase() === p)) ||
      availableVoices.find((v) => prefixes.some((p) => (v.lang || '').toLowerCase().startsWith(p.split('-')[0]))) ||
      null
    );
  }

  async speak(text, options = {}) {
    if (this.isMuted || !text) return { status: 'SKIPPED' };
    const langCode = options.langCode || options.language || 'en';
    const locale = this.getSpeechLocale(langCode);
    const rate = options.rate ?? options.speed ?? 1.0;

    // Optional configured provider (server-side keys only)
    if (this.apiStatus.configured) {
      try {
        const response = await fetch('/api/voice/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language: langCode, locale, voice: options.voice, rate })
        });
        const ct = response.headers.get('content-type') || '';
        if (response.ok && ct.includes('audio')) {
          const blob = await response.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          audio.playbackRate = rate;
          await audio.play();
          return { status: 'PROVIDER_AUDIO', language: langCode };
        }
        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          if (data.status === 'PROVIDER_UNSUPPORTED' || data.status === 'NOT_CONFIGURED') {
            // fall through to browser
          } else if (data.audioUrl) {
            const audio = new Audio(data.audioUrl);
            audio.playbackRate = rate;
            await audio.play();
            return { status: 'PROVIDER_AUDIO', language: langCode };
          }
        }
      } catch {
        // fall through
      }
    }

    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve({ status: 'UNSUPPORTED', language: langCode, fallback: 'text' });
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;
      utterance.lang = locale;
      utterance.rate = Math.max(0.5, Math.min(2, rate));
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      const voices = window.speechSynthesis.getVoices();
      const selected = this.findVoice(langCode, voices);
      if (selected) utterance.voice = selected;
      utterance.onend = () => resolve({ status: selected ? 'BROWSER_VOICE' : 'BROWSER_DEFAULT', language: langCode, voice: selected?.name || null });
      utterance.onerror = () => resolve({ status: 'ERROR', language: langCode, fallback: 'text' });
      window.speechSynthesis.speak(utterance);
    });
  }

  // Backward-compatible alias
  speakCaseInvestigation(text, options = {}) {
    return this.speak(text, options);
  }

  stopSpeaking() {
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  startSpeechRecognition({ onResult, onError, onEnd, langCode = 'en', language } = {}) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not available in this browser. Use text input instead.');
      return null;
    }
    try {
      const recognition = new SpeechRecognition();
      this.recognitionInstance = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.getSpeechLocale(language || langCode);
      let finalText = '';
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += chunk;
          else interim += chunk;
        }
        if (onResult) onResult((finalText + ' ' + interim).trim(), false);
      };
      recognition.onerror = (event) => {
        if (onError) onError(event?.error || 'Speech recognition failed. Use text input instead.');
      };
      recognition.onend = () => {
        if (onResult && finalText.trim()) onResult(finalText.trim(), true);
        if (onEnd) onEnd();
      };
      recognition.start();
      this.playAudioFeedback('click');
      return recognition;
    } catch (e) {
      if (onError) onError(e.message || 'Speech recognition could not start.');
      return null;
    }
  }

  stopSpeechRecognition() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
  }
}

export const voiceService = new VoiceService();
// Backward-compatible export for existing imports
export const gnaniService = voiceService;
export default voiceService;
