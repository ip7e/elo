"use server"

import { createServerClientWithCookies } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type AddMemberProps = { name: string; circleId: number }

// TODO: secure with access control
export async function addMember({ name, circleId }: AddMemberProps) {
  const supabase = createServerClientWithCookies()

  const { data, error } = await supabase
    .from("circle_members")
    .insert({ circle_id: circleId, name: name })
    .select("*")
    .single()

  if (!error) {
    revalidatePath("/[circle]", "layout")
    return { data, success: true }
  }

  return { error }
}

type KickMemberProps = { id: number }

// TODO: secure with access control
// TODO: dont allow kicking yourself
export async function kickMember({ id }: KickMemberProps) {
  const supabase = createServerClientWithCookies()
  const { data, error } = await supabase.from("circle_members").delete().eq("id", id).single()

  if (!error) {
    revalidatePath("/[circle]", "layout")
    return { data, success: true }
  }

  return { error }
}
