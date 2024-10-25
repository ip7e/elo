alter table "public"."circle_members" drop constraint "public_circle_members_new_circle_id_fkey";

alter table "public"."games" drop constraint "games_circle_id_fkey";

alter table "public"."circle_members" add constraint "public_circle_members_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE not valid;

alter table "public"."circle_members" validate constraint "public_circle_members_circle_id_fkey";

alter table "public"."games" add constraint "public_games_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "public_games_circle_id_fkey";


