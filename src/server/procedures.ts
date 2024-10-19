import { createServerClientWithCookies } from "@/utils/supabase/server"
import { createServerActionProcedure } from "zsa"
import createSuperClient from "./supabase"
import { z } from "zod"

export const authedProcedure = createServerActionProcedure().handler(async () => {
  const supabase = createServerClientWithCookies()
  const { data } = await supabase.auth.getUser()

  if (!data.user) throw new Error("User not authenticated")

  return { user: data.user }
})

export const circleAdminProcedure = createServerActionProcedure(authedProcedure)
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { data: memberWithCircle } = await supabase
      .from("circle_members")
      .select("*, circle:circles(*)")
      .eq("circle_id", input.circleId)
      .eq("user_id", ctx.user.id)
      .single()

    if (!memberWithCircle) throw "Has no access to this circle"

    const { circle, ...member } = memberWithCircle
    return { member, circle, user: ctx.user }
  })
