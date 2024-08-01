"use server"

import { createServerClientWithCookies } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { createServerAction } from "zsa"
import z from "zod"

export const addMember = createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(20),
      circle_id: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const supabase = createServerClientWithCookies()

    const { circle_id, name } = input

    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const { data, error } = await supabase
      .from("circle_members")
      .insert({ circle_id, name: name })
      .select("*")
      .single()

    if (!error) {
      revalidatePath("/[circle]", "layout")
      return { data, success: true }
    }

    return { error }
  })

type KickMemberProps = { id: number }

// TODO: secure with access control
// TODO: dont allow kicking yourself
export const kickMember = createServerAction()
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const supabase = createServerClientWithCookies()

    const { data, error } = await supabase
      .from("circle_members")
      .delete()
      .eq("id", input.id)
      .single()

    if (!error) {
      revalidatePath("/[circle]", "layout")
      return { data, success: true }
    }

    return { error }
  })
