"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "./admin-auth"
import createSuperClient from "./supabase"

export const unlockCircle = adminProcedure
  .createServerAction()
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input }) => {
    const supabase = createSuperClient()

    const { error } = await supabase
      .from("circles")
      .update({ is_unlocked: true, unlocked_at: new Date().toISOString() })
      .eq("id", input.circleId)

    if (error) throw "Failed to unlock circle"

    revalidatePath("/admin")
  })

export const lockCircle = adminProcedure
  .createServerAction()
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input }) => {
    const supabase = createSuperClient()

    const { error } = await supabase
      .from("circles")
      .update({ is_unlocked: false, unlocked_at: null })
      .eq("id", input.circleId)

    if (error) throw "Failed to lock circle"

    revalidatePath("/admin")
  })
