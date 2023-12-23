"use client"

import { useState } from "react"
import Chart from "./chart"
import { GameWithGameResults, MemberStats } from "./types"

type Props = {
  stats: MemberStats[]
  recentGames: GameWithGameResults[]
  recentWinners: number[]
}
export default function StatsClient({ stats, recentWinners, recentGames }: Props) {
  const [highlight, setHighlight] = useState<number>(stats[0].member_id!)

  const winsByMemberId = recentWinners.reduce(
    (acc, winner) => ({
      ...acc,
      [winner]: acc[winner] ? acc[winner] + 1 : 1,
    }),
    {} as Record<number, number>,
  )

  return (
    <>
      <table className="table border-separate border-spacing-x-3 border-spacing-y-2">
        <thead>
          <tr className="text-sm lowercase align-text-top opacity-60">
            <th className="invisible"></th>
            <th className="invisible w-full">Player</th>
            <th className="text-center font-mono font-bold opacity-30 text-lg">elo</th>
            <th className="text-center font-mono font-bold opacity-30 text-lg">%</th>
          </tr>
        </thead>

        <tbody>
          {stats.map(({ elo, display_name, member_id, total_games, total_wins }, i) => (
            <tr key={member_id} onMouseEnter={() => setHighlight(member_id!)}>
              <td className="font-mono font-bold text-right text-xl opacity-20 w-max">{i + 1}</td>
              <td
                className={`w-full text-lg font-bold font-mono ${
                  highlight == member_id ? "text-[#E6A320]" : ""
                }`}
              >
                {display_name}

                {winsByMemberId[member_id!] && (
                  <span className="mx-1 tracking-widest">
                    {"🏆".repeat(winsByMemberId[member_id!])}
                  </span>
                )}
              </td>
              <td className="font-mono font-bold text-right text-lg ">{elo}</td>
              <td className="font-mono font-bold text-right text-lg opacity-20 w-max">
                {Math.round(((total_wins || 1) / (total_games || 1)) * 100)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Chart stats={stats} games={recentGames} highlight={highlight} />
    </>
  )
}
