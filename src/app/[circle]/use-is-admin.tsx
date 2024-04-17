import { useRouter } from "next/navigation"
import useUser from "../use-user"
import useSupabase from "../use-supabase"

export default async function useIsAdmin(circleId?: number) {
  const user = await useUser()
  const supabase = await useSupabase()

  if (!circleId) return false
  if (!user) return false
  const { data, error } = await supabase
    .from("circle_admins")
    .select("*")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .single()

  return !!data
}
