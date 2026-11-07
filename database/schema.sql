-- ==============================================================================
-- MNEME — HUMAN EXPERIENCE & DECISION INTELLIGENCE PLATFORM
-- PostgreSQL / Supabase Schema Architecture
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. UNIVERSES (The 10 Operational Experience Domains)
CREATE TABLE IF NOT EXISTS universes (
    id VARCHAR(64) PRIMARY KEY,
    number VARCHAR(4) NOT NULL,
    name VARCHAR(128) NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    color VARCHAR(16) NOT NULL,
    total_cases INTEGER DEFAULT 5,
    verified_cases INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS (Forensic Investigators & Practitioners)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    callsign VARCHAR(64) NOT NULL,
    full_name VARCHAR(128),
    badge_title VARCHAR(128) DEFAULT 'Level 1 Field Forensic Analyst',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CASES (The 50 Archived Field Incidents)
CREATE TABLE IF NOT EXISTS cases (
    id VARCHAR(128) PRIMARY KEY,
    universe_id VARCHAR(64) REFERENCES universes(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    domain VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('VERIFIED', 'PUBLIC CASE STUDY', 'SIMULATED DEMO', 'UNVERIFIED SUBMISSION', 'COMING SOON')),
    status_note TEXT,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master')),
    estimated_duration VARCHAR(32) NOT NULL,
    incident_year VARCHAR(16),
    location_node VARCHAR(255),
    summary TEXT NOT NULL,
    investigator_role VARCHAR(128) NOT NULL,
    primary_objective TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    playable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CASE SOURCES (Provenance & Forensic Chain of Custody)
CREATE TABLE IF NOT EXISTS case_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(64) NOT NULL, -- 'NTSB Report', 'CSB Inquiry', 'Synthetic Benchmark', etc.
    source_url TEXT,
    verification_working_group VARCHAR(128),
    last_reviewed_at DATE DEFAULT CURRENT_DATE,
    chain_of_custody_hash VARCHAR(128),
    ai_disclosure_statement TEXT
);

-- 6. CASE TIMELINE (The Sequential Knowledge Lock Stages)
CREATE TABLE IF NOT EXISTS case_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL,
    timestamp_label VARCHAR(32) NOT NULL, -- e.g. '11:02 AM'
    stage_name VARCHAR(128) NOT NULL,
    system_status VARCHAR(64) NOT NULL,
    context_brief TEXT NOT NULL,
    dilemma_statement TEXT NOT NULL,
    decision_prompt TEXT NOT NULL,
    historical_event_unlocked TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(case_id, stage_number)
);

-- 7. CASE EVIDENCE (Telemetry, Sensors, Audio Logs, Visuals)
CREATE TABLE IF NOT EXISTS case_evidence (
    id VARCHAR(64) PRIMARY KEY,
    timeline_stage_id UUID REFERENCES case_timeline(id) ON DELETE CASCADE,
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL,
    evidence_type VARCHAR(32) NOT NULL, -- 'sensor', 'audio', 'gauge', 'log', 'visual'
    category VARCHAR(64) NOT NULL,
    telemetry_value TEXT NOT NULL,
    forensic_significance TEXT NOT NULL,
    is_clue BOOLEAN DEFAULT FALSE
);

-- 8. DECISION OPTIONS (Multiple Meaningful Tactical Commands)
CREATE TABLE IF NOT EXISTS decision_options (
    id VARCHAR(64) PRIMARY KEY,
    timeline_stage_id UUID REFERENCES case_timeline(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    risk_score VARCHAR(128) NOT NULL
);

-- 9. EXPERT DECISIONS (Documented Expert Course of Action)
CREATE TABLE IF NOT EXISTS expert_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timeline_stage_id UUID REFERENCES case_timeline(id) ON DELETE CASCADE,
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    selected_option_id VARCHAR(64) REFERENCES decision_options(id),
    expert_reasoning TEXT NOT NULL,
    rejected_alternatives_rationale TEXT
);

-- 10. INVESTIGATION SESSIONS (User Active & Completed Sessions)
CREATE TABLE IF NOT EXISTS investigation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    current_stage_number INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    expert_alignment_score INTEGER, -- 0 - 100 percentage
    clues_discovered_count INTEGER DEFAULT 0,
    clues_missed_count INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 11. USER DECISIONS (Cryptographic Knowledge Locks committed by User)
CREATE TABLE IF NOT EXISTS user_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES investigation_sessions(id) ON DELETE CASCADE,
    timeline_stage_id UUID REFERENCES case_timeline(id) ON DELETE CASCADE,
    selected_option_id VARCHAR(64) REFERENCES decision_options(id),
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    tactical_reasoning TEXT,
    is_expert_match BOOLEAN NOT NULL,
    locked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ALTERNATE SCENARIOS (The Multiverse Counterfactual Simulations)
CREATE TABLE IF NOT EXISTS alternate_scenarios (
    id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    choice_point VARCHAR(255) NOT NULL,
    scenario_label VARCHAR(32) DEFAULT 'SIMULATED SCENARIO',
    title VARCHAR(255) NOT NULL,
    probability_estimate VARCHAR(64),
    outcome_summary TEXT NOT NULL,
    cost_impact VARCHAR(64),
    safety_impact VARCHAR(64),
    downtime_impact VARCHAR(64),
    reputation_impact VARCHAR(64)
);

-- 13. EXPERIENCE SUBMISSIONS (Community Contribution Workflow)
CREATE TABLE IF NOT EXISTS experience_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(128) NOT NULL,
    incident_date VARCHAR(64),
    contributor_name VARCHAR(128),
    organization VARCHAR(128),
    is_anonymous BOOLEAN DEFAULT FALSE,
    consent_granted BOOLEAN NOT NULL,
    status VARCHAR(32) DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CLARIFICATION', 'APPROVED', 'REJECTED')),
    incident_narrative TEXT NOT NULL,
    clues_noticed TEXT,
    decisions_considered TEXT,
    final_decision_taken TEXT,
    mistakes_avoided TEXT,
    lessons_learned TEXT,
    voice_recording_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 14. VERIFICATION REVIEWS (Formal Peer Review Ledger)
CREATE TABLE IF NOT EXISTS verification_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(128) REFERENCES cases(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(128) NOT NULL,
    reviewer_credential VARCHAR(255) NOT NULL,
    review_status VARCHAR(32) NOT NULL CHECK (review_status IN ('VERIFIED', 'NEEDS_REVISION', 'REJECTED')),
    notes TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public cases read access" ON cases FOR SELECT USING (true);
CREATE POLICY "Public universes read access" ON universes FOR SELECT USING (true);

