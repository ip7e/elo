import { supabase } from "@/supabase";

export const getAllMembers = async () =>
  supabase.from("circle_members").select("*");

export const getMembersWithElo = async () =>
  supabase.from("members_with_elo").select(`*`);
