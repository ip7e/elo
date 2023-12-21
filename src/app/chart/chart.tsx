import { supabase } from "@/supabase"
import { Tables } from "@/types/supabase"
import * as d3 from "d3"

type Props = {
  members: Tables<"members_elo">[]
}

export default async function Chart({ members }: Props) {
  const { data: games, error } = await supabase
    .from("games")
    .select("*, game_results(*)")
    .order("created_at", { ascending: false })
    .limit(20)

  if (!games?.length) return null

  let curEloByMember = members.reduce(
    (acc, m) => ({
      ...acc,
      [m.id!]: m.elo!,
    }),
    {} as Record<number, number>,
  )

  let rankingByMemberGames = {} as Record<number | string, [number | string, number][]>

  games.forEach((game) => {
    game.game_results.forEach((r) => {
      if (!curEloByMember[r.member_id!]) return

      curEloByMember[r.member_id!] = r.elo!
    })

    const curRanking = Object.entries(curEloByMember).sort((a, b) => b[1] - a[1])

    curRanking.forEach(([memberId, elo], i) => {
      rankingByMemberGames[memberId] = rankingByMemberGames[memberId] || []
      rankingByMemberGames[memberId].push([game.id, i])
    })
  })

  const width = 512
  const height = 128
  const padding = 8

  // Create scales
  const x = d3
    .scaleBand()
    .paddingInner(1)
    .domain(games.map((g) => "g-" + g.id.toString()))
    .range([width - padding, padding])

  const y = d3
    .scaleLinear()
    .domain([0, members.length])
    .range([padding, height - padding])

  // Create line generator
  const line = d3
    .line<[number | string, number]>()
    .defined(([game_id, rank]) => rank !== undefined)
    .x(([game_id, rank]) => x("g-" + game_id)!)
    .y(([game_id, rank]) => y(rank))
    .curve(d3.curveCatmullRom.alpha(0.5))

  console.log(games.map((g) => "g-" + g.id.toString()))
  console.log(rankingByMemberGames[1])

  const selected = 1

  console.log(members.map((m) => [m.id, m.display_name]))

  return (
    <div className="w-full my-8">
      <svg vectorEffect="non-scaling-stroke" width={width} height={height}>
        {Object.entries(rankingByMemberGames).map(([memberId, data]) => (
          <path
            key={memberId}
            d={line(data)!}
            stroke={memberId == selected.toString() ? `#E6A320` : `#aeaeae45`}
            strokeWidth={2}
            fill="none"
            stroke-linecap="round"
          ></path>
        ))}
      </svg>
    </div>
  )
}
