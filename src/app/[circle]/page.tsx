import { createServerClient } from "@/utils/supabase/server"
import CircleServer from "./circle-server"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const supabase = createServerClient()
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  if (!circle) return null

  return <CircleServer circleId={circle.id} />
}
