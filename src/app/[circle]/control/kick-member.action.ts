"use server"

import { supabase } from "@/supabase"
import { revalidatePath } from "next/cache"

type Props = { id: number }

export async function kickMember({ id }: Props) {
  // TODO:

  const error = "to be implemented"
  // const { data, error } = await supabase.from("circle_members_new").delete().eq("member_id", id).single()

  // if (!error) {
  // revalidatePath("/[circle]", "layout")
  // return { success: true }
  // }

  return { error }
}
