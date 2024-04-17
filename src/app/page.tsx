import { Database } from "@/types/supabase"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import "./globals.css"

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // const { data: member } = await supabase
  //   .from("circlemembers")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .single()

  // if (!member) return null

  // return <CirclesList member={member} />
}
