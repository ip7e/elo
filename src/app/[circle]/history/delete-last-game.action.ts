"use server"

import { supabase } from "@/supabase"
import { revalidatePath } from "next/cache"

type Props = { circleId: number }
export async function deleteLastGame({ circleId }: Props) {
  const { data, error } = await supabase
    .from("games")
    .delete()
    .eq("circle_id", circleId)
    .order("id", { ascending: false })
    .limit(1)
    .single()

  if (!error) {
    revalidatePath("/[circle]", "layout")
    return { success: true }
  }

  return { error }
}
