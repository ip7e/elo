# Payment Flow: Circle-Level One-Time Unlock

## Core Concept

Payment lives on the **circle**, not the user. Every new circle gets **10 free games**. After that, anyone can make a one-time payment to unlock that circle forever. No account required to pay.

---

## Flow 1: New Circle (Trial)

1. User creates a circle and invites friends.
2. All features are available from the start — leaderboard, bump chart, stats, history, everything.
3. A subtle counter is visible: **"7 of 10 free games remaining"**.
4. After the 10th game is logged, the circle becomes **locked**:
   - Everything remains visible and accessible (leaderboard, bump chart, stats, history).
   - Logging new games is blocked.
5. A prompt appears: **"This circle has reached its free game limit. Unlock it forever for $X."**

---

## Flow 2: Unlocking a Circle (Logged-in User)

1. User tries to log a new game and sees the lock prompt.
2. They click **"Unlock this circle"**.
3. They're taken to a payment screen (Stripe Checkout).
4. They pay once.
5. The circle is permanently unlocked — unlimited games.

---

## Flow 3: Unlocking a Circle (Not Logged In)

1. A visitor opens a shared circle link (e.g., `shmelo.io/friday-chess`).
2. They see the locked state — everything visible, but game logging is blocked.
3. They click **"Unlock this circle"**.
4. They're taken to the same payment screen — **no login or signup required**.
5. They pay once.
6. The circle is permanently unlocked for everyone.

---

## Flow 4: Existing Users (Grandfathering at Launch)

1. On launch day, every circle is checked:
   - **10+ games logged** → automatically marked as Pro. Nothing changes for these users. They never see a paywall.
   - **Fewer than 10 games** → the remaining free games are calculated (10 minus games already logged). The trial counter picks up from there.

---

## What "Locked" Looks Like

- **Logging a game**: The "Add Game" button is replaced with an unlock prompt.
- **Everything else** (leaderboard, bump chart, stats, history): Fully accessible, no restrictions.

---

## Payment Provider

Payments are handled via [Polar](https://polar.sh). One-time checkout per circle, no subscription.

---

## What "Unlocked" Means

- Permanent. One-time. No expiry.
- All features available forever for that circle.
- The person who paid doesn't need to be the circle owner or even a member.
