import { supabase } from "@/supabase"
import CircleServer from "./circle-server"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  if (!circle) return null

  const { data: allMembers } = await supabase
    .from("circle_members")
    .select("*")
    .eq("circle_id", circle.id)

  if (!allMembers) return null

  return <CircleServer circleId={circle.id} />
}
