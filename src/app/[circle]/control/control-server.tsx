import { supabase } from "@/supabase"
import { Circle } from "../types"
import ControlClient from "./control-client"

type Props = {
  circle: Circle
}

export default async function ControlServer({ circle }: Props) {
  const { data: membersRaw } = await supabase
    .from("members")
    .select("*, circles!inner(*), game_results(count)")
    .eq("circles.id", circle.id)

  if (!membersRaw) return null

  const members = membersRaw.map((member) => ({
    id: member.id,
    name: member.name!,
    total_games: (member.game_results[0] as any).count, // supabase types are wrong
  }))

  return <ControlClient circle={circle} members={members}></ControlClient>
}
