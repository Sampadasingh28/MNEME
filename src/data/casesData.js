// MNEME 50-Case Library Data Architecture
// Across 10 Universes (5 cases per Universe = 50 Cases)
// Strict Status Labels: 'VERIFIED' | 'PUBLIC CASE STUDY' | 'SIMULATED DEMO' | 'UNVERIFIED SUBMISSION' | 'COMING SOON'

export const CASES = [
  // ==========================================
  // UNIVERSE 01: MACHINE WORLD
  // ==========================================
  {
    id: 'the-silent-failure',
    universeId: 'machine-world',
    title: 'The Silent Failure',
    subtitle: 'Vibration frequency anomaly on high-output gas turbine Unit 4',
    domain: 'Machine World',
    status: 'SIMULATED DEMO',
    statusNote: 'Simulated demonstration based on real industrial gas-turbine failure patterns.',
    difficulty: 'Advanced',
    duration: '12 min',
    featured: true,
    playable: true,
    year: '2024',
    location: 'North Sea Offshore Energy Platform Gamma-7',
    summary: 'A critical industrial gas turbine operating at 94% load begins emitting a low-frequency vibration (14.2 Hz). The machine is still generating 38 MW of power, but subtle telemetry discrepancies suggest bearing fatigue or shaft misalignment. Shutting down costs $180,000/hour in downtime; failure under load will trigger catastrophic shrapnel release.',
    investigatorRole: 'Lead Reliability & Rotating Equipment Engineer',
    primaryObjective: 'Analyze telemetry, isolate the root cause under operational pressure, and determine whether to throttle, override, or emergency trip the turbine.',
    
    // Knowledge Lock Sequential Stages (Must be unlocked step by step)
    stages: [
      {
        stageNumber: 1,
        stageName: 'INCIDENT BRIEF & TELEMETRY ANOMALY',
        timestamp: '11:02 AM',
        systemStatus: 'Operational (Elevated Warning)',
        context: 'At 11:02 AM, the centralized SCADA monitoring room flashes a Stage-1 Amber Alert on Turbine Unit 4. Turbine RPM is steady at 3,600, power output is 38.2 MW, but radial vibration sensor X-44 reports an oscillation of 4.2 mm/s (normal ceiling is 2.5 mm/s).',
        dilemma: 'The shift supervisor asks if this is a sensor drift or structural bearing distress. Peak grid demand begins in 45 minutes.',
        evidenceList: [
          {
            id: 'ev-101',
            title: 'Radial Vibration Sensor X-44 Telemetry',
            type: 'sensor',
            category: 'Telemetry',
            value: '4.2 mm/s RMS @ 14.2 Hz sub-synchronous frequency',
            significance: 'Critical anomaly: Sub-synchronous vibrations often signal oil whip or loose bearing pads rather than simple rotor unbalance.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-102',
            title: 'Lube Oil Supply Pressure & Temp Gauge',
            type: 'gauge',
            category: 'Hydraulics',
            value: 'Pressure: 3.8 bar (Normal: 4.0 bar) | Inflow Temp: 48°C (Normal)',
            significance: 'Slight pressure decrease (5%) on primary manifold. Could indicate filter restriction or pump cavitation.',
            isClue: false,
            discovered: false
          },
          {
            id: 'ev-103',
            title: 'Shift Operator Audio Log #1',
            type: 'audio',
            category: 'Audio Record',
            value: 'Transcript: "Unit 4 has a faint metallic purr when standing near bearing pedestal #2. It comes and goes every 18 seconds."',
            significance: 'Key acoustic clue: Periodic cycling points to beat frequency between two asynchronous rotating elements.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'What is your immediate tactical order at 11:02 AM?',
        decisionOptions: [
          {
            id: 'opt-1-a',
            label: 'Instant Emergency Trip (Full Shutdown)',
            description: 'Trigger immediate safety bypass trip. Safest physically, but dumps 38MW into grid deficit, incurs $180k/hr downtime penalty, and prevents dynamic diagnostics under load.',
            riskScore: 'High Operational Cost / Zero Physical Risk'
          },
          {
            id: 'opt-1-b',
            label: 'Throttle Load to 60% & Deploy Diagnostic Acoustic Probe',
            description: 'Reduce thermal stress on the shaft, order an immediate spectrum analysis on Bearing 2, and switch to secondary auxiliary lube pump.',
            riskScore: 'Balanced / Measured Investigation'
          },
          {
            id: 'opt-1-c',
            label: 'Acknowledge Alarm & Maintain Full Load for Grid Peak',
            description: 'Log the spike as probable sensor drift. Keep turbine running at 94% load until the scheduled 16:00 inspection window.',
            riskScore: 'Extreme Catastrophic Risk'
          }
        ],
        expertActionTaken: 'opt-1-b',
        expertReasoning: 'Emergency trip without spectral data obscures the root cause and leaves the facility blind to whether the problem was bearing babbitt degradation or thermal bow. Throttling to 60% relieved 35% of bearing lateral thrust while keeping oil film intact for telemetry verification.',
        historicalEventUnlocked: 'At 11:05 AM, load was stepped down to 60%. Sensor X-44 vibration dropped slightly to 3.8 mm/s, but bearing cavity temperature began to rise steeply.'
      },
      {
        stageNumber: 2,
        stageName: 'THERMAL CASCADE & SECONDARY ALARM',
        timestamp: '11:08 AM',
        systemStatus: 'Degraded Operation (Stage-2 Red Alert)',
        context: 'At 11:08 AM, despite reducing load to 60%, Bearing #2 journal temperature spikes from 78°C to 109°C in under 6 minutes. The rate of rise is +5.2°C per minute.',
        dilemma: 'The Babbitt metal alloy lining in Bearing #2 will begin softening at 130°C. If the metal melts, metal-on-metal friction will weld the rotor to the stator at 3,600 RPM.',
        evidenceList: [
          {
            id: 'ev-201',
            title: 'Bearing #2 Thermocouple Array TC-2A / TC-2B',
            type: 'sensor',
            category: 'Thermal Telemetry',
            value: 'TC-2A: 109°C (Fast climb) | TC-2B: 84°C',
            significance: 'Crucial clue: 25°C differential between opposite quadrants of the bearing shell reveals asymmetric load distribution or localized oil starvation.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-202',
            title: 'Lube Oil Differential Pressure Filter DP-12',
            type: 'sensor',
            category: 'Lube System',
            value: 'Delta P = 1.4 bar (Clean threshold: 0.5 bar, Bypass trip: 1.8 bar)',
            significance: 'The filter is rapidly clogging with particulate matter.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-203',
            title: 'Lube Oil Return Sight Glass Visual Inspection',
            type: 'visual',
            category: 'Visual Inspection',
            value: 'Fine silver flake particulate visible in suspension within swirling synthetic oil stream.',
            significance: 'Definitive physical evidence: Bearing babbit alloy is actively shearing and dispersing into the oil stream.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Bearing #2 is reaching thermal limits and shedding metal. What is your command at 11:08 AM?',
        decisionOptions: [
          {
            id: 'opt-2-a',
            label: 'Engage Auxiliary High-Pressure Oil Booster Pump',
            description: 'Attempt to force high-pressure cooled oil into Bearing #2 to wash out heat and restore hydrodynamic fluid film.',
            riskScore: 'High Risk (May inject particulates directly into other healthy bearings)'
          },
          {
            id: 'opt-2-b',
            label: 'Controlled Deceleration & Immediate Turning Gear Engagement',
            description: 'Initiate normal decelerated shutdown sequence with continuous jacking oil to prevent rotor shaft sagging / thermal bow.',
            riskScore: 'Optimal Engineered Response'
          },
          {
            id: 'opt-2-c',
            label: 'Hard Emergency Scram (Instant Electrical Trip & Instant Stop)',
            description: 'Cut fuel valves instantly and isolate electrical bus. Do not wait for gentle deceleration curve.',
            riskScore: 'High Risk of Rotor Bowing if turning gear is not engaged'
          }
        ],
        expertActionTaken: 'opt-2-b',
        expertReasoning: 'A hard scram without jacking oil and turning gear would allow the 12-ton hot rotor to rest stationary on degraded bearing babbitt, permanently warping the multi-million-dollar shaft. The expert chose controlled deceleration with auxiliary jacking pump engaged.',
        historicalEventUnlocked: 'The turbine was rolled down smoothly over 18 minutes. The jacking oil pump engaged flawlessly at 150 RPM, preventing shaft seizure.'
      },
      {
        stageNumber: 3,
        stageName: 'POST-INCIDENT FORENSIC AUTOPSY',
        timestamp: '11:42 AM',
        systemStatus: 'Safely Isolated on Slow Roll (Barring)',
        context: 'The turbine rotor is safe on turning gear at 45 RPM. The bearing housing is dismantled under clean conditions. Metallurgical inspection confirms the root mechanism.',
        dilemma: 'Management needs to know whether the entire turbine train must be scrapped or if localized replacement can restore operation within 36 hours.',
        evidenceList: [
          {
            id: 'ev-301',
            title: 'Bearing #2 Upper Shell Macro-Photograph',
            type: 'visual',
            category: 'Metallurgy',
            value: 'Severe fatigue spalling on bottom lower pad with 30% babbit loss. Rotor journal has micro-scratches but zero deep grooves.',
            significance: 'Root cause confirmed: High-cycle fatigue due to loose pivot pin installed during prior quarter maintenance.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-302',
            title: 'Maintenance Log from 45 Days Prior',
            type: 'document',
            category: 'Audit Records',
            value: 'Subcontractor crew replaced pivot shims on Bearing #2. Torque specification was not signed off by quality inspector.',
            significance: 'Organizational human factor: Omission of procedural sign-off allowed an under-torqued bolt to back out over 700 hours of continuous vibration.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Final Post-Mortem Recommendation: What policy prevent future recurrence?',
        decisionOptions: [
          {
            id: 'opt-3-a',
            label: 'Replace Bearing #2 and Institute Mandatory Dual-Signoff on Critical Fasteners',
            description: 'Standardize calibrated digital torque wrenches with cryptographic logging, replace affected bearing, and re-certify unit.',
            riskScore: 'Comprehensive Systemic Fix'
          },
          {
            id: 'opt-3-b',
            label: 'Terminate Contractor Firm and Lower Alarm Thresholds on Sensor X-44',
            description: 'Place blame purely on subcontractor and lower vibration alarm trigger to 2.0 mm/s.',
            riskScore: 'Superficial / Fails to address root systemic protocol'
          }
        ],
        expertActionTaken: 'opt-3-a',
        expertReasoning: 'Blaming individuals or vendors misses the systemic vulnerability. The expert instituted tamper-evident torque seals and digital torque wrench upload to prevent undocumented assembly deviations.',
        historicalEventUnlocked: 'Turbine Unit 4 resumed operational service 38 hours later with zero shaft damage. The facility avoided a catastrophic $14.2M rotor destruction.'
      }
    ],

    // Evidence Passport
    evidencePassport: {
      source: 'Industrial Incident Simulation Benchmark #MN-01',
      sourceType: 'Synthetic High-Fidelity Simulation',
      verifiedBy: 'MNEME Heavy Machinery Working Group',
      lastReviewed: '2024-10-18',
      confidenceRating: 'High Fidelity (Simulated)',
      publicDisclosure: 'Modeled after real offshore turbine bearing failure sequences recorded across North Sea energy infrastructure.',
      chainOfCustody: 'Derived from anonymized SCADA vibration logs, ASME B31.3 industrial protocols, and rotating equipment forensic casebooks.'
    },

    // Multiverse Branches (Hypothetical alternate scenarios)
    multiverseBranches: [
      {
        id: 'branch-1',
        choicePoint: 'Decision 1 (11:02 AM) — If Investigator Chose Option C (Maintain Full Load)',
        scenarioLabel: 'SIMULATED SCENARIO',
        title: 'The Catastrophic Shrapnel Breach',
        probability: '92% likelihood under dynamic stress modeling',
        outcomeSummary: 'At 11:24 AM, Bearing #2 babbitt layer completely liquefies. The dry shaft contacts the steel casing at 3,600 RPM. Friction creates thermal seizure in 1.4 seconds. The 12-ton rotor fractures at the mid-span coupling, throwing titanium turbine blades through the casing shroud. Facility is shut down for 9 months with $28M in physical damage and zero fatalities due to perimeter blast curtains.',
        impactMetrics: {
          cost: '-$28,500,000',
          safety: 'Extreme Hazard / Near Miss',
          downtime: '270 Days',
          reputation: 'Catastrophic Regulatory Audit'
        }
      },
      {
        id: 'branch-2',
        choicePoint: 'Decision 1 (11:02 AM) — If Investigator Chose Option A (Instant Emergency Scram)',
        scenarioLabel: 'SIMULATED SCENARIO',
        title: 'The Warped Rotor Lockout',
        probability: '74% likelihood',
        outcomeSummary: 'Instant cutoff without staged throttle thermal relaxation causes immediate thermal bow in the shaft due to natural convective cooling across the top of the casing. The bent shaft cannot be barred over. Rotor replacement takes 6 weeks ($4.2M lost revenue), but total machine destruction was prevented.',
        impactMetrics: {
          cost: '-$4,200,000',
          safety: 'Safe (Zero Personnel Risk)',
          downtime: '42 Days',
          reputation: 'Moderate Operational Scrutiny'
        }
      },
      {
        id: 'branch-3',
        choicePoint: 'Decision 2 (11:08 AM) — If Investigator Chose Option A (Auxiliary HP Booster)',
        scenarioLabel: 'SIMULATED SCENARIO',
        title: 'Cross-Contamination Cascade',
        probability: '81% likelihood',
        outcomeSummary: 'High pressure oil forced sheared metallic debris through the return manifolds into Bearings #1 and #3. All three bearing journals sustained severe gouging, turning a $60k localized fix into a $1.8M multi-stage overhaul.',
        impactMetrics: {
          cost: '-$1,850,000',
          safety: 'Controlled',
          downtime: '18 Days',
          reputation: 'Procedural Reprimand'
        }
      }
    ]
  },

  {
    id: 'stuxnet-centrifuge-telemetry',
    universeId: 'machine-world',
    title: 'The Phantom Resonance',
    subtitle: 'Frequency drive manipulation and destructive vibrational resonance in IR-1 centrifuges',
    domain: 'Machine World',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical analysis of the Stuxnet cyber-physical centrifuge attacks (Natanz, 2009-2010).',
    difficulty: 'Expert',
    duration: '20 min',
    featured: false,
    playable: true,
    year: '2010',
    location: 'Natanz Fuel Enrichment Facility, Iran',
    summary: 'Centrifuge cascade operators observed hundreds of aluminum rotors disintegrating without warning, while control room SCADA monitors continued displaying nominal 1,064 Hz frequencies and steady pressures. The operators were trapped in an artificial sensory reality.',
    investigatorRole: 'Lead Physical Security & SCADA Systems Auditor',
    primaryObjective: 'Detect the discrepancy between physical acoustic vibration signatures and spoofed digital control signals.'
  },
  {
    id: 'deepwater-horizon-bop',
    universeId: 'machine-world',
    title: 'The Blind Shear Ram',
    subtitle: 'Buckling drill pipe and blind shear ram sealing failure under extreme wellbore kick',
    domain: 'Machine World',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on the US Chemical Safety Board (CSB) investigative findings.',
    difficulty: 'Master',
    duration: '25 min',
    featured: false,
    playable: false,
    year: '2010',
    location: 'Macondo Prospect, Gulf of Mexico',
    summary: 'Investigation into why the 400-ton Blowout Preventer (BOP) failed to shear and seal the drill pipe during the Macondo blowout: asymmetric drill pipe buckling off-center prevented the shear blades from closing completely.',
    investigatorRole: 'Subsea Blowout Preventer Forensic Investigator',
    primaryObjective: 'Analyze negative pressure tests and hydraulic schematics to pinpoint the moment the pipe moved off-center.'
  },
  {
    id: 'alaska-air-261-jackscrew',
    universeId: 'machine-world',
    title: 'The Stripped Acme Thread',
    subtitle: 'Acrobatic horizontal stabilizer trim failure and dry lubrication degradation',
    domain: 'Machine World',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on NTSB Report AAR-02/01.',
    difficulty: 'Advanced',
    duration: '15 min',
    featured: false,
    playable: false,
    year: '2000',
    location: 'Pacific Ocean off Anacapa Island, California',
    summary: 'The catastrophic failure of an MD-83 horizontal stabilizer trim system caused by improper lubrication intervals on the acme nut and jackscrew assembly, leading to complete thread stripping.',
    investigatorRole: 'NTSB Airframe & Systems Metallurgy Specialist',
    primaryObjective: 'Evaluate maintenance grease sampling intervals and backlash measurements to detect impending thread tear-out.'
  },
  {
    id: 'chernobyl-unit-4-runaway',
    universeId: 'machine-world',
    title: 'The Positive Void Coefficient',
    subtitle: 'RBMK-1000 turbine rundown test and xenon poisoning dynamics',
    domain: 'Machine World',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical case study from IAEA INSAG-7.',
    difficulty: 'Master',
    duration: '30 min',
    featured: false,
    playable: false,
    year: '1986',
    location: 'Chernobyl Nuclear Power Plant, Pripyat, Ukrainian SSR',
    summary: 'During a scheduled safety test of the turbine rundown generator, operators encountered xenon poisoning, disabled automatic scram systems, and inserted control rods whose graphite tips displaced water and triggered a prompt critical power surge.',
    investigatorRole: 'Nuclear Core Reactivity Oversight Officer',
    primaryObjective: 'Evaluate operational reactivity margin (ORM) calculations and refuse the unauthorized test continuation.'
  },

  // ==========================================
  // UNIVERSE 02: DIGITAL UNDERWORLD
  // ==========================================
  {
    id: 'the-ghost-in-the-wire',
    universeId: 'digital-underworld',
    title: 'The Ghost in the Wire',
    subtitle: 'Covert Active Directory Kerberoasting and Kerberos ticket exfiltration under live SOC siege',
    domain: 'Digital Underworld',
    status: 'SIMULATED DEMO',
    statusNote: 'High-fidelity simulation created from real enterprise incident response engagements.',
    difficulty: 'Advanced',
    duration: '15 min',
    featured: true,
    playable: true,
    year: '2024',
    location: 'Metropolitan Financial Clearinghouse, Zurich Node',
    summary: 'At 02:14 AM on a holiday weekend, an unusual spike in Kerberos TGS (Ticket Granting Service) requests targets high-privilege service accounts in an air-gapped SWIFT processing network. The adversary is using living-off-the-land techniques (PowerShell, WMI) with zero malware binaries detected by antivirus.',
    investigatorRole: 'Chief Incident Response Commander',
    primaryObjective: 'Isolate compromised domain controllers without triggering adversary dead-man ransomware wipes or breaking $4.2B in overnight settlements.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'ANOMALOUS KERBEROS REQUEST BURST',
        timestamp: '02:14 AM',
        systemStatus: 'Yellow Alert (SOC Night Shift)',
        context: 'SIEM logs flag 412 Kerberos TGS-REQ packets generated in under 8 seconds from workstation WS-FIN-0892, requesting RC4-encrypted service tickets for MSSQL and Backup Admin service principal names (SPNs).',
        dilemma: 'WS-FIN-0892 belongs to a senior clearing analyst currently on approved leave in Japan. If you disconnect the workstation, the adversary may realize they are detected and trigger an immediate data destruction script.',
        evidenceList: [
          {
            id: 'ev-dig-1',
            title: 'Windows Event ID 4769 Audit Trail',
            type: 'log',
            category: 'SIEM Logs',
            value: 'Ticket Options: 0x40810010 | Encryption: 0x17 (RC4-HMAC) | Service: krbtgt/FINCORP',
            significance: 'RC4 encryption on a modern AES-256 domain indicates Kerberoasting attack aimed at offline cracking.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-dig-2',
            title: 'Analyst Travel Manifest & VPN Concentrator Logs',
            type: 'document',
            category: 'Identity',
            value: 'VPN session authenticated via wireguard from an IP in Osaka; no second factor prompt logged in Okta.',
            significance: 'Session token theft / adversary-in-the-middle proxy bypassed MFA entirely.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Adversary has initiated Kerberoasting. What is your containment posture?',
        decisionOptions: [
          {
            id: 'opt-dig-1a',
            label: 'Silent Honeytoken Infiltration & Network Micro-segmentation',
            description: 'Silently deploy a synthetic honey-SPN account that triggers immediate forensic memory capture if cracked, while isolating WS-FIN-0892 via VLAN redirect.',
            riskScore: 'Tactical Deception & Trace'
          },
          {
            id: 'opt-dig-1b',
            label: 'Instant Global Domain Admin Password Reset & Full Network Sever',
            description: 'Pull network fiber from the primary datacenter and force reset of 80,000 corporate credentials immediately.',
            riskScore: 'Severe Global Disruption / High Collateral Cost'
          }
        ],
        expertActionTaken: 'opt-dig-1a',
        expertReasoning: 'Premature mass disconnection tips off sophisticated threat actors (APT), who routinely deploy wiper malware if cut off abruptly. Controlled isolation allowed the defenders to trap the adversary memory space and recover the C2 IP list.',
        historicalEventUnlocked: 'The adversary fell for the honey-SPN trap, attempting to authenticate to an isolated sinkhole at 02:29 AM.'
      },
      {
        stageNumber: 2,
        stageName: 'LATERAL PIVOT & DOMAIN CONTROLLER DC-01 SIEGE',
        timestamp: '02:41 AM',
        systemStatus: 'Orange Alert (Privilege Escalation)',
        context: 'At 02:41 AM, the honey-SPN trap triggers an immediate telemetry hit. However, before the network tap isolates WS-FIN-0892 completely, the adversary initiates lateral movement to primary Domain Controller DC-01 using pass-the-hash via SMB Port 445.',
        dilemma: 'The adversary has acquired local administrator rights on DC-01. They are attempting to invoke the DCSync attack (GetNCChanges) to dump the NTDS.dit database containing all enterprise hashes.',
        evidenceList: [
          {
            id: 'ev-dig-3',
            title: 'Directory Service Replication RPC Stream (Port 135/445)',
            type: 'log',
            category: 'Network Forensics',
            value: 'DSGetNCChanges request initiated from non-domain controller IP address 10.14.8.42',
            significance: 'Smoking gun: Non-domain controller executing directory replication indicates an active DCSync attack in progress.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-dig-4',
            title: 'Active Directory Admin Count Property Audit',
            type: 'document',
            category: 'Directory Security',
            value: 'AdminCount attribute toggled to 1 on service account svc_backup_engine at 02:39 AM.',
            significance: 'Adversary modified SDProp access control to persist domain dominance even if original user account is revoked.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Adversary is executing DCSync on DC-01. What is your containment directive?',
        decisionOptions: [
          {
            id: 'opt-dig-2a',
            label: 'Execute Double KRBTGT Password Reset & Demote DC-01',
            description: 'Invalidate all existing Kerberos tickets across the global forest twice with a 10-minute spacing to purge golden tickets, while demoting DC-01 from replication topology.',
            riskScore: 'Engineered Privilege Annihilation'
          },
          {
            id: 'opt-dig-2b',
            label: 'Restart DC-01 in Safe Mode & Hope Memory Clears',
            description: 'Trigger remote reboot of DC-01. Fast, but loses volatile memory forensic artifacts and does not invalidate forged golden tickets.',
            riskScore: 'High Risk / Tactical Failure'
          }
        ],
        expertActionTaken: 'opt-dig-2a',
        expertReasoning: 'A reboot does not purge forged Kerberos golden tickets because the KRBTGT hash remains valid in Active Directory. The double KRBTGT password rotation completely invalidated the adversary golden tickets and locked them out permanently.',
        historicalEventUnlocked: 'At 02:55 AM, the double KRBTGT reset severed all forged adversary session tickets. The intrusion was neutralized without data loss.'
      },
      {
        stageNumber: 3,
        stageName: 'FORENSIC REMEDIATION & EXFILTRATION AUDIT',
        timestamp: '03:30 AM',
        systemStatus: 'Contained & Stabilized (Post-Incident)',
        context: 'The network perimeter is secured. Threat intelligence analysts extract memory artifacts from the isolated sandbox to verify whether customer financial records were exfiltrated before containment.',
        dilemma: 'Regulatory authorities require formal declaration within 72 hours under GDPR and FINMA mandates. Management must confirm whether to declare a catastrophic breach or a neutralized near-miss.',
        evidenceList: [
          {
            id: 'ev-dig-5',
            title: 'NetFlow Outbound Egress Packet Analysis',
            type: 'log',
            category: 'Firewall Telemetry',
            value: 'Total outbound encrypted egress during attack window: 842 KB (command & control heartbeat only). Zero GB bulk data dumps.',
            significance: 'Definitive confirmation: Containment occurred before the adversary could stage or exfiltrate the 40GB SWIFT transaction database.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Final Regulatory & Forensic Filing: What is your audit declaration?',
        decisionOptions: [
          {
            id: 'opt-dig-3a',
            label: 'Certify Neutralized Near-Miss with Full Forensic Memory Evidence',
            description: 'Submit verified telemetry and packet captures proving zero exfiltration occurred, while implementing mandatory FIDO2 hardware tokens.',
            riskScore: 'Transparent Regulatory Compliance'
          },
          {
            id: 'opt-dig-3b',
            label: 'Cover Up the Intrusion Citing Internal Firewall Maintenance',
            description: 'Avoid regulatory scrutiny by classifying the event as routine IT maintenance.',
            riskScore: 'Extreme Criminal & Regulatory Liability'
          }
        ],
        expertActionTaken: 'opt-dig-3a',
        expertReasoning: 'Regulators reward rapid containment backed by tamper-evident forensic NetFlow records. Concealing an incident invites devastating regulatory fines and executive prosecution.',
        historicalEventUnlocked: 'FINMA auditors commended the rapid containment. The clearinghouse preserved its banking operating charter.'
      }
    ],

    // Evidence Passport
    evidencePassport: {
      source: 'Fintech Threat Intelligence Benchmark #DF-02',
      sourceType: 'Synthetic High-Fidelity Simulation',
      verifiedBy: 'MNEME Cybersecurity Incident Working Group',
      lastReviewed: '2024-11-02',
      confidenceRating: 'High Fidelity (Simulated)',
      publicDisclosure: 'Modeled after real-world Kerberoasting attacks documented in banking CERT incident post-mortems.',
      chainOfCustody: 'Derived from MITRE ATT&CK T1558.003 telemetry benchmarks and Active Directory forensic response playbooks.'
    },

    // Multiverse Branches
    multiverseBranches: [
      {
        id: 'branch-dig-1',
        choicePoint: 'Decision 1 (02:14 AM) — If Investigator Chose Option B (Immediate Mass Fiber Pull)',
        scenarioLabel: 'SIMULATED SCENARIO',
        title: 'The Dead-Man Ransomware Trigger',
        probability: '88% likelihood under APT playbook modeling',
        outcomeSummary: 'The adversary automated dead-man script detects sudden connection loss to the C2 server. A dormant wiper script executes locally on WS-FIN-0892 and adjacent file servers, encrypting 14,000 backup records and costing $18.4M in recovery operations.',
        impactMetrics: {
          cost: '-$18,400,000',
          safety: 'Zero Physical Risk',
          downtime: '14 Days',
          reputation: 'Severe Brand & Regulatory Damage'
        }
      },
      {
        id: 'branch-dig-2',
        choicePoint: 'Decision 2 (02:41 AM) — If Investigator Chose Option B (Safe Mode Reboot Only)',
        scenarioLabel: 'SIMULATED SCENARIO',
        title: 'The Golden Ticket Shadow Reign',
        probability: '94% likelihood',
        outcomeSummary: 'Because the KRBTGT hash was not rotated, the adversary used their forged Golden Ticket to re-authenticate 4 hours later from a secondary foothold, successfully transferring $4.2M in fraudulent SWIFT transactions.',
        impactMetrics: {
          cost: '-$4,200,000',
          safety: 'Zero Physical Risk',
          downtime: '5 Days',
          reputation: 'Critical Regulatory Sanctions'
        }
      }
    ]
  },
  {
    id: 'solarwinds-orion-sunburst',
    universeId: 'digital-underworld',
    title: 'The Compromised Compiler',
    subtitle: 'Supply chain injection of the SUNBURST backdoor via infected MSBuild process',
    domain: 'Digital Underworld',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical analysis of the 2020 SolarWinds supply chain breach.',
    difficulty: 'Master',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '2020',
    location: 'Global Enterprise & Federal Networks',
    summary: 'A sophisticated state-sponsored threat group compromised SolarWinds build pipelines, injecting malicious C# source code during compilation into legitimate digitally signed Orion software updates distributed to 18,000 organizations.',
    investigatorRole: 'Threat Intelligence & Reverse Engineering Director',
    primaryObjective: 'Analyze memory dumps of SolarWinds.Orion.Core.BusinessLayer.dll and detect DGA (Domain Generation Algorithm) DNS tunneling.'
  },
  {
    id: 'equifax-apache-struts',
    universeId: 'digital-underworld',
    title: 'The Unpatched Header',
    subtitle: 'Exploitation of CVE-2017-5638 in customer dispute portal and exfiltration of 147M credit files',
    domain: 'Digital Underworld',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on the US House Committee on Oversight and Government Reform.',
    difficulty: 'Advanced',
    duration: '18 min',
    featured: false,
    playable: false,
    year: '2017',
    location: 'Atlanta, Georgia, USA',
    summary: 'An unpatched Apache Struts vulnerability in an online dispute portal remained exposed for over 70 days despite security bulletins. A missing TLS inspection certificate prevented IDS from detecting outbound encrypted data dumps.',
    investigatorRole: 'Chief Information Security Officer',
    primaryObjective: 'Audit public-facing IP asset registers and establish real-time certificate management on core network inspection mirrors.'
  },
  {
    id: 'colonial-pipeline-darkside',
    universeId: 'digital-underworld',
    title: 'The Orphaned VPN Account',
    subtitle: 'Single compromised legacy password leading to 5,500-mile fuel pipeline shutdown',
    domain: 'Digital Underworld',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on US Senate Homeland Security testimonies.',
    difficulty: 'Intermediate',
    duration: '14 min',
    featured: false,
    playable: false,
    year: '2021',
    location: 'Alpharetta, Georgia, USA',
    summary: 'DarkSide ransomware gained entry via a single decommissioned VPN account that lacked multi-factor authentication. While operational technology (OT) pipelines were untouched, billing software paralysis led executives to halt fuel transmission.',
    investigatorRole: 'Critical Infrastructure Cyber Incident Lead',
    primaryObjective: 'Determine OT/IT network boundary separation and evaluate safe manual pipeline bypass procedures.'
  },
  {
    id: 'notpetya-eternalblue-cascade',
    universeId: 'digital-underworld',
    title: 'The Pseudo-Ransomware Wiper',
    subtitle: 'Weaponized M.E.Doc accounting software update wiping Maersk, Merck, and Ukrainian critical infrastructure',
    domain: 'Digital Underworld',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical analysis from global shipping and cybersecurity post-mortems.',
    difficulty: 'Master',
    duration: '25 min',
    featured: false,
    playable: false,
    year: '2017',
    location: 'Kyiv, Ukraine & Global Corporate Networks',
    summary: 'Disguised as ransomware, NotPetya utilized EternalBlue and PsExec to recursively erase master boot records (MBRs) with irreversible encryption keys, destroying $10B in global corporate IT infrastructure in 7 hours.',
    investigatorRole: 'Global Disaster Recovery Chief Architect',
    primaryObjective: 'Find the lone surviving domain controller in an offline Ghana facility to rebuild the global Active Directory.'
  },

  // ==========================================
  // UNIVERSE 03: CRISIS ROOM
  // ==========================================
  {
    id: 'midnight-cascade',
    universeId: 'crisis-room',
    title: 'Midnight Cascade',
    subtitle: 'Estuary sluice gate sensor desynchronization during a Category 4 tidal surge',
    domain: 'Crisis Room',
    status: 'SIMULATED DEMO',
    statusNote: 'Simulated civil defense emergency scenario based on Dutch and Thames barrier surge protocols.',
    difficulty: 'Advanced',
    duration: '14 min',
    featured: true,
    playable: true,
    year: '2025',
    location: 'Lowland Delta Flood Barrier System, Sector 9',
    summary: 'At 01:45 AM during peak high tide and gale-force storm winds, telemetry from upstream ultrasonic level sensors disagrees with downstream hydrostatic sensors by 1.8 meters. Dropping the barrier prematurely traps 14 chemical cargo barges in the navigational canal; waiting 20 minutes risks breaching flood walls protecting 350,000 residents.',
    investigatorRole: 'Hydrological Barrier Operations Director',
    primaryObjective: 'Reconcile conflicting sensor physics under rapid storm surge and order barrier actuation before crest threshold.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'THE SENSOR DIVERGENCE',
        timestamp: '01:45 AM',
        systemStatus: 'Storm Condition Red',
        context: 'Downstream Sensor DS-4 reads water level at +4.6m NAP (approaching crest danger). Upstream Sensor US-2 reads only +2.8m NAP. Rain squalls have blinded visual webcam feeds.',
        dilemma: 'If the barrier is closed now, three 2,000-ton cargo barges caught in the transit bottleneck will slam into the concrete sector gates. If the barrier is not closed by 02:05 AM, salt water overspills the primary dike.',
        evidenceList: [
          {
            id: 'ev-cr-1',
            title: 'Downstream Radar Level Telemetry vs Tidal Predictions',
            type: 'sensor',
            category: 'Hydrology',
            value: 'DS-4 water rise rate = 0.12m per 5 min. Barometric pressure = 952 hPa.',
            significance: 'The extreme low barometric pressure creates an inverted barometer effect adding 45cm to the tidal crest.',
            isClue: true,
            discovered: false
          },
          {
            id: 'ev-cr-2',
            title: 'Canal Harbourmaster VHF Radio Audio Intercept',
            type: 'audio',
            category: 'Comms',
            value: 'Barge Captain 2: "Engine stalled in channel, drifting sideways toward Pier 4!"',
            significance: 'Barge is no longer under steerage; barrier descent will smash the vessel and rupture fuel tanks.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Water is rising at 01:45 AM with a dead ship in the channel. What is your command?',
        decisionOptions: [
          {
            id: 'opt-cr-1a',
            label: 'Order Emergency Tug Push & Initiate Slow 10-Minute Hydraulic Drop',
            description: 'Scramble emergency harbor tug to push drifting barge onto sandbank while lowering gate at half-speed with acoustic warning sirens.',
            riskScore: 'High Precision / Balanced Risk'
          },
          {
            id: 'opt-cr-1b',
            label: 'Keep Barrier Open Until Barges Clear (Delay to 02:15 AM)',
            description: 'Prioritize vessel safety, hoping the sea surge stalls before 02:15 AM.',
            riskScore: 'Catastrophic Flood Risk for 350,000 Citizens'
          }
        ],
        expertActionTaken: 'opt-cr-1a',
        expertReasoning: 'Civil protection doctrine mandates that human life in the flood basin takes absolute precedence over channel infrastructure, but sacrificial beaching of the unsteered barge on the shallow mudbank prevented gate collision while preserving the closure timeline.',
        historicalEventUnlocked: 'The tug beached the barge with minor hull scraping. The flood gate completed lock at 02:04 AM, 60 seconds before sea water reached the dike lip.'
      }
    ]
  },
  {
    id: 'apollo-13-oxygen-tank',
    universeId: 'crisis-room',
    title: 'The Switched Thermostat',
    subtitle: 'Supercritical oxygen tank stir explosion and lunar module lifeboat conversion',
    domain: 'Crisis Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical analysis from NASA Apollo 13 Review Board.',
    difficulty: 'Expert',
    duration: '25 min',
    featured: false,
    playable: false,
    year: '1970',
    location: 'Trans-Lunar Space (321,860 km from Earth)',
    summary: 'A spark from an uninsulated wire inside Cryogenic Oxygen Tank #2 ignited a Teflon fire that ruptured the tank and stripped oxygen from the fuel cells. Flight director Gene Kranz and team improvised carbon dioxide scrubbers and battery power budgets to return three astronauts safely.',
    investigatorRole: 'NASA Flight Operations Director',
    primaryObjective: 'Synthesize custom lithium hydroxide canister adapters using plastic bags, cardboard, and grey tape to prevent crew hypercapnia.'
  },
  {
    id: 'fukushima-daiichi-station-blackout',
    universeId: 'crisis-room',
    title: 'The Drowned Diesels',
    subtitle: '15-meter tsunami inundation, total station blackout (SBO), and sea-water injection dilemma',
    domain: 'Crisis Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on the National Diet of Japan Fukushima Nuclear Accident Independent Investigation Commission.',
    difficulty: 'Master',
    duration: '28 min',
    featured: false,
    playable: false,
    year: '2011',
    location: 'Okuma, Fukushima Prefecture, Japan',
    summary: 'A magnitude 9.0 earthquake followed by a 14-meter tsunami overtopped coastal seawalls, flooding basement backup diesel generators and stripping AC power needed to circulate cooling water through three operational reactor cores.',
    investigatorRole: 'Nuclear Plant Site Superintendent',
    primaryObjective: 'Improvise car battery hookups to read core depressurization valves and order seawater injection despite corporate resistance.'
  },
  {
    id: 'thai-cave-rescue-wild-boars',
    universeId: 'crisis-room',
    title: 'The Flooded Siphon',
    subtitle: 'Ketamine anesthesia and extreme cave dive extraction through 2.5 miles of submerged limestone',
    domain: 'Crisis Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on British Cave Rescue Council logs and medical journals.',
    difficulty: 'Expert',
    duration: '20 min',
    featured: false,
    playable: false,
    year: '2018',
    location: 'Tham Luang Nang Non cave system, Chiang Rai, Thailand',
    summary: 'Twelve boys and their football coach were trapped deep inside a flooded cave with monsoon rains rising. Rescuers made the radical decision to fully anesthetize the children with ketamine and swim them through zero-visibility submerged restrictions.',
    investigatorRole: 'Cave Rescue Medical & Logistics Commander',
    primaryObjective: 'Calculate anesthetic dosing curves to ensure zero panic during a 3-hour underwater dive tow.'
  },
  {
    id: 'miracle-on-the-hudson',
    universeId: 'crisis-room',
    title: 'The Dual Engine Bird Strike',
    subtitle: '208 seconds from Canada goose ingestion to dead-stick Hudson River ditching',
    domain: 'Crisis Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on NTSB Report AAR-10/03.',
    difficulty: 'Advanced',
    duration: '16 min',
    featured: false,
    playable: false,
    year: '2009',
    location: 'Hudson River, New York City, USA',
    summary: 'US Airways Flight 1549 struck a flock of Canada geese at 2,800 feet, losing both CFM56 engines. Captain Sullenberger rapidly determined that attempting return to LaGuardia or Teterboro would cause catastrophic impact in populated neighborhoods.',
    investigatorRole: 'Pilot-in-Command (Captain)',
    primaryObjective: 'Identify that airspeed and altitude energy curves mathematically rule out runway return and execute water touchdown with wings level.'
  },

  // ==========================================
  // UNIVERSE 04: BUSINESS WAR ROOM
  // ==========================================
  {
    id: 'the-vanishing-liquidity',
    universeId: 'business-war-room',
    title: 'The Vanishing Liquidity',
    subtitle: 'Foreign exchange settlement freeze and predatory short assault on fintech reserve fund',
    domain: 'Business War Room',
    status: 'SIMULATED DEMO',
    statusNote: 'Simulated corporate crisis based on the SVB bank run and crypto collateral liquidation spirals.',
    difficulty: 'Advanced',
    duration: '16 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'Fintech Exchange Headquarters, Singapore',
    summary: 'Over 48 hours, an offshore sovereign currency devaluation triggers an automated margin call against your firm’s $1.2B repo portfolio. Twitter rumors claim insolvency, sparking $340M in customer withdrawals per hour.',
    investigatorRole: 'Chief Financial Officer & Risk Commander',
    primaryObjective: 'Secure emergency liquidity bridging without triggering dilution panic or regulatory seizure.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'THE TWITTER RUMOR & RUN',
        timestamp: '09:15 AM',
        systemStatus: 'High Withdrawal Velocity',
        context: 'Customer redemption queue reaches $280M. Primary custodian bank delays wire settlements pending risk review.',
        dilemma: 'Selling held-to-maturity government bonds will crystalize a $60M loss; halting withdrawals will cause instant regulatory suspension.',
        evidenceList: [
          {
            id: 'ev-bwr-1',
            title: 'Real-time Treasury Liquidity Ledger',
            type: 'ledger',
            category: 'Finance',
            value: 'Available Unencumbered Cash: $140M | Pending Outflow Queue: $280M',
            significance: 'Cash exhaustion in 38 minutes at current withdrawal slope.',
            isClue: true,
            discovered: false
          }
        ],
        decisionPrompt: 'Your cash runout clock is 38 minutes. What is your executive move?',
        decisionOptions: [
          {
            id: 'opt-bwr-1a',
            label: 'Execute Emergency Private Placement Term Sheet & Announce Consortium Backing',
            description: 'Accept dilutive terms from tier-1 sovereign fund to immediately publish a joint verified solvency guarantee.',
            riskScore: 'Equity Dilution / Immediate Solvency Restored'
          },
          {
            id: 'opt-bwr-1b',
            label: 'Freeze All Redemptions Citing Anti-Money Laundering Protocols',
            description: 'Buy time with compliance excuses while seeking behind-the-scenes loans.',
            riskScore: 'Fatal Loss of Customer Trust'
          }
        ],
        expertActionTaken: 'opt-bwr-1a',
        expertReasoning: 'In a bank run, perception is reality. A 20% equity dilution is vastly preferable to an uncontrolled insolvency receivership.',
        historicalEventUnlocked: 'Consortium funding stemmed the run by 11:30 AM.'
      }
    ]
  },
  {
    id: 'svb-social-media-bank-run',
    universeId: 'business-war-room',
    title: 'The $42 Billion In 10 Hours',
    subtitle: 'Venture capital WhatsApp cascades and unhedged bond duration mismatch',
    domain: 'Business War Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on Federal Reserve Review of the Supervision and Regulation of Silicon Valley Bank.',
    difficulty: 'Advanced',
    duration: '18 min',
    featured: false,
    playable: false,
    year: '2023',
    location: 'Santa Clara, California, USA',
    summary: 'Silicon Valley Bank suffered the fastest bank run in modern financial history after depositors withdrew $42 billion in a single day, coordinated by venture capital group chats after an unexpected capital raise announcement.',
    investigatorRole: 'Treasury Risk Committee Chair',
    primaryObjective: 'Assess interest rate risk on mortgage-backed securities held-to-maturity and restructure communications strategy.'
  },
  {
    id: 'theranos-edison-whistleblower',
    universeId: 'business-war-room',
    title: 'The Hidden Siemens Machines',
    subtitle: 'Fictional micro-fluidics, altered quality control assays, and regulatory fraud',
    domain: 'Business War Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study from SEC and DOJ court trial transcripts (US v. Holmes).',
    difficulty: 'Intermediate',
    duration: '15 min',
    featured: false,
    playable: false,
    year: '2015',
    location: 'Palo Alto, California, USA',
    summary: 'A health-tech unicorn claimed to run hundreds of blood tests from a fingertip pricked with its Edison device, while secretly diluting patient samples and testing them on commercially modified third-party Siemens analyzers.',
    investigatorRole: 'Senior Lab Associate & Ethics Whistleblower',
    primaryObjective: 'Examine proficiency testing tampering records and file a protected report with CMS regulators.'
  },
  {
    id: 'tylenol-tampering-recall-1982',
    universeId: 'business-war-room',
    title: 'The 31-Million Bottle Recall',
    subtitle: 'Cyanide adulteration and the birth of modern tamper-evident consumer packaging',
    domain: 'Business War Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical business case study (Harvard Business School Case 9-584-047).',
    difficulty: 'Advanced',
    duration: '14 min',
    featured: false,
    playable: false,
    year: '1982',
    location: 'Chicago, Illinois & New Brunswick, New Jersey',
    summary: 'When seven people in Chicago died from cyanide-laced Tylenol capsules, Johnson & Johnson CEO James Burke overruled advisors and launched an immediate nationwide recall of 31 million bottles worth $100M, establishing the gold standard of corporate crisis response.',
    investigatorRole: 'CEO & Chief Executive Crisis Committee',
    primaryObjective: 'Prioritize consumer life over quarterly profitability and design tamper-evident triple seals.'
  },
  {
    id: 'volkswagen-dieselgate-defeat',
    universeId: 'business-war-room',
    title: 'The Defeat Device Algorithm',
    subtitle: 'Engine ECU test-cycle detection and systemic corporate emissions evasion',
    domain: 'Business War Room',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on EPA Notice of Violation & West Virginia University ICCT Study.',
    difficulty: 'Expert',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '2015',
    location: 'Wolfsburg, Germany & El Monte, California',
    summary: 'Volkswagen programmed software in 11 million turbocharged direct injection (TDI) diesel engines to sense laboratory dynamometer test conditions (steering wheel angle, vehicle speed) and activate emissions controls only during regulatory testing.',
    investigatorRole: 'EPA Certification Compliance Auditor',
    primaryObjective: 'Correlate real-world PEMS (Portable Emissions Measurement System) road data with dyno results to expose software cheating.'
  },

  // ==========================================
  // UNIVERSE 05: HUMAN HEALTH
  // ==========================================
  {
    id: 'therac-25-race-condition',
    universeId: 'human-health',
    title: 'The 8-Bit Overflow Fatal Dose',
    subtitle: 'Software race condition and missing hardware interlocks on medical linear accelerator',
    domain: 'Human Health',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical case study from Prof. Nancy Leveson (Medical Devices Computer Safety).',
    difficulty: 'Expert',
    duration: '24 min',
    featured: false,
    playable: false,
    year: '1985-1987',
    location: 'Tyler, Texas & Marietta, Georgia, USA',
    summary: 'A radiation therapy machine administered lethal radiation overdoses (over 100x intended dosage) to six cancer patients due to a subtle race condition in PDP-11 assembly code that occurred only when experienced operators edited fields in under 8 seconds.',
    investigatorRole: 'Biomedical Systems & Safety Verification Engineer',
    primaryObjective: 'Trace the software counter overflow variable and re-install independent electromechanical hardware interlocks.'
  },
  {
    id: 'the-errant-infusion',
    universeId: 'human-health',
    title: 'The Errant Infusion',
    subtitle: 'Smart pump drug library bypass during critical pediatric resuscitation',
    domain: 'Human Health',
    status: 'SIMULATED DEMO',
    statusNote: 'Clinical simulation designed to teach human factors engineering in intensive care units.',
    difficulty: 'Advanced',
    duration: '15 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'St. Jude Children’s Emergency Wing, Bay 3',
    summary: 'During rapid sequence intubation of a 6-year-old in septic shock, two infusion pumps are loaded with vasoactive medications. In the rush, a nurse selects standard mL/hr instead of mcg/kg/min, setting a ten-fold epinephrine overdose rate.',
    investigatorRole: 'Lead Pediatric Intensive Care Attending',
    primaryObjective: 'Identify the pharmacological rate discrepancy before hemodynamic crisis triggers ventricular arrhythmia.'
  },
  {
    id: 'elaine-bromiley-airway-crisis',
    universeId: 'human-health',
    title: 'The Unclosed Airway',
    subtitle: 'Cannot Intubate Cannot Oxygenate (CICO) cognitive fixation and lost surgical airway window',
    domain: 'Human Health',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on the Clinical Human Factors Group (CHFG) landmark report.',
    difficulty: 'Advanced',
    duration: '17 min',
    featured: false,
    playable: false,
    year: '2005',
    location: 'Wiltshire, United Kingdom',
    summary: 'A routine sinus surgery became fatal when the patient’s airway could not be intubated or ventilated. Two experienced anesthetists became cognitively fixated on repeated failed intubation attempts for 35 minutes while nurses holding surgical tracheostomy equipment hesitated to challenge the consultants.',
    investigatorRole: 'Operating Room Human Factors Observer',
    primaryObjective: 'Recognize CICO cognitive tunneling and declare emergency surgical cricothyroidotomy at 5 minutes.'
  },
  {
    id: 'contaminated-heparin-crisis',
    universeId: 'human-health',
    title: 'The Sulfated Glycosaminoglycan',
    subtitle: 'Counterfeit raw ingredient supply chain contamination causing anaphylactic deaths in dialysis patients',
    domain: 'Human Health',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on FDA and CDC epidemiological investigation.',
    difficulty: 'Master',
    duration: '20 min',
    featured: false,
    playable: false,
    year: '2008',
    location: 'Global Dialysis Clinics & FDA Laboratories',
    summary: 'Hundreds of dialysis patients experienced sudden life-threatening allergic reactions. Forensic chemists discovered that raw pig intestine heparin supply from small overseas slaughterhouses had been adulterated with oversulfated chondroitin sulfate (OSCS) to pass crude identity tests.',
    investigatorRole: 'FDA Senior Analytical Chemist',
    primaryObjective: 'Employ proton NMR spectroscopy and capillary electrophoresis to detect counterfeit chemical adulteration.'
  },
  {
    id: 'bristol-royal-infirmary-cardiac',
    universeId: 'human-health',
    title: 'The Untracked Mortality Curve',
    subtitle: 'Institutional silence and pediatric cardiac surgery mortality discrepancies',
    domain: 'Human Health',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on The Bristol Royal Infirmary Public Inquiry (Kennedy Report).',
    difficulty: 'Expert',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '1995',
    location: 'Bristol, United Kingdom',
    summary: 'Pediatric cardiac surgery at a prestigious hospital had a mortality rate more than double other UK centers for years. Whistleblower Dr. Stephen Bolsin faced ostracization before a public inquiry revolutionized clinical governance and transparent surgical audit data.',
    investigatorRole: 'Clinical Governance Audit Specialist',
    primaryObjective: 'Construct risk-adjusted CUSUM (cumulative sum) charts to identify anomalous surgical mortality trends.'
  },

  // ==========================================
  // UNIVERSE 06: EARTH & SURVIVAL
  // ==========================================
  {
    id: 'shackleton-endurance-crush',
    universeId: 'earth-survival',
    title: 'The Imperial Trans-Antarctic Ice Trap',
    subtitle: 'Loss of the Endurance and 800-mile open boat navigation across the Southern Ocean',
    domain: 'Earth & Survival',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented historical expedition survival based on logs of Frank Worsley and Ernest Shackleton.',
    difficulty: 'Master',
    duration: '26 min',
    featured: false,
    playable: false,
    year: '1915-1916',
    location: 'Weddell Sea & Elephant Island to South Georgia',
    summary: 'When the polar ship Endurance was crushed by pack ice, Shackleton kept 28 men alive on drifting ice floes for months before navigating the 22-foot lifeboat James Caird through hurricane seas using only four dead-reckoning sextant sun sightings to reach South Georgia.',
    investigatorRole: 'Expedition Navigator (Frank Worsley)',
    primaryObjective: 'Calculate compass declination and sextant wave horizons to avoid missing a 20-mile island in a 1,000-mile ocean.'
  },
  {
    id: 'aral-sea-desiccation-audit',
    universeId: 'earth-survival',
    title: 'The Vanishing Inland Ocean',
    subtitle: 'Soviet cotton irrigation diversion and toxic dust salt storm eco-collapse',
    domain: 'Earth & Survival',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public ecological research case study from UNEP.',
    difficulty: 'Advanced',
    duration: '18 min',
    featured: false,
    playable: false,
    year: '1960-2010',
    location: 'Aral Sea Basin (Kazakhstan / Uzbekistan)',
    summary: 'The diversion of the Amu Darya and Syr Darya rivers for intensive cotton mono-culture reduced the world’s fourth-largest lake by 90%, leaving a toxic seabed of agricultural pesticides that created respiratory health crises across Central Asia.',
    investigatorRole: 'Senior Hydrologist & Ecological Economist',
    primaryObjective: 'Model water balance inflow vs evaporation to prove downstream ecological death will ruin regional agriculture.'
  },
  {
    id: 'cape-town-day-zero-water',
    universeId: 'earth-survival',
    title: 'The Countdown to Dry Taps',
    subtitle: 'Severe 3-year drought and emergency municipal demand destruction to avert Day Zero',
    domain: 'Earth & Survival',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public urban water management case study (City of Cape Town Water Directorate).',
    difficulty: 'Advanced',
    duration: '16 min',
    featured: false,
    playable: false,
    year: '2017-2018',
    location: 'Cape Town, South Africa',
    summary: 'Facing a catastrophic date when municipal water supplies would be turned off and 4 million citizens would queue at 200 military-guarded water points, city planners implemented aggressive tiered tariffs, pressure management, and 50L/day rationing to avoid collapse.',
    investigatorRole: 'Municipal Water Resilience Director',
    primaryObjective: 'Implement smart zone pressure reduction to cut non-revenue pipe leakage by 40% in 90 days.'
  },
  {
    id: 'the-dune-collapse-hazard',
    universeId: 'earth-survival',
    title: 'The Subsiding Aquifer',
    subtitle: 'Agricultural groundwater depletion triggering sudden sinkhole collapse across citrus valley',
    domain: 'Earth & Survival',
    status: 'SIMULATED DEMO',
    statusNote: 'Simulated geotechnical disaster based on California Central Valley overdraft patterns.',
    difficulty: 'Intermediate',
    duration: '12 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'San Joaquin Sub-basin Sector 14',
    summary: 'Over-pumping of deep aquifers causes 2 feet of land subsidence per year. A major irrigation aqueduct develops shear fractures, threatening to flood a nearby rail transit corridor.',
    investigatorRole: 'Geotechnical & Groundwater Hazard Specialist',
    primaryObjective: 'Coordinate groundwater injection wells and emergency canal bypass routing.'
  },
  {
    id: 'andes-flight-571-survival',
    universeId: 'earth-survival',
    title: 'The Glacier at 11,500 Feet',
    subtitle: '72 days in the high cordillera and the 10-day final alpine traverse',
    domain: 'Earth & Survival',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented historical case study based on passenger accounts (Parrado, Canessa).',
    difficulty: 'Master',
    duration: '25 min',
    featured: false,
    playable: false,
    year: '1972',
    location: 'Glaciar de las Lágrimas, Andes Mountains',
    summary: 'Survivors of an aircraft crash in freezing Andean terrain organized water melting, improvised insulation from aircraft seat cushions, and endured avalanche burial before two students completed an impossible winter trek across the continental divide without mountaineering equipment.',
    investigatorRole: 'Expedition Survival Strategist',
    primaryObjective: 'Fabricate sleeping bags from tail-section heater insulation and navigate towards Chilean western valleys.'
  },

  // ==========================================
  // UNIVERSE 07: UNEXPECTED JOURNEY
  // ==========================================
  {
    id: 'air-france-447-stall',
    universeId: 'unexpected-journey',
    title: 'The Frozen Pitot Probes',
    subtitle: 'Unreliable airspeed indication and high-altitude aerodynamic stall into the South Atlantic',
    domain: 'Unexpected Journey',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical case study from BEA France Final Report.',
    difficulty: 'Master',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '2009',
    location: 'Atlantic Ocean (Equatorial Intertropical Convergence Zone)',
    summary: 'Ice crystals temporarily clogged the pitot tubes of an Airbus A330 at 35,000 feet, disengaging the autopilot. In the confusion of contradictory alarms in turbulence and darkness, the pilot flying persistently pulled back on the side-stick, holding the aircraft in a full deep stall until ocean impact.',
    investigatorRole: 'Senior Airline Training & Human Factors Investigator',
    primaryObjective: 'Identify dual pitot icing and execute the standard memory item: pitch 5 degrees nose up and 85% thrust.'
  },
  {
    id: 'gimli-glider-fuel-exhaustion',
    universeId: 'unexpected-journey',
    title: 'The Metric Conversion Dead-Stick',
    subtitle: 'Pounds to kilograms calculation blunder and sideslip landing on abandoned drag racing strip',
    domain: 'Unexpected Journey',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical aviation case study from Transport Canada Report.',
    difficulty: 'Advanced',
    duration: '16 min',
    featured: false,
    playable: false,
    year: '1983',
    location: 'Gimli Industrial Park, Manitoba, Canada',
    summary: 'Air Canada Flight 143 ran completely out of fuel at 41,000 feet because ground crews converted fuel density using pounds per liter instead of kilograms per liter. Captain Bob Pearson used his glider pilot training to forward-slip the massive Boeing 767 onto an old military runway turned go-kart track with zero casualties.',
    investigatorRole: 'Flight Crew Pilot-in-Command',
    primaryObjective: 'Execute a cross-controlled forward slip to bleed altitude without flaps or operational engines.'
  },
  {
    id: 'ever-given-suez-blockage',
    universeId: 'unexpected-journey',
    title: 'The Bank Effect Pivot',
    subtitle: '400-meter container ship wedged across the Suez Canal and hydrodynamics of narrow waters',
    domain: 'Unexpected Journey',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public case study based on Suez Canal Authority & Panama Maritime Authority findings.',
    difficulty: 'Intermediate',
    duration: '15 min',
    featured: false,
    playable: false,
    year: '2021',
    location: 'Suez Canal (Kilometer 151), Egypt',
    summary: 'High desert crosswinds combined with the hydrodynamic "bank suction" and "squat" phenomenon caused the ultra-large container ship Ever Given to veer uncontrollably, grounding its bulbous bow in the eastern bank and freezing 12% of global trade for six days.',
    investigatorRole: 'Maritime Salvage Master (SMIT Salvage)',
    primaryObjective: 'Calculate high spring tide timing and high-capacity dredging to refloat the bulbous bow without hull rupture.'
  },
  {
    id: 'iceland-eyjafjallajokull-airspace',
    universeId: 'unexpected-journey',
    title: 'The Glassy Ash Cloud',
    subtitle: 'Volcanic glass melting in jet turbine combustors and Europe-wide airspace shutdown',
    domain: 'Unexpected Journey',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public aviation safety and atmospheric science case study.',
    difficulty: 'Advanced',
    duration: '18 min',
    featured: false,
    playable: false,
    year: '2010',
    location: 'Eyjafjallajökull volcano, Iceland & European Airspace',
    summary: 'The eruption of Eyjafjallajökull produced plumes of fine silica ash that could melt inside high-temperature jet engine combustion chambers and coat turbine blades with molten glass, shutting down air traffic for 10 million passengers over 8 days.',
    investigatorRole: 'Eurocontrol Airspace Management Executive',
    primaryObjective: 'Establish empirical ash concentration safety thresholds (mg/m³) to safely reopen airspace corridors.'
  },
  {
    id: 'the-sub-zero-diversion',
    universeId: 'unexpected-journey',
    title: 'The Sub-Zero Diversion',
    subtitle: 'Cargo fire warning at polar ETOPS point of safe return over Greenland ice sheet',
    domain: 'Unexpected Journey',
    status: 'SIMULATED DEMO',
    statusNote: 'Simulated high-latitude aviation dilemma created by commercial long-haul captains.',
    difficulty: 'Advanced',
    duration: '15 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'Arctic Polar Airspace (78° North)',
    summary: 'Twin-engine cargo transport experiences a forward cargo hold smoke alert at the exact equal-time-point between Thule Air Base and Keflavik. Thule reports surface temp -44°C and freezing fog; Keflavik is 2 hours further away through a heavy headwind.',
    investigatorRole: 'Polar Heavy Jet Captain',
    primaryObjective: 'Weigh extreme cold runway braking limits against cargo fire halon suppression hold time.'
  },

  // ==========================================
  // UNIVERSE 08: HUMAN FACTOR
  // ==========================================
  {
    id: 'tenerife-airport-disaster',
    universeId: 'human-factor',
    title: 'The Deadly Ambiguity: "We Are At Take-Off"',
    subtitle: 'Steep authority gradients, foggy non-standard radio phraseology, and 583 casualties',
    domain: 'Human Factor',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented landmark case study in Cockpit Resource Management (CRM), Spanish & Dutch Civil Aviation Authorities.',
    difficulty: 'Master',
    duration: '20 min',
    featured: false,
    playable: false,
    year: '1977',
    location: 'Los Rodeos Airport, Tenerife, Canary Islands',
    summary: 'Two Boeing 747s collided on a fog-bound runway when KLM’s senior captain initiated takeoff without explicit ATC clearance. The junior flight engineer hesitated to contradict his legendary instructor, and a simultaneous radio transmission produced a high-pitched squeal that blotted out the controller’s warning.',
    investigatorRole: 'Air Safety & Human Factors Authority',
    primaryObjective: 'Enforce standard read-back requirements and abolish captain authoritarian culture in multi-crew cockpits.'
  },
  {
    id: 'challenger-sts-51-l-o-ring',
    universeId: 'human-factor',
    title: 'The Groupthink at 29 Degrees',
    subtitle: 'Morton Thiokol engineering warnings silenced under NASA launch schedule pressure',
    domain: 'Human Factor',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public historical inquiry (Presidential Rogers Commission Report).',
    difficulty: 'Expert',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '1986',
    location: 'Kennedy Space Center, Florida, USA',
    summary: 'On the eve of launch, engineers pleaded with management to postpone because freezing temperatures would harden rubber O-rings in the solid rocket boosters. Managers asked the engineering VP to "take off his engineering hat and put on his management hat," clearing the launch.',
    investigatorRole: 'Solid Rocket Motor Lead Engineer (Bob Ebeling / Roger Boisjoly)',
    primaryObjective: 'Present clear historical launch temperature vs blow-by erosion charts to stop the launch.'
  },
  {
    id: 'columbia-sts-107-foam-strike',
    universeId: 'human-factor',
    title: 'The Normalization of Deviance',
    subtitle: 'Left wing carbon-carbon leading edge strike dismissed as routine maintenance nuisance',
    domain: 'Human Factor',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public inquiry (Columbia Accident Investigation Board Report).',
    difficulty: 'Expert',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '2003',
    location: 'Cape Canaveral & Texas Debris Field',
    summary: 'During ascent, a piece of insulating foam broke off the external tank and punched a hole in Columbia’s left wing. Because foam shedding had happened on prior flights without disaster, NASA Mission Management treated it as a known anomaly and rejected requests for spy satellite imagery of the wing.',
    investigatorRole: 'Mission Operations Debris Assessment Team Lead',
    primaryObjective: 'Overcome bureaucratic resistance to request National Reconnaissance Office (NRO) high-resolution spy imagery.'
  },
  {
    id: 'the-toxic-hierarchy-implosion',
    universeId: 'human-factor',
    title: 'The Silent Co-Pilot',
    subtitle: 'Critical instrument disagreement in micro-burst turbulence suppressed by punitive culture',
    domain: 'Human Factor',
    status: 'SIMULATED DEMO',
    statusNote: 'Cockpit resource management simulation benchmark #HF-08.',
    difficulty: 'Intermediate',
    duration: '12 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'Mountain Valley Regional Approach',
    summary: 'A seasoned captain ignores the ground proximity warning system (GPWS) callout "PULL UP", assuming it is a spurious terrain glitch. The first officer has documented proof of the mountain ridge ahead but fears career termination.',
    investigatorRole: 'First Officer (Co-Pilot)',
    primaryObjective: 'Execute the strict two-challenge rule and take dual control authority to avert controlled flight into terrain.'
  },
  {
    id: 'united-173-fuel-burnout',
    universeId: 'human-factor',
    title: 'The Burned-Out Indicator Bulb',
    subtitle: 'Fixation on a landing gear light while 189 passengers run out of fuel',
    domain: 'Human Factor',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented historical NTSB case study that directly led to modern CRM across global aviation.',
    difficulty: 'Advanced',
    duration: '15 min',
    featured: false,
    playable: false,
    year: '1978',
    location: 'Portland, Oregon, USA',
    summary: 'The flight crew held the DC-8 in a holding pattern for over an hour troubleshooting an ambiguous nose gear indicator light. The second officer repeatedly dropped subtle hints about remaining fuel, but never explicitly intervened before all four engines flamed out.',
    investigatorRole: 'Cockpit Resource Management Lead',
    primaryObjective: 'Establish assertive crew communication protocols to force captain attention to fuel exhaustion.'
  },

  // ==========================================
  // UNIVERSE 09: CREATOR'S MIND
  // ==========================================
  {
    id: 'citi-corp-center-structural-crisis',
    universeId: 'creators-mind',
    title: 'The Bolted Joints of Citigroup Center',
    subtitle: 'William LeMessurier’s discovery of catastrophic quartering wind vulnerability in 59-story tower',
    domain: "Creator's Mind",
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented landmark engineering ethics case study from The New Yorker and MIT Architecture.',
    difficulty: 'Expert',
    duration: '22 min',
    featured: false,
    playable: false,
    year: '1978',
    location: 'Manhattan, New York City, USA',
    summary: 'After an architecture student asked a question about wind loads, legendary structural engineer William LeMessurier re-calculated his calculations and realized that substituting welded joints with bolted joints made the skyscraper susceptible to collapse during 16-year hurricane quartering winds. He confessed publicly and secretly welded 2-inch steel plates onto 200 joints at night during hurricane season.',
    investigatorRole: 'Chief Structural Engineer (William LeMessurier)',
    primaryObjective: 'Confront catastrophic design error, notify building owners and city building department, and organize night-welding logistics.'
  },
  {
    id: 'apple-lisa-pricing-dilemma',
    universeId: 'creators-mind',
    title: 'The $9,995 Graphical Gamble',
    subtitle: 'Over-engineered hardware specifications vs market accessibility during the GUI transition',
    domain: "Creator's Mind",
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public business & design history case study.',
    difficulty: 'Intermediate',
    duration: '14 min',
    featured: false,
    playable: false,
    year: '1983',
    location: 'Cupertino, California, USA',
    summary: 'Apple spent $50M creating the Lisa with revolutionary GUI and mouse capabilities, but bundled it with custom Twiggy disk drives and a $9,995 price tag ($31,000 in today’s money), ensuring commercial failure until the streamlined Macintosh launched at $2,495.',
    investigatorRole: 'Personal Computer Product Strategy Director',
    primaryObjective: 'Strip unessential enterprise hardware modules to target a consumer-viable price ceiling.'
  },
  {
    id: 'the-monolithic-refactor-deadlock',
    universeId: 'creators-mind',
    title: 'The Monolithic Refactor Deadlock',
    subtitle: 'Second-system effect and the 18-month multi-tenant rewrite trap',
    domain: "Creator's Mind",
    status: 'SIMULATED DEMO',
    statusNote: 'Software engineering architecture post-mortem benchmark #CM-09.',
    difficulty: 'Advanced',
    duration: '14 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'Cloud SaaS Infrastructure Platform',
    summary: 'A team attempts a complete rewrite of a core payments monolith into 40 microservices. After 18 months, feature velocity drops to zero, distributed transactions produce data inconsistency, and competitor platforms capture 35% market share.',
    investigatorRole: 'Chief Technology Officer',
    primaryObjective: 'Halt the rewrite and transition to the Strangler Fig pattern for incremental domain-driven migration.'
  },
  {
    id: 'sony-betamax-vs-vhs-standard',
    universeId: 'creators-mind',
    title: 'The 60-Minute Cassette Paradox',
    subtitle: 'Superior picture fidelity defeated by football game recording length and open licensing',
    domain: "Creator's Mind",
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public technological format war analysis.',
    difficulty: 'Intermediate',
    duration: '13 min',
    featured: false,
    playable: false,
    year: '1976-1980',
    location: 'Tokyo, Japan & Global Consumer Electronics',
    summary: 'Sony prioritized pocketable cassette dimensions and crisp video resolution with Betamax (1-hour recording limit), while JVC recognized that consumers primarily wanted to record 2-3 hour NFL football games without changing tapes, licensing VHS openly to competing manufacturers.',
    investigatorRole: 'Consumer Product Architecture Lead',
    primaryObjective: 'Balance tape physical size against consumer time-shifting duration needs.'
  },
  {
    id: 'ford-edsel-styling-misread',
    universeId: 'creators-mind',
    title: 'The Consumer Research Phantom',
    subtitle: 'Excessive committee design and market tier segmentation failure',
    domain: "Creator's Mind",
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public automotive design history case study.',
    difficulty: 'Intermediate',
    duration: '15 min',
    featured: false,
    playable: false,
    year: '1957',
    location: 'Dearborn, Michigan, USA',
    summary: 'Ford spent $250M developing the Edsel, guided by psychological polling and market research. However, design-by-committee produced an eccentric vertical horse-collar grille, unreliable push-button steering hub shifters, and poor quality control in an economic recession.',
    investigatorRole: 'Automotive Chief Design & Program Director',
    primaryObjective: 'Identify early prototype manufacturing quality defects and cancel confusing model tiers.'
  },

  // ==========================================
  // UNIVERSE 10: EVERYDAY UNKNOWN
  // ==========================================
  {
    id: 'the-unscented-gas-leak',
    universeId: 'everyday-unknown',
    title: 'The Odorless Basement Infiltration',
    subtitle: 'Soil absorption of mercaptan odorant in fractured underground cast-iron natural gas main',
    domain: 'Everyday Unknown',
    status: 'SIMULATED DEMO',
    statusNote: 'Forensic residential hazard simulation benchmark #EU-10.',
    difficulty: 'Intermediate',
    duration: '12 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'Residential Brownstone District, Unit 4B',
    summary: 'A homeowner reports an odd headache and a houseplant dying overnight, but smells zero rotten egg odor. A fractured natural gas main 20 feet away is leaking gas through clay soil, which scrubs the mercaptan odorant chemically, allowing odorless methane to pool in the cellar.',
    investigatorRole: 'Utility First Responder & HAZMAT Specialist',
    primaryObjective: 'Use combustible gas indicator (CGI) explosimeter instead of relying on olfactory senses.'
  },
  {
    id: 'hyatt-regency-walkway-collapse',
    universeId: 'everyday-unknown',
    title: 'The Shifted Hanger Rod Sketch',
    subtitle: 'Informal telephone sketch doubling the load on box beams in atrium skywalks',
    domain: 'Everyday Unknown',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented landmark engineering failure (NBS Investigation NBSIR 82-2465).',
    difficulty: 'Advanced',
    duration: '20 min',
    featured: false,
    playable: false,
    year: '1981',
    location: 'Kansas City, Missouri, USA',
    summary: 'Two suspended walkways in a crowded hotel lobby collapsed during a dance competition, killing 114 people. A fabricator had requested changing the design from one continuous threaded rod to two staggered rods to avoid damaging threads, inadvertently doubling the shear stress on the fourth-floor box beam.',
    investigatorRole: 'Structural Forensic Investigator (NBS)',
    primaryObjective: 'Review design change approval procedures and verify connection capacity against AISC code.'
  },
  {
    id: 'london-grenfell-tower-cladding',
    universeId: 'everyday-unknown',
    title: 'The Combustible Envelope',
    subtitle: 'Polyethylene core ACM cladding substitution and vertical exterior fire chimney',
    domain: 'Everyday Unknown',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public inquiry (Grenfell Tower Inquiry Phase 1 & 2 Reports).',
    difficulty: 'Master',
    duration: '24 min',
    featured: false,
    playable: false,
    year: '2017',
    location: 'North Kensington, London, United Kingdom',
    summary: 'A minor refrigerator fire in a fourth-floor kitchen escaped through the window and ignited external aluminum composite material (ACM) cladding with a polyethylene core, racing up the 24-story residential tower in under 20 minutes.',
    investigatorRole: 'Fire Safety Engineering & Building Regulations Auditor',
    primaryObjective: 'Evaluate exterior wall system cavity barriers and challenge "Stay Put" advice during rapid external fire propagation.'
  },
  {
    id: 'tacoma-narrows-flutter-collapse',
    universeId: 'everyday-unknown',
    title: 'The Torsional Flutter Wave',
    subtitle: 'Von Kármán vortices and aeroelastic torsional oscillation of Galloping Gertie',
    domain: 'Everyday Unknown',
    status: 'PUBLIC CASE STUDY',
    statusNote: 'Documented public civil engineering case study (Federal Works Agency Report).',
    difficulty: 'Intermediate',
    duration: '15 min',
    featured: false,
    playable: false,
    year: '1940',
    location: 'Tacoma Narrows, Washington, USA',
    summary: 'A 2,800-foot suspension bridge designed with solid plate girders instead of open trusses began oscillating in moderate 42 mph winds due to aeroelastic flutter, twisting violently until the concrete deck tore itself apart.',
    investigatorRole: 'Civil Bridge Aerodynamics Specialist',
    primaryObjective: 'Calculate wind energy input vs structural torsional dampening and evacuate the bridge deck.'
  },
  {
    id: 'the-carbon-monoxide-nest',
    universeId: 'everyday-unknown',
    title: 'The Blocked Chimney Flue',
    subtitle: 'Bird nest obstruction in high-efficiency boiler exhaust causing insidious nighttime CO poisoning',
    domain: 'Everyday Unknown',
    status: 'SIMULATED DEMO',
    statusNote: 'Forensic domestic engineering simulation #EU-10b.',
    difficulty: 'Beginner',
    duration: '10 min',
    featured: false,
    playable: true,
    year: '2024',
    location: 'Suburban Two-Story Residence',
    summary: 'During a winter freeze, family members experience flu-like nausea, confusion, and auditory hallucinations. The furnace was serviced two months prior, but autumn twigs and dead leaves fell down an un-capped flue.',
    investigatorRole: 'Emergency Medical Technician & Building Inspector',
    primaryObjective: 'Test ambient CO levels with electro-chemical sensor and order immediate evacuation before blood carboxyhemoglobin reaches 40%.'
  }
];

// Helper to look up a case by ID
export function getCaseById(id) {
  return CASES.find(c => c.id === id);
}

// Helper to get cases by universe ID
export function getCasesByUniverse(universeId) {
  return CASES.filter(c => c.universeId === universeId);
}

// Verification status badge style helper
export function getStatusBadge(status) {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'VERIFIED',
        classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      };
    case 'PUBLIC CASE STUDY':
      return {
        label: 'PUBLIC CASE STUDY',
        classes: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
      };
    case 'SIMULATED DEMO':
      return {
        label: 'SIMULATED DEMO',
        classes: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      };
    case 'UNVERIFIED SUBMISSION':
      return {
        label: 'UNVERIFIED SUBMISSION',
        classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      };
    case 'COMING SOON':
    default:
      return {
        label: 'COMING SOON',
        classes: 'bg-slate-700/30 text-slate-400 border-slate-600/30'
      };
  }
}

