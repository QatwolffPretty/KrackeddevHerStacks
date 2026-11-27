import { supabase } from './supabase-client.js';

const TRACKS = {
  herops: {
    title: 'CYBERSECURITY / HEROPS',
    description: 'Build practical cybersecurity skills, from digital safety and OSINT to defensive investigation.',
    modules: [
      'Cybersecurity Fundamentals',
      'OSINT & Digital Footprints',
      'Social Engineering Awareness',
      'Networking Fundamentals',
      'Linux & Security Tools',
      'Web Security Fundamentals',
      'SQL Injection & XSS',
      'Blue Team & Incident Response'
    ]
  },
  vibecoding: {
  title: 'VIBE CODING & AI DEVELOPMENT',

  description:
    'Learn AI-assisted coding, build interactive websites, ' +
    'work with GitHub and deploy your own digital projects.',

  modules: [
    'Introduction to Vibe Coding',
    'Prompt Engineering for Builders',
    'HTML & Website Structure',
    'CSS & Responsive Design',
    'JavaScript & Interactivity',
    'AI-Assisted Development',
    'GitHub & Deployment',
    'Final Project — Ship Your Website'
   ]
  }
};

/* ==========================================
   HEROPS / CAREER ROADMAP CATALOGUE
   HCR-02
========================================== */

// These modules already exist in HerOps.
// All specialised modules remain PLANNED
// until their actual lessons or labs are built.

const CAREER_FOUNDATIONS = {
  basics: {
    title: 'Cybersecurity Fundamentals',
    skills: 'CIA triad, threats, risk, ethics and authorised testing.',
    status: 'available',
    href: './herops.html'
  },

  network: {
    title: 'Networking Fundamentals',
    skills: 'TCP/IP, DNS, ports, HTTP, HTTPS and network troubleshooting.',
    status: 'available',
    href: './herops.html'
  },

  linux: {
    title: 'Linux & Security Tools',
    skills: 'Terminal navigation, permissions, least privilege and logs.',
    status: 'available',
    href: './herops.html'
  },

  web: {
    title: 'Web Security Fundamentals',
    skills: 'HTTP, authentication, sessions, access control and safe input handling.',
    status: 'available',
    href: './herops.html'
  },

  webThreats: {
    title: 'SQL Injection & XSS',
    skills: 'Injection concepts, safe queries, output encoding and defensive review.',
    status: 'available',
    href: './herops.html'
  },

  blue: {
    title: 'Blue Team & Incident Response',
    skills: 'Alert triage, evidence preservation and incident reporting.',
    status: 'available',
    href: './herops.html'
  },

  osint: {
    title: 'OSINT & Digital Footprints',
    skills: 'Public-source research, verification and ethical information handling.',
    status: 'available',
    href: './herops.html'
  },

  social: {
    title: 'Social Engineering Awareness',
    skills: 'Phishing detection, impersonation and reporting.',
    status: 'available',
    href: './herops.html'
  },

  loginLab: {
    title: 'Login Defence Lab 01',
    skills: 'Build and test defensive login controls in a safe JavaScript lab.',
    status: 'available',
    href: './herops-practical-preview.html'
  }
};

const careerPlanned = (title, skills) => ({
  title,
  skills,
  status: 'planned'
});

const HEROPS_CAREERS = [
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker / Penetration Tester',
    category: 'OFFENSIVE SECURITY',
    level: 'BEGINNER TO ADVANCED',
    summary: 'Assess authorised systems, identify security weaknesses and recommend remediation.',
    progression: [
      'Junior Penetration Tester',
      'Penetration Tester',
      'Senior / Lead Penetration Tester'
    ],
    tools: ['Linux', 'Nmap', 'Wireshark', 'Burp Suite', 'sqlmap'],
    modules: [
      'basics',
      'network',
      'linux',
      'web',
      'webThreats',
      careerPlanned(
        'Nmap & Network Enumeration',
        'Discover hosts, ports and services in an authorised training network.'
      ),
      careerPlanned(
        'Burp Suite & Web Testing',
        'Inspect requests, sessions, authentication and access controls.'
      ),
      careerPlanned(
        'SQL Injection Testing with sqlmap',
        'Validate simulated SQL injection safely in an isolated lab.'
      ),
      careerPlanned(
        'Penetration Testing Report',
        'Document evidence, severity, business impact and remediation.'
      )
    ]
  },

  {
    id: 'soc-analyst',
    title: 'SOC Analyst',
    category: 'BLUE TEAM',
    level: 'BEGINNER TO ADVANCED',
    summary: 'Monitor security events, investigate alerts and escalate potential incidents.',
    progression: [
      'SOC Analyst L1',
      'SOC Analyst L2',
      'Senior SOC Analyst / L3'
    ],
    tools: ['Wazuh', 'Splunk', 'Sysmon', 'Wireshark', 'Sigma'],
    modules: [
      'basics',
      'network',
      'linux',
      'blue',
      'loginLab',
      careerPlanned(
        'Windows & Linux Security Logs',
        'Understand authentication events, system activity and useful event fields.'
      ),
      careerPlanned(
        'SIEM Fundamentals',
        'Search and correlate fictional events using a training SIEM.'
      ),
      careerPlanned(
        'Alert Triage & Escalation',
        'Validate suspicious activity and prepare an analyst handover.'
      )
    ]
  },

  {
    id: 'digital-forensics',
    title: 'Digital Forensics Analyst',
    category: 'FORENSICS',
    level: 'FOUNDATION TO SPECIALIST',
    summary: 'Preserve and examine digital evidence to reconstruct events.',
    progression: [
      'Junior Forensics Analyst',
      'Digital Forensics Analyst',
      'Senior DFIR Specialist'
    ],
    tools: ['Autopsy', 'FTK Imager', 'Volatility', 'SHA-256'],
    modules: [
      'basics',
      'linux',
      careerPlanned(
        'Evidence Handling & Chain of Custody',
        'Document collection, preservation, integrity and authorised access.'
      ),
      careerPlanned(
        'Disk & File System Forensics',
        'Review a synthetic disk image and recover relevant artifacts.'
      ),
      careerPlanned(
        'Memory Forensics',
        'Investigate a prepared memory image using Volatility.'
      ),
      careerPlanned(
        'Forensic Investigation Report',
        'Build an evidence timeline and separate findings from assumptions.'
      )
    ]
  },

  {
    id: 'incident-responder',
    title: 'Incident Responder',
    category: 'BLUE TEAM',
    level: 'FOUNDATION TO SPECIALIST',
    summary: 'Coordinate technical response, containment and recovery during incidents.',
    progression: [
      'Junior Incident Analyst',
      'Incident Responder',
      'Senior Incident Response Lead'
    ],
    tools: ['Wireshark', 'Sysmon', 'Velociraptor', 'MITRE ATT&CK'],
    modules: [
      'basics',
      'network',
      'blue',
      careerPlanned(
        'Incident Response Lifecycle',
        'Preparation, identification, containment, eradication and recovery.'
      ),
      careerPlanned(
        'Host & Network Investigation',
        'Analyse fictional system and network evidence.'
      ),
      careerPlanned(
        'Containment & Recovery Exercise',
        'Choose safe response actions in a simulated incident.'
      ),
      careerPlanned(
        'Incident Postmortem',
        'Write a timeline, impact summary and corrective action plan.'
      )
    ]
  },

  {
    id: 'threat-hunter',
    title: 'Threat Hunter',
    category: 'DETECTION & RESPONSE',
    level: 'INTERMEDIATE TO ADVANCED',
    summary: 'Proactively investigate suspicious behaviour using evidence-based hypotheses.',
    progression: [
      'SOC / Detection Analyst',
      'Threat Hunter',
      'Senior Threat Hunting Lead'
    ],
    tools: ['MITRE ATT&CK', 'Sigma', 'KQL', 'Sysmon', 'Splunk'],
    modules: [
      'network',
      'linux',
      'blue',
      careerPlanned(
        'Threat Hunting Methodology',
        'Define hypotheses, scope and expected evidence.'
      ),
      careerPlanned(
        'ATT&CK Technique Mapping',
        'Connect fictional activity to documented adversary techniques.'
      ),
      careerPlanned(
        'Hunting Queries & Detection Rules',
        'Write and test defensive searches against prepared logs.'
      ),
      careerPlanned(
        'Threat Hunt Report',
        'Document results, false positives and detection opportunities.'
      )
    ]
  },

  {
    id: 'threat-intelligence',
    title: 'Threat Intelligence Analyst',
    category: 'CYBER INTELLIGENCE',
    level: 'BEGINNER TO ADVANCED',
    summary: 'Turn verified threat information into useful security intelligence.',
    progression: [
      'Junior CTI Analyst',
      'Threat Intelligence Analyst',
      'Senior Intelligence Analyst'
    ],
    tools: ['MISP', 'VirusTotal', 'MITRE ATT&CK', 'Maltego'],
    modules: [
      'basics',
      'osint',
      careerPlanned(
        'Cyber Threat Intelligence Lifecycle',
        'Plan collection, evaluate sources, analyse and communicate findings.'
      ),
      careerPlanned(
        'Indicators & Adversary Behaviour',
        'Understand IOCs, tactics, techniques and procedures.'
      ),
      careerPlanned(
        'Intelligence Analysis',
        'Assess reliability, confidence, relevance and uncertainty.'
      ),
      careerPlanned(
        'Threat Intelligence Briefing',
        'Produce a concise intelligence report with defensive recommendations.'
      )
    ]
  },

  {
    id: 'malware-analyst',
    title: 'Malware Analyst',
    category: 'MALWARE RESEARCH',
    level: 'INTERMEDIATE TO ADVANCED',
    summary: 'Examine suspicious software in controlled environments to understand its behaviour.',
    progression: [
      'Junior Malware Analyst',
      'Malware Analyst',
      'Senior Malware Researcher'
    ],
    tools: ['Ghidra', 'YARA', 'PEStudio', 'Wireshark'],
    modules: [
      'basics',
      'linux',
      careerPlanned(
        'Files, Processes & Executables',
        'Understand executable formats, processes and system behaviour.'
      ),
      careerPlanned(
        'Safe Static Analysis',
        'Inspect harmless training samples, hashes and file properties.'
      ),
      careerPlanned(
        'YARA & Detection Concepts',
        'Create detection rules using benign training artifacts.'
      ),
      careerPlanned(
        'Malware Investigation Report',
        'Summarise indicators, behaviour and defensive recommendations.'
      )
    ]
  },

  {
    id: 'appsec-engineer',
    title: 'Application Security Engineer',
    category: 'APPLICATION SECURITY',
    level: 'BEGINNER TO ADVANCED',
    summary: 'Build security into applications through testing, review and engineering.',
    progression: [
      'Junior AppSec Analyst',
      'Application Security Engineer',
      'Senior / Lead AppSec Engineer'
    ],
    tools: ['Burp Suite', 'OWASP ZAP', 'Semgrep', 'Postman'],
    modules: [
      'basics',
      'web',
      'webThreats',
      'loginLab',
      careerPlanned(
        'API Security Testing',
        'Review endpoints, authentication and object-level authorisation.'
      ),
      careerPlanned(
        'Secure Code Review',
        'Identify unsafe data handling and design secure fixes.'
      ),
      careerPlanned(
        'Application Threat Modelling',
        'Map trust boundaries, attack surfaces and mitigations.'
      )
    ]
  },

  {
    id: 'cloud-security',
    title: 'Cloud Security Engineer',
    category: 'CLOUD SECURITY',
    level: 'FOUNDATION TO ADVANCED',
    summary: 'Protect cloud identities, services, configurations and workloads.',
    progression: [
      'Junior Cloud Security Analyst',
      'Cloud Security Engineer',
      'Senior Cloud Security Architect'
    ],
    tools: ['AWS IAM', 'CloudTrail', 'Azure', 'Prowler'],
    modules: [
      'basics',
      'network',
      'linux',
      careerPlanned(
        'Cloud Fundamentals & Shared Responsibility',
        'Understand cloud architecture, resources and security ownership.'
      ),
      careerPlanned(
        'Identity & Access Management',
        'Implement least privilege, MFA and service identity controls.'
      ),
      careerPlanned(
        'Cloud Logging & Configuration Review',
        'Inspect synthetic cloud events and common configuration mistakes.'
      ),
      careerPlanned(
        'Cloud Security Assessment',
        'Write a secure architecture and remediation plan.'
      )
    ]
  },

  {
    id: 'security-engineer',
    title: 'Security Engineer',
    category: 'SECURITY ENGINEERING',
    level: 'FOUNDATION TO ADVANCED',
    summary: 'Design, deploy and maintain protective security controls.',
    progression: [
      'Junior Security Engineer',
      'Security Engineer',
      'Senior Security Engineer'
    ],
    tools: ['Linux', 'Wireshark', 'Firewalls', 'Wazuh', 'OpenSCAP'],
    modules: [
      'basics',
      'network',
      'linux',
      'blue',
      careerPlanned(
        'System & Network Hardening',
        'Apply secure configurations and least-privilege controls.'
      ),
      careerPlanned(
        'Endpoint & Network Defence',
        'Configure and validate defensive monitoring in a lab.'
      ),
      careerPlanned(
        'Security Architecture Review',
        'Recommend controls for a fictional organisation.'
      )
    ]
  },

  {
    id: 'devsecops',
    title: 'DevSecOps Engineer',
    category: 'SECURE DEVELOPMENT',
    level: 'FOUNDATION TO ADVANCED',
    summary: 'Integrate security checks into software development and delivery.',
    progression: [
      'Junior DevSecOps Engineer',
      'DevSecOps Engineer',
      'Senior Platform Security Engineer'
    ],
    tools: ['GitHub Actions', 'Semgrep', 'Trivy', 'Gitleaks', 'Docker'],
    modules: [
      'basics',
      'linux',
      'web',
      careerPlanned(
        'Git & CI/CD Fundamentals',
        'Understand repositories, pipelines and deployment workflows.'
      ),
      careerPlanned(
        'SAST, Dependency & Secret Scanning',
        'Detect vulnerable dependencies, risky code patterns and exposed secrets.'
      ),
      careerPlanned(
        'Container Security',
        'Build, scan and harden a training container image.'
      ),
      careerPlanned(
        'Secure Delivery Pipeline',
        'Design a CI pipeline with appropriate security gates.'
      )
    ]
  },

  {
    id: 'grc-analyst',
    title: 'GRC / Cyber Risk Analyst',
    category: 'GOVERNANCE & RISK',
    level: 'BEGINNER TO ADVANCED',
    summary: 'Help organisations manage cybersecurity risk, policies and compliance.',
    progression: [
      'Junior GRC Analyst',
      'Cyber Risk / GRC Analyst',
      'Senior GRC / Risk Manager'
    ],
    tools: ['NIST CSF', 'ISO 27001', 'Risk Register', 'Control Matrix'],
    modules: [
      'basics',
      'social',
      careerPlanned(
        'Risk Assessment Fundamentals',
        'Identify assets, threats, likelihood, impact and treatment options.'
      ),
      careerPlanned(
        'Security Frameworks & Controls',
        'Understand NIST CSF, ISO 27001 and control selection.'
      ),
      careerPlanned(
        'Policies, Compliance & Evidence',
        'Review fictional policies and organise audit evidence.'
      ),
      careerPlanned(
        'Cyber Risk Assessment Report',
        'Prepare a risk register and prioritised treatment recommendations.'
      )
    ]
  }
];

const $ = id => document.getElementById(id);
const onboarding = $('lab-onboarding');
const dashboard = $('lab-dashboard');
const form = $('lab-interest-form');
const save = $('lab-save');
const status = $('lab-save-status');
let member = null;
let selected = [];

function chosen() {
  return [...form.querySelectorAll('input[name="interest"]:checked')].map(input => input.value);
}
function syncForm() {
  save.disabled = chosen().length === 0 || !member;
}
function showOnboarding() {
  onboarding.hidden = false;
  dashboard.hidden = true;
  form.querySelectorAll('input[name="interest"]').forEach(input => {
    input.checked = selected.includes(input.value);
  });
  syncForm();
}
function renderDashboard() {
  onboarding.hidden = true;
  dashboard.hidden = false;
  $('lab-track-count').textContent = String(selected.length);
  $('lab-module-count').textContent = String(selected.reduce((sum, key) => sum + TRACKS[key].modules.length, 0));
  const target = $('lab-paths');
  target.replaceChildren();
  for (const key of selected) {
    const track = TRACKS[key];
    const article = document.createElement('article');
    article.className = 'lab-path';
    const heading = document.createElement('header');
    const details = document.createElement('div');
    const kicker = document.createElement('div');
    kicker.className = 'lab-kicker';
    kicker.textContent = 'SELECTED LEARNING PATH';
    const title = document.createElement('h3');
    title.textContent = track.title;
    const desc = document.createElement('p');
    desc.textContent = track.description;
    details.append(kicker, title, desc);
    const tag = document.createElement('span');
    tag.className = 'lab-tag';
    tag.textContent = `${track.modules.length} MODULES`;
    heading.append(details, tag);
    const modules = document.createElement('div');
    modules.className = 'lab-module-list';
    track.modules.forEach((name, index) => {
      const row = document.createElement('div');
      row.className = 'lab-module';
      const number = document.createElement('span');
      number.className = 'lab-module-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'lab-module-title';
      label.textContent = name;
      const state = document.createElement('span');
      state.className = 'lab-module-status';
      state.textContent = 'AVAILABLE';
      row.append(number, label, state);
      modules.append(row);
    });
    article.append(heading, modules);
    const launch = document.createElement('a');

launch.href =
  key === 'herops'
    ? './herops.html'
    : './vibecoding.html';

launch.className = 'lab-button';

launch.style.cssText =
  'display:inline-block;' +
  'margin-top:20px;' +
  'text-decoration:none';

launch.textContent =
  key === 'herops'
    ? 'CONTINUE HEROPS COURSE →'
    : 'START VIBE CODING COURSE →';

article.append(launch);
    target.append(article);
  }
}

form.addEventListener('change', syncForm);
$('lab-edit').addEventListener('click', showOnboarding);
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!member || chosen().length === 0) return;
  save.disabled = true;
  status.textContent = 'Saving preferences…';
  const next = chosen();
  // Phase 1: persist in Supabase Auth user metadata. Never use this for authorization or XP.
  const { error } = await supabase.auth.updateUser({ data: { herstacks_learning_interests: next } });
  if (error) {
    status.textContent = `Unable to save: ${error.message}`;
    syncForm();
    return;
  }
  selected = next;
  status.textContent = '';
  renderDashboard();
});

async function initialize() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      $('lab-auth').innerHTML = 'MEMBER SIGN-IN REQUIRED // <a href="./account.html">Sign in to select your learning track →</a>';
      return;
    }
    member = data.user;
    selected = Array.isArray(member.user_metadata?.herstacks_learning_interests)
      ? [...new Set(member.user_metadata.herstacks_learning_interests.filter(key => Object.hasOwn(TRACKS, key)))]
      : [];
    $('lab-auth').textContent = `SIGNED IN // ${member.email || 'HERSTACKS MEMBER'}`;
    if (selected.length) renderDashboard();
    else showOnboarding();
  } catch (error) {
    $('lab-auth').textContent = `Could not load your member session: ${error.message}`;
  }
}
initialize();
