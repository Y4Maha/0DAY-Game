export interface LearnMoreContent {
  cardId: string;
  title: string;
  whatItIs: string;       // one paragraph, ~50–80 words
  spotItIRL: string[];    // exactly 3 bullets
  howToDefend: string[];  // exactly 3 bullets
}

export const LEARN_MORE: Record<string, LearnMoreContent> = {
  OSINT_SCOUT: {
    cardId: "OSINT_SCOUT",
    title: "OSINT — Open-Source Intelligence",
    whatItIs: "Attackers gather public information about targets — employees on LinkedIn, exposed services on Shodan, subdomains, document metadata — before the first packet ever hits a victim system.",
    spotItIRL: [
      "Job postings that leak your tech stack",
      "Employee LinkedIn lists with role + tenure (recon gold)",
      "Public S3 buckets, exposed Git repos, debug pages on subdomains",
    ],
    howToDefend: [
      "Audit your own digital footprint quarterly",
      "Train staff: don't post project details on LinkedIn",
      "Run your own tools (Shodan, Have-I-Been-Pwned) before attackers do",
    ],
  },
  PORT_SCANNER: {
    cardId: "PORT_SCANNER",
    title: "Port Scanning",
    whatItIs: "Attackers probe IP ranges to find which network services are listening. Open ports running outdated software are the first foothold of most network breaches.",
    spotItIRL: [
      "Spikes of TCP SYN connections from unfamiliar IPs",
      "Sudden interest in obscure ports (5900 RDP, 22 SSH, 3389)",
      "Probing patterns sweeping sequentially (1, 2, 3, … 65535)",
    ],
    howToDefend: [
      "Default-deny firewall: only open ports you're actively serving",
      "Rate-limit and alert on scan-rate connections",
      "Place high-value services behind a VPN or zero-trust proxy",
    ],
  },
  PHISHING_LURE: {
    cardId: "PHISHING_LURE",
    title: "Phishing",
    whatItIs: "An email, SMS, or message that looks legitimate but tricks the recipient into clicking a link, opening a file, or handing over credentials. Verizon's 2024 DBIR pegs phishing at the start of 36% of breaches.",
    spotItIRL: [
      "Sender domain off by one letter (microsft.com vs microsoft.com)",
      "Urgent language: 'Your account will be suspended in 1 hour'",
      "Unexpected attachments, especially .zip, .htm, or password-protected files",
    ],
    howToDefend: [
      "Type URLs yourself — never click links in unexpected mail",
      "Turn on MFA — it blocks the follow-on attack even if you fall for the lure",
      "Report suspicious mail to IT, don't just delete it (others may be targeted)",
    ],
  },
  BRUTE_FORCE_BOT: {
    cardId: "BRUTE_FORCE_BOT",
    title: "Brute Force / Credential Stuffing",
    whatItIs: "Automated bots try millions of password combinations — either guessing common ones or replaying credentials leaked in past breaches. Without rate limits or MFA, success is just a matter of time.",
    spotItIRL: [
      "Login error spikes from many IPs to many accounts",
      "Account-lockout events clustering on 'admin', 'service' accounts",
      "Successful logins from new countries you've never been in",
    ],
    howToDefend: [
      "Multi-Factor Auth — blocks 99.2% of automated attacks (Microsoft data)",
      "Rate-limit login endpoints; block repeat failures from one IP",
      "Use a password manager to avoid password reuse across sites",
    ],
  },
  SQL_INJECTION: {
    cardId: "SQL_INJECTION",
    title: "SQL Injection",
    whatItIs: "User input gets concatenated directly into a database query, letting an attacker rewrite the query — dump tables, bypass auth, or exfiltrate everything. A top-3 web vulnerability since 2003.",
    spotItIRL: [
      "URL parameters or form fields containing quote marks, OR statements, semicolons",
      "Database error messages leaking column names",
      "Sudden bursts of SELECT queries fetching whole tables",
    ],
    howToDefend: [
      "Always use parameterized queries / prepared statements",
      "Run a Web Application Firewall (WAF) in detection mode at minimum",
      "Run static analysis tools in CI to catch unsafe patterns",
    ],
  },
  STOLEN_CREDENTIALS: {
    cardId: "STOLEN_CREDENTIALS",
    title: "Credential Theft",
    whatItIs: "80% of hacking-related breaches involve stolen creds. The chain is usually: phishing → credential capture → reuse on other services that share the password.",
    spotItIRL: [
      "Login from a new country, new device, at unusual hours",
      "Have-I-Been-Pwned alerts on staff email addresses",
      "Multiple service logins with the same compromised credentials",
    ],
    howToDefend: [
      "Mandatory MFA on every internal and SaaS service",
      "Single Sign-On to reduce credential surface area",
      "Subscribe staff to breach-monitoring services and rotate on alert",
    ],
  },
  SOCIAL_ENGINEER: {
    cardId: "SOCIAL_ENGINEER",
    title: "Social Engineering",
    whatItIs: "Manipulating a human to bypass technical controls — a phone call to IT pretending to be a locked-out CEO, an SMS to a finance officer pretending to be a vendor changing bank details. The 2024 MGM Resorts breach started this way.",
    spotItIRL: [
      "Urgent calls/messages bypassing normal channels",
      "Requests that pressure people to skip verification ('I'm in a meeting, just do it')",
      "Imposter accounts mimicking executives on LinkedIn or WhatsApp",
    ],
    howToDefend: [
      "Out-of-band verification for any sensitive request — call back on a known number",
      "Vishing-resistant MFA (FIDO2 hardware keys, not SMS codes)",
      "Train every employee, not just IT — humans are the perimeter now",
    ],
  },
  RANSOMWARE: {
    cardId: "RANSOMWARE",
    title: "Ransomware",
    whatItIs: "Malware that encrypts files and demands payment for the decryption key. Modern ransomware also exfiltrates data first and threatens to publish it — 'double extortion'. Average ransom paid in 2025: $4.7M.",
    spotItIRL: [
      "Mass file modifications and rename activity in short bursts",
      "Files renamed to .locked, .encrypted, or random extensions",
      "Sudden inability to open documents; ransom note files appearing",
    ],
    howToDefend: [
      "3-2-1 backups: 3 copies, 2 different media, 1 offsite, immutable",
      "Network segmentation: limit lateral movement",
      "Tested incident response playbook — practice the restore quarterly",
    ],
  },
  ZERO_DAY: {
    cardId: "ZERO_DAY",
    title: "Zero-Day Vulnerabilities",
    whatItIs: "A vulnerability unknown to the vendor — no patch exists. Real zero-days sell for $100k–$2M+ on grey markets and underpin the most sophisticated attacks (Pegasus, Stuxnet, Operation Triangulation).",
    spotItIRL: [
      "You probably won't — that's the point. Watch for anomalies, not signatures.",
      "Behavioral alerts: a service doing something it has never done",
      "CVE announcements; act fast on the first patch",
    ],
    howToDefend: [
      "Defense in depth — assume any single layer can be bypassed",
      "Behavioral EDR catches what signature AV misses",
      "Reduce attack surface: every service is a potential zero-day vector",
    ],
  },
  APT_GROUP: {
    cardId: "APT_GROUP",
    title: "Advanced Persistent Threats",
    whatItIs: "State-sponsored or highly-resourced actors who breach a target and stay hidden for months. They focus on quiet exfiltration and long-term persistence, not noise. Examples: APT29 (Russia), Lazarus (DPRK), APT41 (China).",
    spotItIRL: [
      "Beaconing traffic to suspicious domains at low frequency",
      "Privileged accounts logging in at unusual hours",
      "Logs being tampered with or cleared without authorization",
    ],
    howToDefend: [
      "SIEM with anomaly detection, not just rule-based alerts",
      "Threat intelligence feeds to recognize known APT TTPs",
      "Assume compromise: regular threat-hunts, not just incident response",
    ],
  },
  PATCH_TUESDAY: {
    cardId: "PATCH_TUESDAY",
    title: "Patching",
    whatItIs: "Most breaches don't use zero-days — they exploit known bugs months after a patch was available. WannaCry hit 2 months after Microsoft patched the vulnerability it exploited.",
    spotItIRL: [
      "Vulnerability scanners flagging out-of-date software",
      "Public CVE databases listing actively-exploited vulns",
      "Vendor advisories — read them within 24h of release",
    ],
    howToDefend: [
      "Automated patching for OS and major apps",
      "30-day SLA for critical patches; 7 days for actively-exploited",
      "Segment legacy systems that can't be patched",
    ],
  },
  FIREWALL: {
    cardId: "FIREWALL",
    title: "Firewalls",
    whatItIs: "A control point that decides which traffic crosses a network boundary. Modern firewalls also do deep packet inspection and identity-aware filtering.",
    spotItIRL: [
      "Connection drops in firewall logs for blocked attempts",
      "Allowlist exceptions piling up over time (review them)",
      "Egress traffic to suspicious destinations",
    ],
    howToDefend: [
      "Default-deny: explicitly allow only what you need",
      "Egress filtering, not just ingress — block C2 callbacks",
      "Layer with WAF, IDS, and segmentation; firewall alone isn't enough",
    ],
  },
  MFA: {
    cardId: "MFA",
    title: "Multi-Factor Authentication",
    whatItIs: "Beyond just a password: a second factor (TOTP, hardware key, biometric) the attacker must also defeat. Microsoft data: MFA blocks 99.2% of automated account attacks.",
    spotItIRL: [
      "MFA fatigue attacks: many push notifications hoping you'll approve",
      "SMS interception (SIM-swap) — why hardware keys are stronger",
      "Service accounts that can't take MFA become weak links",
    ],
    howToDefend: [
      "FIDO2 hardware keys are phishing-resistant — prefer over TOTP",
      "Number-matching for push prompts to defeat MFA fatigue",
      "Cover service accounts with conditional access policies",
    ],
  },
  ANTIVIRUS: {
    cardId: "ANTIVIRUS",
    title: "Antivirus / EDR",
    whatItIs: "Endpoint Detection and Response watches process behavior, network calls, and file changes — going beyond signature-based AV to catch novel malware by its actions.",
    spotItIRL: [
      "EDR alerts on suspicious process trees (Word spawning PowerShell)",
      "Lateral movement attempts (PsExec, WMI execution)",
      "Persistence techniques (registry run keys, scheduled tasks)",
    ],
    howToDefend: [
      "Pick an EDR with good telemetry (CrowdStrike, SentinelOne, Defender for Endpoint)",
      "Tune alerts — too many false positives means real ones get ignored",
      "Pair with managed detection (MDR) if you don't have 24/7 staff",
    ],
  },
  RATE_LIMITER: {
    cardId: "RATE_LIMITER",
    title: "Rate Limiting",
    whatItIs: "Capping the number of actions an entity can perform per time window. The cheap defense against brute force, scraping, abuse, and DoS — but underused.",
    spotItIRL: [
      "API endpoints with no rate limit get scraped or flooded",
      "Login endpoints without rate limits enable credential stuffing",
      "Account-creation endpoints without rate limits enable bot signups",
    ],
    howToDefend: [
      "Rate-limit by IP, user account, and global at minimum",
      "Use sliding-window algorithms; not just per-second buckets",
      "Combine with CAPTCHA or proof-of-work for risky actions",
    ],
  },
  HONEYPOT: {
    cardId: "HONEYPOT",
    title: "Honeypots",
    whatItIs: "Decoy systems that look valuable but exist solely to be attacked. Any interaction is suspicious by definition — turning attackers into a high-fidelity intelligence source.",
    spotItIRL: [
      "Any login or query against a honeypot is a real alert",
      "Tools like Canarytokens fire on file access, DNS lookup, link click",
      "Honeypots reveal attacker tooling and TTPs",
    ],
    howToDefend: [
      "Deploy canary tokens on file shares, in code repos, in databases",
      "Place honeypot accounts in AD with attractive names ('admin_old')",
      "Treat any honeypot interaction as a P1 incident",
    ],
  },
  IDS: {
    cardId: "IDS",
    title: "Intrusion Detection / SIEM",
    whatItIs: "Centralized log analysis to detect attacks across systems. A SIEM (Splunk, Sentinel, Wazuh) correlates events from many sources into actionable alerts.",
    spotItIRL: [
      "Alerts on impossible travel (login from two continents in 5 min)",
      "Privilege escalations outside normal hours",
      "Repeated authentication failures across services",
    ],
    howToDefend: [
      "Centralize logs from endpoints, network, cloud, identity",
      "Build detection rules for your specific environment, not just defaults",
      "Hunt proactively — don't wait for alerts",
    ],
  },
  BACKUP_VAULT: {
    cardId: "BACKUP_VAULT",
    title: "Backups (the 3-2-1 rule)",
    whatItIs: "The only reliable defense against destructive ransomware: multiple backup copies, on multiple media types, with at least one offsite and immutable (write-once).",
    spotItIRL: [
      "Tested-restore times shorter than business RTO targets",
      "Backup-deletion attempts (a key ransomware tactic)",
      "Backup credentials scoped narrowly, not used for daily ops",
    ],
    howToDefend: [
      "3-2-1: 3 copies, 2 media, 1 offsite",
      "Immutability: write-once storage that can't be deleted before retention",
      "Restore drills quarterly — untested backups are wishes",
    ],
  },
  INCIDENT_RESPONSE: {
    cardId: "INCIDENT_RESPONSE",
    title: "Incident Response",
    whatItIs: "The structured process of detecting, containing, eradicating, and recovering from a security incident. Practiced beforehand, executed under pressure during an incident.",
    spotItIRL: [
      "Tabletop exercises that uncover gaps in coordination",
      "Playbooks for top scenarios (ransomware, phishing, data leak)",
      "On-call schedules with named decision-makers",
    ],
    howToDefend: [
      "Write playbooks before you need them; test under stress",
      "Pre-engaged DFIR retainer (you don't want to negotiate during a crisis)",
      "Legal and PR alignment in advance — disclosure is regulated under NIS2/GDPR",
    ],
  },
  ZERO_TRUST: {
    cardId: "ZERO_TRUST",
    title: "Zero Trust Architecture",
    whatItIs: "The principle 'never trust, always verify': no implicit trust based on network location. Every request is authenticated, authorized, and continuously validated. The new perimeter is identity, not the network edge.",
    spotItIRL: [
      "VPN replaced by per-app identity-aware proxies",
      "MFA enforced on every sensitive action, not just login",
      "Microsegmentation: services can talk only to what they need",
    ],
    howToDefend: [
      "Start with identity: SSO + MFA + risk-based conditional access",
      "Move sensitive apps behind identity-aware proxies (Cloudflare Access, Tailscale)",
      "Treat ZTA as a journey — most orgs take years to implement fully",
    ],
  },
};

export function learnMoreFor(cardId: string): LearnMoreContent | undefined {
  return LEARN_MORE[cardId];
}
