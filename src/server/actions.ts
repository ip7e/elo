"use server"

import { createServerClientWithCookies } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import z from "zod"
import { createServerActionProcedure } from "zsa"

const authedProcedure = createServerActionProcedure().handler(async () => {
  const supabase = createServerClientWithCookies()
  const { data } = await supabase.auth.getUser()

  if (!data.user) throw new Error("User not authenticated")

  return { user: data.user }
})

const circleAdminProcedure = createServerActionProcedure(authedProcedure)
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input, ctx }) => {
    console.log({ input, ctx })

    const supabase = createServerClientWithCookies()

    const { data: circle } = await supabase
      .from("circle_members")
      .select("*")
      .eq("circle_id", input.circleId)
      .eq("user_id", ctx.user.id)
      .single()

    if (!circle) throw new Error("Has no access to this circle")

    console.log({ circle })
    return { circle }
  })

export const addMember = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(20),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createServerClientWithCookies()

    const { name } = input

    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const { data, error } = await supabase
      .from("circle_members")
      .insert({ circle_id: ctx.circle?.circle_id, name: name })
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
export const kickMember = circleAdminProcedure
  .createServerAction()
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
