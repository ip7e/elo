ALTER TABLE "public"."game_results"
  DROP CONSTRAINT "public_game_results_member_id_fkey",
  ADD CONSTRAINT "public_game_results_member_id_fkey"
    FOREIGN KEY ("member_id") REFERENCES "public"."circle_members"("id") ON DELETE CASCADE;
