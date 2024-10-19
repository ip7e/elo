drop policy "Enable read access for all users" on "public"."circles";

drop policy "Enable read access for all users" on "public"."game_results";

drop policy "Enable read access for all users" on "public"."games";

drop policy "Enable insert for authenticated users only" on "public"."old_members";

drop policy "Enable read access for all users" on "public"."old_members";

revoke delete on table "public"."circle_admins" from "anon";

revoke insert on table "public"."circle_admins" from "anon";

revoke references on table "public"."circle_admins" from "anon";

revoke select on table "public"."circle_admins" from "anon";

revoke trigger on table "public"."circle_admins" from "anon";

revoke truncate on table "public"."circle_admins" from "anon";

revoke update on table "public"."circle_admins" from "anon";

revoke delete on table "public"."circle_admins" from "authenticated";

revoke insert on table "public"."circle_admins" from "authenticated";

revoke references on table "public"."circle_admins" from "authenticated";

revoke select on table "public"."circle_admins" from "authenticated";

revoke trigger on table "public"."circle_admins" from "authenticated";

revoke truncate on table "public"."circle_admins" from "authenticated";

revoke update on table "public"."circle_admins" from "authenticated";

revoke delete on table "public"."circle_admins" from "service_role";

revoke insert on table "public"."circle_admins" from "service_role";

revoke references on table "public"."circle_admins" from "service_role";

revoke select on table "public"."circle_admins" from "service_role";

revoke trigger on table "public"."circle_admins" from "service_role";

revoke truncate on table "public"."circle_admins" from "service_role";

revoke update on table "public"."circle_admins" from "service_role";

revoke delete on table "public"."old_members" from "anon";

revoke insert on table "public"."old_members" from "anon";

revoke references on table "public"."old_members" from "anon";

revoke select on table "public"."old_members" from "anon";

revoke trigger on table "public"."old_members" from "anon";

revoke truncate on table "public"."old_members" from "anon";

revoke update on table "public"."old_members" from "anon";

revoke delete on table "public"."old_members" from "authenticated";

revoke insert on table "public"."old_members" from "authenticated";

revoke references on table "public"."old_members" from "authenticated";

revoke select on table "public"."old_members" from "authenticated";

revoke trigger on table "public"."old_members" from "authenticated";

revoke truncate on table "public"."old_members" from "authenticated";

revoke update on table "public"."old_members" from "authenticated";

revoke delete on table "public"."old_members" from "service_role";

revoke insert on table "public"."old_members" from "service_role";

revoke references on table "public"."old_members" from "service_role";

revoke select on table "public"."old_members" from "service_role";

revoke trigger on table "public"."old_members" from "service_role";

revoke truncate on table "public"."old_members" from "service_role";

revoke update on table "public"."old_members" from "service_role";

alter table "public"."circle_admins" drop constraint "public_circle_admins_circle_id_fkey";

alter table "public"."circle_admins" drop constraint "public_circle_admins_user_id_fkey";

alter table "public"."old_members" drop constraint "members_user_id_fkey";

alter table "public"."circle_admins" drop constraint "circle_admins_pkey";

alter table "public"."old_members" drop constraint "members_pkey1";

drop index if exists "public"."circle_admins_pkey";

drop index if exists "public"."members_pkey1";

drop table "public"."circle_admins";

drop table "public"."old_members";

alter table "public"."circle_members" enable row level security;

alter table "public"."circles" enable row level security;

alter table "public"."game_results" enable row level security;

alter table "public"."games" enable row level security;

alter table "public"."member_invitations" enable row level security;

alter table "public"."profiles" enable row level security;

create policy "Public can read all circle members"
on "public"."circle_members"
as permissive
for select
to public
using (true);


create policy "Public can read all circles"
on "public"."circles"
as permissive
for select
to public
using (true);


create policy "Public can read all game results"
on "public"."game_results"
as permissive
for select
to public
using (true);


create policy "Public can read all games"
on "public"."games"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."member_invitations"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);



