// MNEME Gnani AI Voice Integration Service
// Integrates Gnani Prisma (Speech-to-Text) & Gnani Timbre (Text-to-Speech)
// With clear status labels: 'LIVE_GNANI_API' vs 'SIMULATED_DEMO_MODE'

class GnaniService {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
    this.activeUtterance = null;
    this.recognitionInstance = null;
    this.apiStatus = {
      isLive: false,
      mode: 'SIMULATED_DEMO_MODE', // or 'LIVE_GNANI_API'
      prismaSTT: 'Ready (Demo Fallback / Web Speech API)',
      timbreTTS: 'Ready (Demo Fallback / Web Audio Speech)'
    };
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported in this browser', e);
    }
  }

  // Play subtle cinematic sci-fi haptic sound effects
  playAudioFeedback(type) {
    if (this.isMuted) return;
    try {
      if (!this.audioContext) this.initAudioContext();
      if (!this.audioContext) return;
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'lock') {
        // High-tech tactile click / locking thud
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'alert') {
        // Subtle dual amber alert chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'success') {
        // Resonant harmonic success chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'click') {
        // Micro tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio playback fails gracefully
    }
  }

  // Toggle global sound effects
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  // Check backend Gnani credentials status
  async checkGnaniBackendStatus() {
    try {
      const res = await fetch('/api/gnani/status');
      if (res.ok) {
        const data = await res.json();
        this.apiStatus = data;
        return data;
      }
    } catch {
      // Offline or standalone mode
    }
    this.apiStatus = {
      isLive: false,
      mode: 'SIMULATED_DEMO_MODE',
      prismaSTT: 'Active (Browser SpeechRecognition Fallback)',
      timbreTTS: 'Active (Browser SpeechSynthesis Fallback)'
    };
    return this.apiStatus;
  }

  // GNANI TIMBRE: Text-To-Speech
  // If backend API keys exist, requests live audio stream from Gnani Timbre;
  // otherwise plays cleanly via browser SpeechSynthesis with distinct telemetry voice
  async speakCaseInvestigation(text, options = {}) {
    if (this.isMuted) return;

    // Check if backend Timbre endpoint is ready
    if (this.apiStatus.isLive) {
      try {
        const response = await fetch('/api/gnani/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice: options.voice || 'timbre-en-neutral-pro',
            rate: options.rate || 1.0
          })
        });
        if (response.ok) {
          const blob = await response.blob();
          const audio = new Audio(URL.createObjectURL(blob));
          audio.play();
          return { status: 'LIVE_GNANI_API', source: 'Gnani Timbre Neural Engine' };
        }
      } catch (e) {
        console.warn('Gnani Timbre API call fallback to browser TTS', e);
      }
    }

    // High quality browser SpeechSynthesis fallback
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve({ status: 'UNSUPPORTED', error: 'No TTS speech engine available' });
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;

      utterance.rate = options.rate || 0.98;
      utterance.pitch = options.pitch || 0.95; // Slightly deeper, authoritative investigator tone

      const voices = window.speechSynthesis.getVoices();
      // Prefer modern natural English voices
      const selectedVoice = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) &&
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        resolve({ status: 'COMPLETED', engine: 'Gnani Timbre Protocol (Demo Voice Fallback)' });
      };

      utterance.onerror = () => {
        resolve({ status: 'ERROR', engine: 'Gnani Timbre Protocol' });
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // GNANI PRISMA: Speech-To-Text
  // Browser SpeechRecognition capture with automatic transcript delivery
  startSpeechRecognition({ onResult, onError, onEnd }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Web Speech Recognition API not available in this browser. Please type your query.');
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      this.recognitionInstance = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (onResult) {
          onResult(transcript, event.results[0].isFinal);
        }
      };

      recognition.onerror = (event) => {
        if (onError) onError(event.error);
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();
      this.playAudioFeedback('click');
      return recognition;
    } catch (e) {
      if (onError) onError(e.message);
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

export const gnaniService = new GnaniService();
