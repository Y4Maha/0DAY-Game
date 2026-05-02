# 0DAY — Frequently Asked Questions

Top 10 expected questions from Reddit/HN/ProductHunt comments, with prepared answers.

## Q1: Is the source code open?

Not currently. The demo is closed-source while we validate the concept; if it works, we're considering open-sourcing the engine and keeping content/art proprietary.

## Q2: What data do you collect?

Anonymous events only: match start, match end, recap shown, learn-more opened, learn-more completed. No account, no email unless you opt-in to launch notifications. We use PostHog with EU hosting.

## Q3: Will it have ads?

The demo has none and never will. The full game (post-validation) might offer optional rewarded ads ("watch to get a free card pack") but never forced ads.

## Q4: Will there be PvP?

Yes — that's the next major milestone after demo validation. The match engine is designed for it; the demo runs the player vs an AI proxy of a future opponent.

## Q5: Is this educational or just gamified hacking?

The flavor text and recap screen draw from real Verizon DBIR / Microsoft / Mandiant data. No lesson is invented for game balance. Mechanics simplify reality (a real Brute Force is more nuanced than "+6 breach if no MFA"), but the *direction* of every interaction matches reality.

## Q6: Why "0DAY"?

It's the holy grail of attacks (an unknown vulnerability) and works as a pun on "day zero" of a fresh hacker. Trademarkable; one syllable; works internationally.

## Q7: How was the AI opponent built?

Heuristic, not ML. ~150 lines that score each candidate play (face value of effects + threat level of target + synergy with already-played cards). Three difficulties differ in how much randomness is added on top.

## Q8: Will it be on the App Store?

The demo is web-only by design — no install friction matters more than store presence at this stage. If it validates, the full game targets iOS, Android, and web simultaneously via PWA + Capacitor.

## Q9: Why this art style?

AI-generated for the demo to keep budget under €100 of art cost. If it validates, we'll commission an illustrator for the full game.

## Q10: What's your monetization plan if this scales?

Free-to-play, cosmetic + acceleration purchases. Never pay-to-win. Monthly battle pass, alternate card art, optional rewarded ads. Industry-standard model proven by Marvel Snap, Hearthstone, etc.
