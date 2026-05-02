// Beginner-friendly one-liners for each card.
// Goal: explain the cyber term to someone seeing it for the first time.
// Keep under ~14 words. Plain language, no jargon, no statistics.

export const CARD_SIMPLE: Record<string, string> = {
  // Attackers
  OSINT_SCOUT: "Spying using only public info — Google, social media, leaked stuff.",
  PORT_SCANNER: "Knocks on every door of a server to find which ones are open.",
  PHISHING_LURE: "A fake email that tricks you into giving away your password.",
  BRUTE_FORCE_BOT: "Tries millions of password guesses until one works.",
  SQL_INJECTION: "Tricks a website's database by typing sneaky text into a form.",
  STOLEN_CREDENTIALS: "Logs in using someone else's leaked username and password.",
  SOCIAL_ENGINEER: "Tricks a person — not a computer — into helping you break in.",
  RANSOMWARE: "Locks all your files until you pay to unlock them.",
  ZERO_DAY: "A bug nobody knows about yet — no fix exists.",
  APT_GROUP: "A patient, expert hacker team that hides for months.",

  // Defenders
  PATCH_TUESDAY: "Updating software so old, known bugs can't be used.",
  FIREWALL: "A wall that blocks unwanted internet traffic from getting in.",
  MFA: "A second password — like a code on your phone. Way safer.",
  ANTIVIRUS: "Scans your computer for known bad files and removes them.",
  RATE_LIMITER: "Slows down anyone trying too many things too fast.",
  HONEYPOT: "A fake system left out as bait to catch attackers.",
  IDS: "An alarm that watches the network and yells when something's weird.",
  BACKUP_VAULT: "Spare copies of your files, locked away for emergencies.",
  INCIDENT_RESPONSE: "The team that shows up to clean up after an attack.",
  ZERO_TRUST: "Never trust anyone — always verify, every single time.",
};

export function simpleDefFor(cardId: string): string | undefined {
  return CARD_SIMPLE[cardId];
}
