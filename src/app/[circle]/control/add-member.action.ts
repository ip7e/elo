"use server"

import { supabase } from "@/supabase"
import { revalidatePath } from "next/cache"

type Props = { name: string; circleId: number }

export async function addMember({ name, circleId }: Props) {
  // TODO:

  return { error: "yoo" }
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
