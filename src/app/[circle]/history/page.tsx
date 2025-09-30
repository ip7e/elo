import { createServerClient } from "@/utils/supabase/server"
import HistoryServer from "./history-server"

export default async function ResultsPage({ params }: { params: Promise<{ circle: string }> }) {
  const { circle: circleSlug } = await params
  const supabase = createServerClient()
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", circleSlug)
    .single()

  if (!circle) return null

  return <HistoryServer circleId={circle.id} />
}
