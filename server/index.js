import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// In-memory fallback store (no external DB required for local/demo use)
let submissions = [
  {
    id: 'sub-sample-01',
    title: 'High-Pressure Oxygen Line Micro-Fracture',
    domain: 'Machine World',
    incidentDate: '2023-08-14',
    contributorName: 'Marcus Vance (Aerospace Ground Support)',
    consentGranted: true,
    status: 'UNDER_REVIEW',
    originalLanguage: 'en',
    narrationLanguage: 'en',
    description: 'During cryogenic helium leak check, a 0.2 bar delta was dismissed as ambient temperature drift. Subsequent acoustic leak detector pinpointed a hairline crack in a stainless-steel flare joint before hypergolic fueling.',
    originalDescription: 'During cryogenic helium leak check, a 0.2 bar delta was dismissed as ambient temperature drift. Subsequent acoustic leak detector pinpointed a hairline crack in a stainless-steel flare joint before hypergolic fueling.',
    translatedDescription: '',
    cluesNoticed: 'Micro-condensation ring forming around flange #4 despite dry air purge.',
    decisionsConsidered: 'Option A: Proceed with fueling assuming sensor thermal drift. Option B: Abort fueling countdown and perform ultrasound dye test.',
    finalDecisionTaken: 'Ordered full countdown abort and ultrasound test.',
    mistakesAvoided: 'Prevented hypergolic propellant contact with leaking pure oxygen under 250 bar pressure.',
    lessonsLearned: 'Never rationalize a delta-P reading that deviates from adiabatic gas law curves without physical verification.',
    voiceTranscript: '',
    submittedAt: '2024-10-12T14:32:00Z'
  }
];

let investigationSessions = [];

function voiceProviderConfig() {
  // Provider-independent: configure any provider via env vars. Keys stay server-side.
  return {
    sttUrl: process.env.VOICE_STT_URL || '',
    sttKey: process.env.VOICE_STT_API_KEY || '',
    ttsUrl: process.env.VOICE_TTS_URL || '',
    ttsKey: process.env.VOICE_TTS_API_KEY || '',
    providerName: process.env.VOICE_PROVIDER_NAME || 'Custom Voice Provider'
  };
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'MNEME — Independent Human Experience and Decision Intelligence Platform',
    tagline: 'THE INTELLIGENCE OF EXPERIENCE.',
    version: '1.1.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/voice/status', (req, res) => {
  const cfg = voiceProviderConfig();
  const configured = Boolean((cfg.sttUrl && cfg.sttKey) || (cfg.ttsUrl && cfg.ttsKey));
  res.json({
    configured,
    mode: configured ? 'PROVIDER_CONFIGURED' : 'BROWSER_FALLBACK',
    providerName: configured ? cfg.providerName : 'Browser fallback',
    stt: cfg.sttUrl && cfg.sttKey ? `Configured (${cfg.providerName})` : 'Not configured — browser speech recognition/text fallback',
    tts: cfg.ttsUrl && cfg.ttsKey ? `Configured (${cfg.providerName})` : 'Not configured — browser speech synthesis/text fallback',
    notice: configured
      ? `Server voice provider configured: ${cfg.providerName}. Actual per-language support depends on the provider.`
      : 'No server voice provider configured. MNEME uses browser speech capabilities where available and always provides text fallback. Configure VOICE_STT_URL/VOICE_STT_API_KEY and/or VOICE_TTS_URL/VOICE_TTS_API_KEY in .env to enable a server provider.'
  });
});

// Backward-compatible endpoint name
app.get('/api/gnani/status', (req, res) => {
  const cfg = voiceProviderConfig();
  const configured = Boolean((cfg.sttUrl && cfg.sttKey) || (cfg.ttsUrl && cfg.ttsKey));
  res.json({
    configured,
    mode: configured ? 'PROVIDER_CONFIGURED' : 'BROWSER_FALLBACK',
    notice: configured
      ? `Voice provider configured (${cfg.providerName}).`
      : 'No server voice provider configured. Using browser/text fallback.'
  });
});

app.post('/api/voice/stt', async (req, res) => {
  const cfg = voiceProviderConfig();
  const { language, locale } = req.body || {};
  if (!cfg.sttUrl || !cfg.sttKey) {
    return res.status(200).json({
      status: 'NOT_CONFIGURED',
      language: language || 'en',
      locale: locale || 'en-US',
      transcript: '',
      message: 'No server STT provider configured. Use browser speech recognition or editable text input.'
    });
  }
  // Provider call intentionally not hardcoded to a vendor endpoint/schema.
  // Integrators can adapt this proxy to their configured provider contract.
  return res.status(200).json({
    status: 'PROVIDER_UNSUPPORTED',
    language: language || 'en',
    message: `Server STT provider ${cfg.providerName} is configured, but this proxy needs a provider-specific adapter. Use browser speech recognition or editable text input until adapted.`
  });
});

app.post('/api/voice/tts', async (req, res) => {
  const cfg = voiceProviderConfig();
  const { text, language, locale } = req.body || {};
  if (!text || !String(text).trim()) return res.status(400).json({ error: 'Text is required.' });
  if (!cfg.ttsUrl || !cfg.ttsKey) {
    return res.status(200).json({
      status: 'NOT_CONFIGURED',
      language: language || 'en',
      locale: locale || 'en-US',
      message: 'No server TTS provider configured. Use browser speech synthesis or on-screen text.'
    });
  }
  return res.status(200).json({
    status: 'PROVIDER_UNSUPPORTED',
    language: language || 'en',
    message: `Server TTS provider ${cfg.providerName} is configured, but this proxy needs a provider-specific adapter. Use browser speech synthesis or on-screen text until adapted.`
  });
});

// Backward-compatible aliases
app.post('/api/gnani/stt', (req, res, next) => app._router.handle({ ...req, url: '/api/voice/stt' }, res, next));
app.post('/api/gnani/tts', (req, res, next) => app._router.handle({ ...req, url: '/api/voice/tts' }, res, next));

// ==========================================
// CASE-GROUNDED CROSS-EXAMINATION AI
// Strictly grounded in case records. Never fabricates.
// ==========================================
const GROUNDED_CASE_KNOWLEDGE = {
  'the-silent-failure': {
    title: 'The Silent Failure',
    domain: 'Machine World',
    facts: [
      { triggers: ['vibration', 'x-44', 'sensor', '11:02', '14.2 hz'], answer: 'At 11:02 AM, radial vibration sensor X-44 registered 4.2 mm/s at 14.2 Hz sub-synchronous frequency. Normal operational baseline is below 2.5 mm/s. The sub-synchronous frequency specifically indicated oil whip or loose bearing pads rather than unbalance.' },
      { triggers: ['temperature', 'tc-2a', '11:08', 'heat', 'babbitt'], answer: 'At 11:08 AM, Bearing #2 journal temperature spiked from 78°C to 109°C at a rate of +5.2°C/min. Thermocouple TC-2A showed a 25°C differential compared to TC-2B, revealing severe localized asymmetric oil starvation.' },
      { triggers: ['expert decision', 'expert', 'throttle', 'why 60%'], answer: 'The lead reliability expert throttled load to 60% instead of tripping immediately to relieve 35% of bearing lateral thrust while keeping hydrodynamic oil film intact for spectral diagnostics. During deceleration, the expert engaged jacking oil and turning gear at 150 RPM to prevent the 12-ton hot rotor from thermal bowing.' },
      { triggers: ['root cause', 'cause', 'why did it fail', 'subcontractor', 'torque'], answer: 'Forensic inspection at 11:42 AM confirmed high-cycle fatigue spalling on the lower pad of Bearing #2. The root cause was an under-torqued pivot pin installed by a subcontractor 45 days prior, which lacked formal quality sign-off in the maintenance audit log.' },
      { triggers: ['silver flake', 'oil', 'sight glass', 'filter'], answer: 'At 11:08 AM, visual inspection of the lube oil return sight glass revealed fine silver flake particulates in suspension, proving the Babbitt metal alloy was actively shearing into the fluid stream.' },
      { triggers: ['cost', 'downtime', 'loss'], answer: 'Turbine downtime cost was estimated at $180,000 per hour. Total catastrophic destruction if the rotor had seized under full load was modeled at $28,500,000.' }
    ]
  },
  'the-ghost-in-the-wire': {
    title: 'The Ghost in the Wire',
    domain: 'Digital Underworld',
    facts: [
      { triggers: ['kerberos', 'kerberoasting', '4769', 'rc4'], answer: 'At 02:14 AM, SIEM logs registered 412 Kerberos TGS-REQ packets in 8 seconds requesting RC4-encrypted service tickets for MSSQL and Backup Admin accounts, indicating an automated Kerberoasting attack for offline password cracking.' },
      { triggers: ['vpn', 'compromise', 'osaka', 'analyst', 'ws-fin-0892'], answer: 'Workstation WS-FIN-0892 authenticated from an unauthorized Osaka IP over WireGuard with no second-factor prompt, indicating adversary session token theft / adversary-in-the-middle proxy.' },
      { triggers: ['expert decision', 'expert', 'honeytoken'], answer: 'The incident commander deployed a synthetic honey-SPN account while isolating WS-FIN-0892 via VLAN redirect, trapping adversary memory space rather than triggering wiper malware with an abrupt mass disconnect.' }
    ]
  },
  'midnight-cascade': {
    title: 'Midnight Cascade',
    domain: 'Crisis Room',
    facts: [
      { triggers: ['sensor divergence', 'water level', 'ds-4', 'us-2'], answer: 'Downstream Sensor DS-4 read +4.6m NAP while upstream Sensor US-2 read +2.8m NAP. Barometric pressure had plunged to 952 hPa, creating an inverted barometer surge effect adding 45cm to the storm tide.' },
      { triggers: ['barge', 'vessel', 'canal'], answer: 'At 01:45 AM, an unsteered 2,000-ton cargo barge drifted sideways toward Pier 4 in the navigation bottleneck. Harbor tugs were scrambled to push the barge onto a shallow mudbank to allow gate closure at 02:04 AM.' }
    ]
  }
};

const NOT_IN_RECORDS = 'This information is not documented in the available case records.';

app.post('/api/cross-examine', (req, res) => {
  const { caseId, query, language } = req.body || {};
  if (!query || !String(query).trim()) return res.status(400).json({ error: 'Query is required.' });
  const cleanQuery = String(query).toLowerCase().trim();
  const caseKnowledge = GROUNDED_CASE_KNOWLEDGE[caseId];

  if (!caseKnowledge) {
    return res.json({ grounded: true, caseId, language: language || 'en', answer: NOT_IN_RECORDS, source: 'MNEME Evidence Passport', status: 'UNVERIFIED_IN_RECORDS' });
  }
  let matchedFact = null;
  for (const fact of caseKnowledge.facts) {
    if (fact.triggers.some((trigger) => cleanQuery.includes(trigger))) {
      matchedFact = fact;
      break;
    }
  }
  if (matchedFact) {
    return res.json({ grounded: true, caseId, language: language || 'en', answer: matchedFact.answer, source: `MNEME Evidence Passport (${caseKnowledge.title})`, status: 'VERIFIED_RECORD' });
  }
  return res.json({ grounded: true, caseId, language: language || 'en', answer: NOT_IN_RECORDS, source: `MNEME Evidence Passport (${caseKnowledge.title})`, status: 'UNVERIFIED_IN_RECORDS' });
});

// Experience submissions
app.get('/api/submissions', (req, res) => {
  res.json({ count: submissions.length, submissions });
});

app.post('/api/submissions', (req, res) => {
  const body = req.body || {};
  const { title, domain, description, originalDescription } = body;
  if (!title || !(description || originalDescription) || !domain) {
    return res.status(400).json({ error: 'Title, domain, and incident description are required.' });
  }
  const original = (body.originalDescription || body.description || '').trim();
  const translated = (body.translatedDescription || '').trim();
  const newSubmission = {
    id: `sub-${Date.now()}`,
    status: 'SUBMITTED',
    title,
    domain,
    incidentDate: body.incidentDate || 'Unspecified Period',
    contributorName: body.contributorName || 'Anonymous Practitioner',
    consentGranted: Boolean(body.consentGranted),
    originalLanguage: body.originalLanguage || body.language || 'en',
    narrationLanguage: body.narrationLanguage || body.originalLanguage || 'en',
    // Preserve original submission text separately. Never overwrite it with generated translation.
    originalDescription: original,
    description: original,
    translatedDescription: translated,
    voiceTranscript: body.voiceTranscript || '',
    cluesNoticed: body.cluesNoticed || '',
    decisionsConsidered: body.decisionsConsidered || '',
    finalDecisionTaken: body.finalDecisionTaken || '',
    mistakesAvoided: body.mistakesAvoided || '',
    lessonsLearned: body.lessonsLearned || '',
    submittedAt: new Date().toISOString()
  };
  submissions.unshift(newSubmission);
  res.status(201).json({ success: true, message: 'Experience submitted for review. Original-language content was preserved.', submission: newSubmission });
});

app.post('/api/investigations/save', (req, res) => {
  investigationSessions.push({ ...(req.body || {}), savedAt: new Date().toISOString() });
  res.json({ success: true, count: investigationSessions.length });
});

app.listen(PORT, () => {
  console.log(`[MNEME Server] Running on http://localhost:${PORT}`);
  console.log('[MNEME Server] Provider-independent voice routes and grounded cross-examination active.');
});
