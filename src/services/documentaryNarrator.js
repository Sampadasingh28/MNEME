// MNEME Documentary Voice Narrator Engine
// Translates structured case & stage data into cinematic investigative documentary narration
// Provides play, pause, resume, replay, speed, volume, and real-time sentence/segment highlighting

import { gnaniService } from './gnaniService';

class DocumentaryNarrator {
  constructor() {
    this.segments = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.speed = 1.0; // 0.75, 1.0, 1.25, 1.5
    this.volume = 1.0; // 0 to 1
    this.currentSegment = null;
    this.listeners = new Set();
    this.activeUtterance = null;
    this.audioElement = null;
    this.liveMode = false;
  }

  // Subscribe to playback state changes
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
      liveMode: this.liveMode
    };
  }

  // Generate documentary script for a full case briefing (e.g. CaseDetails)
  generateCaseBriefingScript(caseItem) {
    const list = [
      {
        id: 'brief-cold-open',
        highlightTarget: 'title',
        title: 'Case File Cold Open',
        text: `MNEME Case File: ${caseItem.title}. Operational Domain: ${caseItem.domain}. Recorded Year: ${caseItem.year || 'Recent'}. Location Node: ${caseItem.location || 'Classified'}.`
      },
      {
        id: 'brief-summary',
        highlightTarget: 'summary',
        title: 'Incident Synopsis',
        text: `The Scenario: ${caseItem.summary}`
      },
      {
        id: 'brief-role',
        highlightTarget: 'persona',
        title: 'Investigator Directive',
        text: `You are deployed as ${caseItem.investigatorRole}. Your primary mission objective: ${caseItem.primaryObjective}. Pay close attention to telemetry clues before committing your decisions.`
      }
    ];
    return list;
  }

  // Generate documentary script for an investigation stage (Strict Knowledge Lock compliant)
  // NEVER includes future locked stages!
  generateStageScript(stage, stageIndex, totalStages) {
    const list = [
      {
        id: `stage-${stage.stageNumber}-timestamp`,
        highlightTarget: 'timestamp-header',
        title: `Incident Horizon: Stage ${stage.stageNumber} of ${totalStages}`,
        text: `Timestamp: ${stage.timestamp}. System operational state is currently ${stage.systemStatus}. Knowledge Lock is engaged for Stage ${stage.stageNumber}.`
      },
      {
        id: `stage-${stage.stageNumber}-context`,
        highlightTarget: 'incident-context',
        title: 'Field Context & Telemetry',
        text: `${stage.context}`
      },
      {
        id: `stage-${stage.stageNumber}-dilemma`,
        highlightTarget: 'operational-dilemma',
        title: 'Critical Operational Dilemma',
        text: `The Operational Dilemma: ${stage.dilemma}`
      }
    ];

    // Evidence summary
    if (stage.evidenceList && stage.evidenceList.length > 0) {
      const evidenceOverview = stage.evidenceList
        .map((ev, i) => `Evidence item ${i + 1}: ${ev.title}. Telemetry reads: ${ev.value}.`)
        .join(' ');
      list.push({
        id: `stage-${stage.stageNumber}-evidence`,
        highlightTarget: 'evidence-room',
        title: 'Evidence Signals Detected',
        text: `The Evidence Room holds active field signals: ${evidenceOverview}`
      });
    }

    // Decision prompt
    list.push({
      id: `stage-${stage.stageNumber}-decision`,
      highlightTarget: 'decision-point',
      title: 'Tactical Command Required',
      text: `Tactical Decision Required at ${stage.timestamp}: ${stage.decisionPrompt}. Consider the risk metrics carefully before irreversibly locking your command.`
    });

    return list;
  }

  // Generate documentary narration for learning report post-investigation
  generateLearningReportScript(caseItem, alignmentScore, foundClues, totalClues) {
    return [
      {
        id: 'report-assessment',
        highlightTarget: 'report-header',
        title: 'Forensic Case Assessment',
        text: `Investigation Concluded for ${caseItem.title}. Generating forensic learning report.`
      },
      {
        id: 'report-scores',
        highlightTarget: 'report-metrics',
        title: 'Performance Analysis',
        text: `Your tactical concordance with documented expert doctrine reached ${alignmentScore} percent. You identified ${foundClues} out of ${totalClues} critical telemetry clues.`
      },
      {
        id: 'report-closing',
        highlightTarget: 'report-consequence',
        title: 'Institutional Takeaway',
        text: `Your actions have been permanently committed to your Decision DNA ledger. Explore the Decision Time Machine to inspect the telemetry curve, or enter the Multiverse Lab to investigate hypothetical alternate paths.`
      }
    ];
  }

  // Load a new script into the player
  loadScript(segments) {
    this.stop();
    this.segments = segments;
    this.currentIndex = 0;
    this.currentSegment = segments[0] || null;
    this.notify();
  }

  // Play from current position
  async play() {
    if (!this.segments.length) return;

    if (this.isPaused && this.activeUtterance) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        this.isPlaying = true;
        this.isPaused = false;
        this.notify();
        return;
      }
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.notify();
    this.playSegment(this.currentIndex);
  }

  // Play a specific segment by index
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

    // Check Gnani backend live status
    const status = await gnaniService.checkGnaniBackendStatus();
    this.liveMode = status?.isLive || false;

    // Browser Speech Synthesis playback with sentence boundaries
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(segment.text);
      this.activeUtterance = utterance;

      utterance.rate = this.speed;
      utterance.volume = this.volume;
      utterance.pitch = 0.95; // Authoritative, deep documentary timbre

      const voices = window.speechSynthesis.getVoices();
      // Select natural English voice
      const selectedVoice = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('Arthur')) &&
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        if (this.isPlaying && !this.isPaused) {
          this.playSegment(this.currentIndex + 1);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error', e);
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  // Pause playback
  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.isPlaying = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.notify();
  }

  // Resume playback
  resume() {
    if (this.isPaused) {
      this.play();
    }
  }

  // Replay from beginning
  replay() {
    this.stop();
    this.currentIndex = 0;
    this.currentSegment = this.segments[0] || null;
    this.play();
  }

  // Stop playback completely
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.activeUtterance = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify();
  }

  // Set playback speed: 0.75, 1.0, 1.25, 1.5
  setSpeed(rate) {
    this.speed = Math.max(0.5, Math.min(2.0, rate));
    if (this.isPlaying && this.activeUtterance) {
      // Re-trigger current segment with new speed
      this.playSegment(this.currentIndex);
    } else {
      this.notify();
    }
  }

  // Set playback volume: 0.0 to 1.0
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1.0, vol));
    if (this.activeUtterance) {
      this.activeUtterance.volume = this.volume;
    }
    this.notify();
  }

  // Seek to specific segment
  seek(index) {
    if (index >= 0 && index < this.segments.length) {
      this.currentIndex = index;
      this.currentSegment = this.segments[index];
      if (this.isPlaying) {
        this.playSegment(index);
      } else {
        this.notify();
      }
    }
  }
}

export const documentaryNarrator = new DocumentaryNarrator();
