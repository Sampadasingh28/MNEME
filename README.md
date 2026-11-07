# MNEME — THE INTELLIGENCE OF EXPERIENCE

> **Product Category:** Human Experience & Decision Intelligence Platform  
> **Tagline:** The Intelligence of Experience.  
> **Challenge:** Developed for the **Great Indian AI Internship Challenge by Gnani.ai**.

---

## 1. Central Philosophy

> *"People don't just carry knowledge. They carry experiences, decisions, mistakes, instincts and lessons that are rarely documented."*

When veteran incident commanders, aerospace engineers, or trauma physicians retire or step away, textbooks remain. But their instincts, the subtle 1% of warning signals they noticed, and the tempting options they consciously rejected disappear forever.

**MNEME** transforms documented real-world and high-fidelity simulated incidents into interactive cognitive investigations. It preserves the reasoning behind human decisions under uncertainty, not merely the final outcome.

---

## 2. Key Architectural Innovations

### 1. The Signature Knowledge Lock™
- In real-world crises, nobody receives tomorrow's post-mortem report today.
- The Knowledge Lock enforces **strict chronological revelation**: future telemetry, alarm cascades, and failure points are cryptographically padlocked until you irreversibly commit your tactical command at that second.
- Post-lock, confront what the documented expert did, why they acted, and what clues you spotted or missed.

### 2. The Multiverse Lab (Branching Counterfactuals)
- What if the vibration alert was dismissed as sensor drift?
- What if an emergency scram was initiated without thermal relaxation?
- Explore branching counterfactual timelines with simulated impact matrices (Cost, Safety, System Downtime, Institutional Reputation).
- **Integrity Guarantee:** Every alternate path carries an explicit **`SIMULATED SCENARIO`** label.

### 3. Decision Time Machine
- An interactive chronological scrubber enabling investigators to scrub between `T+00:00` and incident conclusion.
- Side-by-side comparison of user decisions vs documented expert doctrine against physical sensor curves.

### 4. Expert Cross-Examination (Strict Grounding AI)
- Conversational interrogation channel grounded strictly in the case Evidence Passport.
- **Strict Anti-Hallucination Guardrail:** If an inquiry asks about undocumented facts, the system strictly returns:
  `"This information is not documented in the available case records."`
- Voice-enabled via Gnani Prisma (STT) and Gnani Timbre (TTS).

### 5. Gnani AI Voice Integration
- **Gnani Prisma:** Real-time speech-to-text for hands-free cross-examination and voice-recorded incident contributions.
- **Gnani Timbre:** Natural neural text-to-speech engine for case telemetry readouts.
- **Provider Service Layer:** Server-proxied API keys with automatic, high-fidelity browser fallback and visual status indicators (`LIVE` vs `DEMO MODE`).

### 6. The 50-Case Universe Library
- Fifty structured case slots across ten distinct operational universes:
  1. **Machine World** (Industrial breakdowns, turbine vibration anomalies)
  2. **Digital Underworld** (Active Directory Kerberoasting, air-gap breaches)
  3. **Crisis Room** (Estuary storm surge sluice desynchronization)
  4. **Business War Room** (Foreign exchange liquidity freeze)
  5. **Human Health** (Smart pump dosage unit discrepancies)
  6. **Earth & Survival** (Sub-zero cordillera survival, aquifer collapse)
  7. **Unexpected Journey** (Polar ETOPS point of safe return diversion)
  8. **Human Factor** (Cockpit authority gradient, crew resource management)
  9. **Creator's Mind** (William LeMessurier's Citicorp bolted joint crisis)
  10. **Everyday Unknown** (Mercaptan-scrubbed odorless basement gas leaks)

### 7. My Decision DNA
- An empirical learning dashboard tracking:
  - Cases completed & decisions locked
  - Expert Concordance Percentage
  - Clue Discovery Rate (identified vs missed)
  - Operational Risk Appetite & Hesitation Metric
  - Domain Footprint across the 10 Universes
- **Data Integrity:** Derived strictly from actual session interactions, not arbitrary personality quizzes.

### 8. Evidence Passport & Verification
- Five-pillar verification standard ensuring transparency.
- Clear status badges across all cases:
  - `VERIFIED`
  - `PUBLIC CASE STUDY`
  - `SIMULATED DEMO`
  - `UNVERIFIED SUBMISSION`
  - `COMING SOON`

---

## 3. Technology Stack

- **Frontend:**
  - React 18
  - Vite 6
  - Tailwind CSS 3
  - Framer Motion 12
  - Lucide React Icons
  - Canvas Confetti
  - Web Audio API (tactile sci-fi feedback)
- **Backend:**
  - Node.js (v20+ / v24)
  - Express
  - CORS & Dotenv
- **AI & Voice:**
  - Gnani Prisma (Speech-to-Text)
  - Gnani Timbre (Text-to-Speech)
  - Case-grounded Forensic Guardrail Engine
- **Database:**
  - PostgreSQL / Supabase ready (`database/schema.sql`)
  - LocalStorage resilient client cache

---

## 4. Website Route Architecture

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | **Home** | Cinematic introduction, manifesto, Knowledge Lock preview, domains overview |
| `/universe` | **Explore Universe** | 50-case library with search, multi-filters, sorting, and status badges |
| `/case/:id` | **Case Details** | Full incident briefing, investigator persona, evidence passport, objective |
| `/investigate/:id` | **Investigation** | The Knowledge Lock engine, sequential evidence reveal, decision locks, learning report |
| `/time-machine/:id` | **Time Machine** | Chronological scrubber comparing user path vs expert timeline |
| `/multiverse/:id` | **Multiverse Lab** | Branching scenario explorer with simulated cost/safety impact matrices |
| `/cross-examination/:id`| **Cross-Examination**| Case-grounded AI conversational interrogation with Gnani voice |
| `/experience/create` | **Experience Creator**| Multi-step practitioner incident submission with voice dictation & consent |
| `/dashboard` | **My Decision DNA** | Cognitive analytics dashboard tracking clue discovery, concordance, and history |
| `/verification` | **Evidence & Trust** | 5-pillar verification framework, passport anatomy, integrity manifesto |
| `/about` | **About MNEME** | Philosophical origin, Gnani.ai challenge context, and system architecture |

---

## 5. Getting Started & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/mneme.git
cd mneme
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional) If you have Gnani API keys, add them to `.env`:*
```env
GNANI_PRISMA_API_KEY=your_prisma_key
GNANI_TIMBRE_API_KEY=your_timbre_key
PORT=5000
```
*If keys are omitted, MNEME automatically activates high-fidelity client-side voice synthesis and recognition in clearly labeled Demo Mode.*

### 3. Launch the Application

Run the backend server:
```bash
npm run server
```

In another terminal, run the Vite frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Testing & Quality Assurance

- **Production Build:**
  ```bash
  npm run build
  ```
- **Preview Build:**
  ```bash
  npm run preview
  ```

---

## 7. License & Credits

Built for the **Great Indian AI Internship Challenge by Gnani.ai**.  
Engineered with precision for human cognitive preservation.
