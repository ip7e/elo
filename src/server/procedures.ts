import { createServerClientWithCookies } from "@/utils/supabase/server"
import { createServerActionProcedure } from "zsa"

export const authedProcedure = createServerActionProcedure().handler(async () => {
  const supabase = createServerClientWithCookies()
  const { data } = await supabase.auth.getUser()

  if (!data.user) throw new Error("User not authenticated")

  return { user: data.user }
})
