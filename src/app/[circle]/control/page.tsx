import { supabase } from "@/supabase"
import ControlServer from "./control-server"

export default async function ControlPage({ params }: { params: { circle: string } }) {
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  if (!circle) return null

  return <ControlServer circle={circle} />
}
