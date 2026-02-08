ALTER TABLE "public"."circles"
  ADD COLUMN "is_unlocked" boolean NOT NULL DEFAULT false,
  ADD COLUMN "unlocked_at" timestamptz,
  ADD COLUMN "polar_order_id" text;

-- Grandfathering: unlock circles with 10+ games
UPDATE "public"."circles"
SET is_unlocked = true, unlocked_at = now()
WHERE id IN (
  SELECT circle_id FROM "public"."games"
  GROUP BY circle_id HAVING COUNT(*) >= 10
);
