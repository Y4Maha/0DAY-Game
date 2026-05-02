import { Card } from "./types";

export const CARDS: Card[] = [
  // ATTACKERS (10)
  { id: "OSINT_SCOUT", name: "OSINT Scout", faction: "ATTACKER", energy: 1,
    effects: [{ type: "REVEAL_OPPONENT" }],
    flavor: "The first step of every real attack: knowing your target.",
    art: "/cards/osint_scout.png" },
  { id: "PORT_SCANNER", name: "Port Scanner", faction: "ATTACKER", energy: 1,
    effects: [
      { type: "BREACH", value: 1 },
      { type: "DRAW", condition: "TARGET_HAS_NO_DEFENDER" },
    ],
    flavor: "Open ports are an invitation. Lock what you don't use.",
    art: "/cards/port_scanner.png" },
  { id: "PHISHING_LURE", name: "Phishing Lure", faction: "ATTACKER", energy: 2,
    effects: [{ type: "BREACH", value: 3 }],
    category: "PHISHING",
    flavor: "Starts 36% of all breaches. Always check the sender domain.",
    art: "/cards/phishing_lure.png" },
  { id: "BRUTE_FORCE_BOT", name: "Brute Force Bot", faction: "ATTACKER", energy: 2,
    effects: [
      { type: "BREACH_CONDITIONAL", value: 6, condition: "NO_MFA_ON_TARGET" },
      { type: "BREACH_CONDITIONAL", value: 1, condition: "MFA_ON_TARGET" },
    ],
    flavor: "MFA blocks 99.2% of automated account attacks.",
    art: "/cards/brute_force_bot.png" },
  { id: "SQL_INJECTION", name: "SQL Injection", faction: "ATTACKER", energy: 3,
    effects: [
      { type: "BREACH", value: 5 },
      { type: "DISABLE_DEFENDER", value: 2 },
    ],
    flavor: "Top-3 web vulnerability since 2003. Sanitize your inputs.",
    art: "/cards/sql_injection.png" },
  { id: "STOLEN_CREDENTIALS", name: "Stolen Credentials", faction: "ATTACKER", energy: 3,
    effects: [
      { type: "BREACH", value: 4 },
      { type: "BREACH_CONDITIONAL", value: 2, condition: "PER_PHISHING_OR_OSINT" },
    ],
    flavor: "80% of hacking-related breaches involve stolen creds.",
    art: "/cards/stolen_credentials.png" },
  { id: "SOCIAL_ENGINEER", name: "Social Engineer", faction: "ATTACKER", energy: 4,
    effects: [
      { type: "BREACH", value: 6 },
      { type: "BYPASS_MFA" },
    ],
    flavor: "The weakest link is always human, not technical.",
    art: "/cards/social_engineer.png" },
  { id: "RANSOMWARE", name: "Ransomware", faction: "ATTACKER", energy: 4,
    effects: [
      { type: "BREACH", value: 7 },
      { type: "LOCK_TARGET" },
    ],
    category: "PAYLOAD",
    flavor: "Average ransom paid in 2025: $4.7M. Backups save lives.",
    art: "/cards/ransomware.png" },
  { id: "ZERO_DAY", name: "Zero-Day Exploit", faction: "ATTACKER", energy: 5,
    effects: [
      { type: "BREACH", value: 8 },
      { type: "IGNORE_LOW_DEF", value: 4 },
    ],
    flavor: "Unknown to vendors. Worth millions on black markets.",
    art: "/cards/zero_day.png" },
  { id: "APT_GROUP", name: "APT Group", faction: "ATTACKER", energy: 6,
    effects: [
      { type: "BREACH", value: 10 },
      { type: "REVEAL_HAND" },
    ],
    flavor: "State-sponsored. Patient. Often invisible for months.",
    art: "/cards/apt_group.png" },

  // DEFENDERS (10)
  { id: "PATCH_TUESDAY", name: "Patch Tuesday", faction: "DEFENDER", energy: 1,
    effects: [{ type: "SECURE", value: 2 }],
    flavor: "Most exploits hit known, unpatched bugs. Update everything.",
    art: "/cards/patch_tuesday.png" },
  { id: "FIREWALL", name: "Firewall", faction: "DEFENDER", energy: 2,
    effects: [
      { type: "SECURE", value: 3 },
      { type: "NEGATE_CARD", value: 1 },
    ],
    flavor: "Your perimeter. First line of defense, never the only one.",
    art: "/cards/firewall.png" },
  { id: "MFA", name: "Multi-Factor Auth", faction: "DEFENDER", energy: 2,
    effects: [{ type: "SECURE", value: 2 }],
    category: "MFA",
    flavor: "Blocks 99.2% of automated attacks. Turn it on everywhere.",
    art: "/cards/mfa.png" },
  { id: "ANTIVIRUS", name: "Antivirus / EDR", faction: "DEFENDER", energy: 2,
    effects: [
      { type: "SECURE", value: 2 },
      { type: "NEGATE_CARD", cardCategory: "PAYLOAD" },
    ],
    flavor: "Pattern-matching catches yesterday's attacks. Defense in depth.",
    art: "/cards/antivirus.png" },
  { id: "RATE_LIMITER", name: "Rate Limiter", faction: "DEFENDER", energy: 3,
    effects: [
      { type: "SECURE", value: 3 },
      { type: "HALVE_LOW_ENERGY_BREACH" },
    ],
    flavor: "Make automated attacks expensive. Throttle, then alert.",
    art: "/cards/rate_limiter.png" },
  { id: "HONEYPOT", name: "Honeypot", faction: "DEFENDER", energy: 3,
    effects: [
      { type: "SECURE", value: 2 },
      { type: "REVEAL_HAND", target: "OPPONENT" },
    ],
    flavor: "Bait. Trap. Intelligence.",
    art: "/cards/honeypot.png" },
  { id: "IDS", name: "IDS / SIEM", faction: "DEFENDER", energy: 3,
    effects: [
      { type: "SECURE", value: 3 },
      { type: "REVEAL_OPPONENT" },
    ],
    flavor: "You can't defend what you can't see.",
    art: "/cards/ids.png" },
  { id: "BACKUP_VAULT", name: "Backup Vault", faction: "DEFENDER", energy: 4,
    effects: [
      { type: "SECURE", value: 4 },
      { type: "NEGATE_CARD", cardCategory: "RANSOMWARE" },
    ],
    flavor: "The 3-2-1 rule: 3 copies, 2 media, 1 offsite, immutable.",
    art: "/cards/backup_vault.png" },
  { id: "INCIDENT_RESPONSE", name: "Incident Response", faction: "DEFENDER", energy: 5,
    effects: [
      { type: "SECURE", value: 6 },
      { type: "RESET_TARGET", condition: "BREACHED_THIS_TURN" },
    ],
    flavor: "The cleanup crew. Practice your playbook before you need it.",
    art: "/cards/incident_response.png" },
  { id: "ZERO_TRUST", name: "Zero Trust Architecture", faction: "DEFENDER", energy: 6,
    effects: [
      { type: "SECURE", value: 8 },
      { type: "REDUCE_ENERGY", value: 1 },
    ],
    flavor: "Never trust, always verify. The new perimeter is identity.",
    art: "/cards/zero_trust.png" },
];

export const CARDS_BY_FACTION = {
  ATTACKER: CARDS.filter(c => c.faction === "ATTACKER"),
  DEFENDER: CARDS.filter(c => c.faction === "DEFENDER"),
};

export const cardById = (id: string): Card => {
  const c = CARDS.find(x => x.id === id);
  if (!c) throw new Error(`Card not found: ${id}`);
  return c;
};
