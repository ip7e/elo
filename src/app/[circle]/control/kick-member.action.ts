"use server"

import { supabase } from "@/supabase"
import { revalidatePath } from "next/cache"

type Props = { id: number }

export async function kickMember({ id }: Props) {
  const { data, error } = await supabase.from("circle_members").delete().eq("id", id).single()

  if (!error) {
    revalidatePath("/[circle]", "layout")
    return { success: true }
  }

  return { error }
}
