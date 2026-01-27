# Payment Implementation Plan

Reference: [`payment-flow.md`](./payment-flow.md)

---

## Step 1: Database — Add `is_unlocked` to circles

> Add the foundation flag that everything else reads from.

- [x] Create migration: add `is_unlocked`, `unlocked_at`, `polar_order_id` to `circles`
- [x] Grandfathering: `UPDATE circles SET is_unlocked = true` for circles with 10+ games
- [x] Regenerate Supabase types (`npm run types:generate`)

**Files:**
- `supabase/migrations/20260127202257_add_circle_payment.sql` — created
- `src/types/supabase.ts` — regenerated

**How to verify:** Query circles table, confirm column exists. Active circles (10+ games) should have `is_unlocked = true`.

---

## Step 2: Query — Circle plan helper

> Provide plan status to server actions and UI.

- [x] Add `FREE_GAME_LIMIT = 10` constant to `src/server/constants.ts`
- [x] Add `CirclePlan` type (`status: 'trial' | 'locked' | 'pro'`, `gamesPlayed`, `gamesLeft`)
- [x] Add `getCirclePlan(circleId)` to `src/server/queries.ts`

**Files:**
- `src/server/constants.ts` — edit
- `src/server/queries.ts` — edit

**How to verify:** Call the function for a known circle, check returned values make sense.

---

## Step 3: UI — `CirclePlanProvider` + `useCirclePlan` hook + `<Plan>` compound component

> Make plan status available on the client with a clean component API.

- [ ] Create `CirclePlanProvider` context + `useCirclePlan()` hook
- [ ] Create `<Plan>` compound component: `<Plan.Trial>`, `<Plan.Locked>`, `<Plan.Pro>`, `<Plan.Active>`
- [ ] Fetch `getCirclePlan` in `page.tsx`, wrap dashboard in `CirclePlanProvider`

**Files:**
- `src/app/[circle]/_context/circle-plan-context.tsx` — create
- `src/app/[circle]/_components/plan.tsx` — create
- `src/app/[circle]/page.tsx` — edit
- `src/app/[circle]/layout.tsx` — edit

**How to verify:** Use `<Plan.Trial>` and `<Plan.Active>` in dashboard, confirm correct rendering per state.

---

## Step 4: UI — Trial counter + lock state

> Show remaining games counter. When locked, replace "New Game" with unlock prompt.

- [ ] `<Plan.Trial>`: show `"X of 10 free games remaining"` near game controls
- [ ] `<Plan.Locked>`: hide "New Game", show unlock prompt
- [ ] `<Plan.Active>`: show "New Game" button (visible for trial + pro)
- [ ] Unlock button visible to **everyone** (not wrapped in `HasAccess`)

**Files:**
- `src/app/[circle]/_dashboard/_components/game-controls.tsx` — edit

**How to verify:**
- Circle with <10 games → see counter + "New Game"
- Circle with 10+ games, not unlocked → see unlock prompt
- Unlocked circle → normal "New Game", no counter

---

## Step 5: Server gate — Block game creation when locked

> Enforce the paywall server-side. This is the hard gate.

- [ ] Call `getCirclePlan` at the top of `createGameSession` handler
- [ ] If `status === 'locked'`, throw error

**Files:**
- `src/server/actions.ts` — edit (`createGameSession`)

**How to verify:** Try creating a game in a circle with 10+ games that isn't unlocked — should fail.

**Files:**
- `src/app/[circle]/_dashboard/_components/game-controls.tsx` — edit

**How to verify:**
- Circle with <10 games → see counter + "New Game"
- Circle with 10+ games, not unlocked → see unlock prompt
- Unlocked circle → normal "New Game", no counter

---

## Step 6: Polar — Checkout route

> API route that redirects to Polar's hosted checkout page.

- [ ] Create checkout route using `Checkout` from `@polar-sh/nextjs`
- [ ] Pass `circleId` via metadata so webhook can identify the circle
- [ ] Configure success URL to redirect back to circle page

**Files:**
- `src/app/api/checkout/route.ts` — create

**Env vars:**
- `POLAR_ACCESS_TOKEN` (already exists)
- `POLAR_PRODUCT_ID` — set in Polar dashboard

**How to verify:** Navigate to `/api/checkout?products=PRODUCT_ID` — should redirect to Polar checkout.

---

## Step 7: Polar — Webhook route

> Handle payment confirmation and unlock the circle.

- [ ] Create webhook route using `Webhooks` from `@polar-sh/nextjs`
- [ ] On `onOrderPaid`: extract `circleId` from metadata, set `is_unlocked = true`
- [ ] Validate signature with `POLAR_WEBHOOK_SECRET`

**Files:**
- `src/app/api/webhooks/polar/route.ts` — create

**Env vars:**
- `POLAR_WEBHOOK_SECRET` — set in Polar dashboard

**How to verify:** Complete a sandbox checkout — circle should become `is_unlocked = true` in DB.

---

## Step 8: Success handling

> After payment, user returns to the unlocked circle.

- [ ] Webhook sets `is_unlocked` in DB, page re-fetches naturally on load
- [ ] Optionally show a brief success toast/banner via `?unlocked=true` search param

**Files:**
- `src/app/[circle]/page.tsx` — minor edit

**How to verify:** Full end-to-end: locked circle → checkout → pay → redirect → circle is unlocked.

---

## End-to-End Verification Checklist

- [ ] New circle → play 3 games → see "7 of 10 free games remaining"
- [ ] Play to 10 games → "New Game" replaced with unlock prompt
- [ ] Server: `createGameSession` on locked circle → error
- [ ] Click unlock → Polar checkout page
- [ ] Complete payment → webhook fires → `is_unlocked = true`
- [ ] Return to circle → "New Game" button is back, no counter
- [ ] Existing circle with 10+ games → already unlocked (grandfathered)
