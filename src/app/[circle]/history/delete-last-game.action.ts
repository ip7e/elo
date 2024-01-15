"use server"

import { supabase } from "@/supabase"
import { revalidatePath } from "next/cache"

export async function deleteLastGame() {
  const { data, error } = await supabase
    .from("games")
    .delete()
    .order("id", { ascending: false })
    .limit(1)
    .single()

  if (!error) {
    revalidatePath("/[circle]", "layout")
    return { success: true }
  }

  return { error }
}
