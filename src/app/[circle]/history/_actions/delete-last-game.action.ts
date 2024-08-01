"use server"

import { createServerClientWithCookies } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type Props = { circleId: number }
export async function deleteLastGame({ circleId }: Props) {
  const supabase = createServerClientWithCookies()
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
