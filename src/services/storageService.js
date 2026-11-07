// MNEME Local & Cloud Storage Service
// Handles Decision DNA tracking, completed investigations, and experience submissions

const STORAGE_KEYS = {
  USER_SESSION: 'mneme_user_session',
  INVESTIGATION_PROGRESS: 'mneme_investigation_progress_',
  COMPLETED_INVESTIGATIONS: 'mneme_completed_investigations',
  DECISION_DNA: 'mneme_decision_dna',
  EXPERIENCE_SUBMISSIONS: 'mneme_experience_submissions',
  BOOKMARKED_CASES: 'mneme_bookmarked_cases'
};

// Default initial Decision DNA state
export const INITIAL_DECISION_DNA = {
  totalInvestigated: 0,
  decisionsMade: 0,
  expertAlignmentScore: 84, // percentage
  cluesDiscovered: 0,
  cluesMissed: 0,
  averageCompletionTime: '11m 45s',
  hesitationIndex: 'Low (Decisive)',
  riskAppetite: 'Calculated / Systematic',
  exploredDomains: {
    'Machine World': 0,
    'Digital Underworld': 0,
    'Crisis Room': 0,
    'Business War Room': 0,
    'Human Health': 0,
    'Earth & Survival': 0,
    'Unexpected Journey': 0,
    'Human Factor': 0,
    "Creator's Mind": 0,
    'Everyday Unknown': 0
  },
  history: []
};

export const storageService = {
  // Get active user or mock session
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (data) return JSON.parse(data);
      const defaultUser = {
        id: 'usr-agent-01',
        name: 'Cadet Investigator',
        callsign: 'KNOWLEDGE-SEEKER',
        badge: 'Level 2 Field Forensic Analyst',
        joinedAt: '2024-11-01'
      };
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return { id: 'usr-guest', name: 'Investigator', callsign: 'GUEST' };
    }
  },

  // Save in-progress investigation stage
  saveInvestigationProgress(caseId, state) {
    try {
      localStorage.setItem(`${STORAGE_KEYS.INVESTIGATION_PROGRESS}${caseId}`, JSON.stringify({
        ...state,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Could not save investigation progress', e);
    }
  },

  // Retrieve in-progress investigation stage
  getInvestigationProgress(caseId) {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.INVESTIGATION_PROGRESS}${caseId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Clear in-progress investigation stage
  clearInvestigationProgress(caseId) {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.INVESTIGATION_PROGRESS}${caseId}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // Record a fully completed investigation & update Decision DNA
  recordCompletedInvestigation(summary) {
    try {
      // 1. Append to completed investigations
      const existingStr = localStorage.getItem(STORAGE_KEYS.COMPLETED_INVESTIGATIONS);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [summary, ...existing.filter(item => item.caseId !== summary.caseId)];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_INVESTIGATIONS, JSON.stringify(updated));

      // 2. Update Decision DNA stats
      const dnaStr = localStorage.getItem(STORAGE_KEYS.DECISION_DNA);
      const dna = dnaStr ? JSON.parse(dnaStr) : { ...INITIAL_DECISION_DNA };

      dna.totalInvestigated = updated.length;
      dna.decisionsMade += (summary.decisionsCount || 1);
      dna.cluesDiscovered += (summary.cluesDiscovered || 0);
      dna.cluesMissed += (summary.cluesMissed || 0);

      if (summary.domain && dna.exploredDomains[summary.domain] !== undefined) {
        dna.exploredDomains[summary.domain] += 1;
      }

      // Calculate expert alignment
      if (summary.expertAlignmentPercentage) {
        dna.expertAlignmentScore = Math.round(
          (dna.expertAlignmentScore * 0.7) + (summary.expertAlignmentPercentage * 0.3)
        );
      }

      dna.history.unshift({
        caseId: summary.caseId,
        caseTitle: summary.caseTitle,
        domain: summary.domain,
        timestamp: new Date().toISOString(),
        score: summary.expertAlignmentPercentage || 85,
        cluesRate: `${summary.cluesDiscovered}/${(summary.cluesDiscovered + summary.cluesMissed)}`
      });

      localStorage.setItem(STORAGE_KEYS.DECISION_DNA, JSON.stringify(dna));
      return { dna, updated };
    } catch (e) {
      console.error('Error updating Decision DNA', e);
      return null;
    }
  },

  // Get current Decision DNA
  getDecisionDNA() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DECISION_DNA);
      if (data) return JSON.parse(data);
      // Pre-seed with sample active state if empty
      const seeded = {
        ...INITIAL_DECISION_DNA,
        totalInvestigated: 2,
        decisionsMade: 6,
        cluesDiscovered: 7,
        cluesMissed: 2,
        exploredDomains: {
          ...INITIAL_DECISION_DNA.exploredDomains,
          'Machine World': 1,
          'Digital Underworld': 1
        },
        history: [
          {
            caseId: 'the-silent-failure',
            caseTitle: 'The Silent Failure',
            domain: 'Machine World',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            score: 92,
            cluesRate: '4/4'
          },
          {
            caseId: 'the-ghost-in-the-wire',
            caseTitle: 'The Ghost in the Wire',
            domain: 'Digital Underworld',
            timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
            score: 88,
            cluesRate: '3/4'
          }
        ]
      };
      localStorage.setItem(STORAGE_KEYS.DECISION_DNA, JSON.stringify(seeded));
      return seeded;
    } catch {
      return INITIAL_DECISION_DNA;
    }
  },

  // Save new experience submission
  saveExperienceSubmission(submission) {
    try {
      const existingStr = localStorage.getItem(STORAGE_KEYS.EXPERIENCE_SUBMISSIONS);
      const list = existingStr ? JSON.parse(existingStr) : [];
      const newEntry = {
        id: `sub-${Date.now()}`,
        status: 'SUBMITTED', // 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
        submittedAt: new Date().toISOString(),
        ...submission
      };
      const updated = [newEntry, ...list];
      localStorage.setItem(STORAGE_KEYS.EXPERIENCE_SUBMISSIONS, JSON.stringify(updated));
      return newEntry;
    } catch (e) {
      console.error('Failed to save submission', e);
      return null;
    }
  },

  // Get all submissions
  getSubmissions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPERIENCE_SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Bookmarking cases
  toggleBookmark(caseId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_CASES);
      let list = raw ? JSON.parse(raw) : [];
      if (list.includes(caseId)) {
        list = list.filter(id => id !== caseId);
      } else {
        list.push(caseId);
      }
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED_CASES, JSON.stringify(list));
      return list;
    } catch {
      return [];
    }
  },

  getBookmarks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_CASES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};

