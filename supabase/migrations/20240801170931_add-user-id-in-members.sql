alter table "public"."circle_members" add column "user_id" uuid;

alter table "public"."circle_members" add constraint "public_circle_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."circle_members" validate constraint "public_circle_members_user_id_fkey";

create or replace view "public"."members_stats" as  SELECT DISTINCT ON (circle_members.id) circle_members.name,
    circle_members.circle_id,
    circle_members.id AS member_id,
    latest_result.elo,
    latest_game.id AS latest_game,
    first_game.id AS first_game,
    total_games.count AS total_games,
    total_games.total_wins
   FROM (((((circle_members
     RIGHT JOIN game_results latest_result ON ((latest_result.member_id = circle_members.id)))
     RIGHT JOIN games latest_game ON ((latest_game.id = latest_result.game_id)))
     RIGHT JOIN game_results first_result ON ((first_result.member_id = circle_members.id)))
     RIGHT JOIN games first_game ON ((first_game.id = first_result.game_id)))
     RIGHT JOIN ( SELECT game_results.member_id,
            count(*) AS count,
            sum(
                CASE
                    WHEN (game_results.winner = true) THEN 1
                    ELSE 0
                END) AS total_wins
           FROM game_results
          GROUP BY game_results.member_id) total_games ON ((total_games.member_id = circle_members.id)))
  ORDER BY circle_members.id, circle_members.circle_id, latest_result.created_at DESC, first_result.created_at;



