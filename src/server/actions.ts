"use server"

import { createServerClientWithCookies } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type AddMemberProps = { name: string; circleId: number }

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
