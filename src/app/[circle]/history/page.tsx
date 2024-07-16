import { createServerClient } from "@/utils/supabase/server"
import HistoryServer from "./history-server"

export default async function ResultsPage({ params }: { params: { circle: string } }) {
  const supabase = createServerClient()
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  if (!circle) return null

  return <HistoryServer circleId={circle.id} />
}
