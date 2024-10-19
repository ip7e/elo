-- Step 1: Add the new column 'previous_elo'
ALTER TABLE game_results
ADD COLUMN IF NOT EXISTS previous_elo smallint;
-- Step 2: Populate the 'previous_elo' column with a default value of 1100 for the first game
DO $$
BEGIN
    WITH ranked_games AS (
        SELECT
            id,
            member_id,
            elo,
            COALESCE(LAG(elo) OVER (PARTITION BY member_id ORDER BY created_at), 1100) AS previous_elo
        FROM game_results
    )
    UPDATE game_results gs
    SET previous_elo = rg.previous_elo
    FROM ranked_games rg
    WHERE gs.id = rg.id;
END $$;
-- Step 3: Set 'previous_elo' to NOT NULL
ALTER TABLE game_results
ALTER COLUMN previous_elo SET NOT NULL;
