import "server-only"

import { z } from "zod"
import { createServerAction } from "zsa"
import createSuperClient from "./supabase"

export const upsertUserProfile = createServerAction()
  .input(z.object({ email: z.string(), userId: z.string() }))
  .handler(async ({ input }) => {
    const supabase = createSuperClient()

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        user_id: input.userId,
        email: input.email,
      })
      .select()
      .single()

    if (error) throw new Error("Failed to add user to profiles")

    return { data, error }
  })

export const resolveInvitation = createServerAction()
  .input(z.object({ email: z.string() }))
  .handler(async ({ input }) => {
    const supabase = createSuperClient()

    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", input.email)
      .single()

    if (!user || error) throw new Error("No user found")

    const { data: invitation } = await supabase
      .from("member_invitations")
      .select("*")
      .eq("email", input.email)
      .single()

    if (!invitation) return { resolved: false }

    await supabase
      .from("circle_members")
      .update({
        user_id: user.user_id,
      })
      .eq("id", invitation.member_id!)
      .select()

    await supabase.from("member_invitations").delete().eq("member_id", invitation.member_id!)

    return { resolved: true }
  })
