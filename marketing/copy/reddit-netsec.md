# 0DAY: a card game where the deck is real attacks and defenses

Built a small browser card battler called 0DAY. The pool is 20 cards: 10 red-team (Phishing Lure, Brute Force Bot, SQL Injection, Stolen Credentials, Social Engineer, Ransomware, Zero-Day Exploit, APT Group, OSINT Scout, Port Scanner) and 10 blue-team (Patch Tuesday, Firewall, MFA, EDR, Rate Limiter, Honeypot, IDS/SIEM, Backup Vault, IR, Zero Trust).

Mechanics mirror real attack chains: Phishing → Stolen Creds → Brute Force is a real combo, MFA shuts down Brute Force unless Social Engineer bypasses it, Backup Vault negates Ransomware. Card values are tuned for game balance but the *direction* of every interaction matches reality.

3-min match, single-player vs heuristic AI, no signup, web only, no source available yet.

[link]

Curious especially: did I model anything backwards (a defense that shouldn't actually work that way)?
