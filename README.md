# MNEME — THE INTELLIGENCE OF EXPERIENCE

> **Product Category:** Independent Human Experience and Decision Intelligence Platform  
> **Tagline:** THE INTELLIGENCE OF EXPERIENCE.  
> **Positioning:** Independent Human Experience and Decision Intelligence Platform.

---

## Overview

MNEME transforms documented real-world and high-fidelity simulated incidents into interactive investigations. It preserves the reasoning behind human decisions under uncertainty — including warning signs, rejected options, trade-offs, and documented outcomes.

MNEME is an independent product with its own identity, audience, and purpose. It is designed for professional public-facing presentation (portfolio, product showcase, and open-source sharing).

## Core Capabilities

- **Knowledge Lock™**: Chronological evidence and outcome reveal; future details remain unavailable until decisions are committed.
- **Case-grounded interrogation**: Assistant responses are restricted to documented case records. If information is not in records, MNEME states that clearly.
- **Multilingual interface and narration**: Initial support for English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, and Bhojpuri, with an extensible centralized i18n architecture.
- **Independent interface/narration languages**: Users can choose UI language and narration language separately.
- **Provider-independent voice architecture**: Browser speech capabilities are used where available. Optional server-side voice providers can be configured via environment variables. Text fallback is always available when a language/voice is unsupported.
- **Experience Creator**: Users can submit experiences in their preferred language with editable text, voice capture where supported, and preserved original-language submissions.

## Integrity

MNEME preserves factual case data. Localized presentation text must not change dates, numbers, telemetry, evidence, decisions, or documented outcomes. Alternate outcomes remain clearly labeled as simulated scenarios where applicable.

## Local Setup

### Prerequisites
- Node.js 18+
- npm

### Install
```bash
npm install
```

### Configure (optional)
Copy `.env.example` to `.env` and configure only services you actually use:

```env
PORT=5000
NODE_ENV=development

# Optional provider-independent voice integration (server-side only)
VOICE_PROVIDER_NAME=
VOICE_STT_URL=
VOICE_STT_API_KEY=
VOICE_TTS_URL=
VOICE_TTS_API_KEY=
```

If voice provider credentials are not configured, MNEME uses browser speech features where available and shows text fallbacks. Unsupported languages/providers are reported in the UI; MNEME does not claim an API integration that is not configured.

### Run
```bash
npm run server
npm run dev
```

Open `http://localhost:5173`.

## Verification

```bash
npm run build
```

## Notes on Voice Support

Speech recognition and synthesis depend on the selected language, browser, OS voices, and any configured server provider. MNEME checks browser voice availability for narration and provides captions/transcripts and text controls. Do not assume every language is supported by every provider.
