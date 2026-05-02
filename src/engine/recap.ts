import type { MatchState } from "./types";

export interface RecapLesson {
  id: string;
  cardId: string;
  headline: string;
  body: string;
  learnMoreId: string;
}

export function selectRecapLesson(state: MatchState, viewer: "P1" | "P2"): RecapLesson {
  const allPlays = state.targets.flatMap(t =>
    t.cardsPlayed.map(p => ({ ...p, targetId: t.id, target: t }))
  );
  const myPlays = allPlays.filter(p => p.player === viewer);

  // Priority 1: Phishing → Stolen Creds → Brute Force chain on same target by viewer
  for (const target of state.targets) {
    const here = target.cardsPlayed
      .filter(p => p.player === viewer)
      .map(p => p.card.id);
    if (here.includes("PHISHING_LURE") && here.includes("STOLEN_CREDENTIALS") && here.includes("BRUTE_FORCE_BOT")) {
      return {
        id: "PHISHING_PIPELINE",
        cardId: "PHISHING_LURE",
        headline: "Phishing Chain",
        body: `You chained Phishing → Stolen Creds → Brute Force on ${target.name}. In the real world, this exact pattern starts 36% of all data breaches.`,
        learnMoreId: "PHISHING_LURE",
      };
    }
  }

  // Priority 2: Brute Force on a no-MFA target (viewer attacked)
  const bfb = myPlays.find(p => p.card.id === "BRUTE_FORCE_BOT");
  if (bfb) {
    const hasMFA = bfb.target.cardsPlayed.some(p => p.card.id === "MFA");
    if (!hasMFA) {
      return {
        id: "NO_MFA",
        cardId: "BRUTE_FORCE_BOT",
        headline: "Brute Force vs No MFA",
        body: `You ran Brute Force on a target with no MFA. Microsoft data shows MFA blocks 99.2% of automated account attacks.`,
        learnMoreId: "MFA",
      };
    }
  }

  // Priority 3: Ransomware unblocked
  const ransom = myPlays.find(p => p.card.id === "RANSOMWARE");
  if (ransom) {
    const blocked = ransom.target.cardsPlayed.some(p => p.card.id === "BACKUP_VAULT");
    if (!blocked) {
      return {
        id: "RANSOMWARE_NO_BACKUP",
        cardId: "RANSOMWARE",
        headline: "Ransomware Hit",
        body: `Your Ransomware locked the target — no Backup Vault was in place. Average ransom paid in 2025: $4.7M. The 3-2-1 rule is the only insurance.`,
        learnMoreId: "RANSOMWARE",
      };
    }
  }

  // Priority 4: Backup Vault blocked Ransomware (defender viewer)
  const backup = myPlays.find(p => p.card.id === "BACKUP_VAULT");
  if (backup) {
    const ransomHere = backup.target.cardsPlayed.some(p =>
      p.card.id === "RANSOMWARE" && p.player !== viewer
    );
    if (ransomHere) {
      return {
        id: "BACKUP_BLOCKED_RANSOM",
        cardId: "BACKUP_VAULT",
        headline: "Backups Saved You",
        body: `Your Backup Vault neutralized incoming Ransomware. Immutable offsite backups are the single most reliable defense.`,
        learnMoreId: "BACKUP_VAULT",
      };
    }
  }

  // Priority 5: Zero Trust + multiple defenders
  const zt = myPlays.find(p => p.card.id === "ZERO_TRUST");
  if (zt && myPlays.filter(p => p.card.faction === "DEFENDER").length >= 3) {
    return {
      id: "ZERO_TRUST_STACK",
      cardId: "ZERO_TRUST",
      headline: "Zero Trust In Action",
      body: `You stacked layered defenses with Zero Trust at the core. Never trust a session by default; verify every request.`,
      learnMoreId: "ZERO_TRUST",
    };
  }

  // Priority 6: Honeypot used
  const honeypot = myPlays.find(p => p.card.id === "HONEYPOT");
  if (honeypot) {
    return {
      id: "HONEYPOT_INTEL",
      cardId: "HONEYPOT",
      headline: "Honeypot Intel",
      body: `Your Honeypot baited the attacker into revealing their plan. Honeypots turn attackers into intelligence sources.`,
      learnMoreId: "HONEYPOT",
    };
  }

  // Priority 7: Social Engineer bypassed MFA
  const social = myPlays.find(p => p.card.id === "SOCIAL_ENGINEER");
  if (social) {
    const mfaWasThere = social.target.cardsPlayed.some(p => p.card.id === "MFA");
    if (mfaWasThere) {
      return {
        id: "SOCIAL_BYPASS_MFA",
        cardId: "SOCIAL_ENGINEER",
        headline: "Bypassing MFA",
        body: `You social-engineered past MFA. Verizon DBIR 2024: humans are involved in 68% of breaches.`,
        learnMoreId: "SOCIAL_ENGINEER",
      };
    }
  }

  // Priority 8: Zero-Day
  const zeroDay = myPlays.find(p => p.card.id === "ZERO_DAY");
  if (zeroDay) {
    return {
      id: "ZERO_DAY_HIT",
      cardId: "ZERO_DAY",
      headline: "Zero-Day Detonation",
      body: `You used an unknown vulnerability — by definition, no patch exists. Real zero-days sell for $100k–$2M+ on grey markets.`,
      learnMoreId: "ZERO_DAY",
    };
  }

  // Fallback: spotlight highest-energy card the viewer played
  const sorted = [...myPlays].sort((a, b) => b.card.energy - a.card.energy);
  const featured = sorted[0]?.card;
  if (featured) {
    return {
      id: `FALLBACK_${featured.id}`,
      cardId: featured.id,
      headline: featured.name,
      body: featured.flavor,
      learnMoreId: featured.id,
    };
  }

  return {
    id: "NO_PLAYS",
    cardId: "PHISHING_LURE",
    headline: "Match recap",
    body: "Every match teaches something. Try a different deck strategy next time.",
    learnMoreId: "PHISHING_LURE",
  };
}
