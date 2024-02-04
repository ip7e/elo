"use client"

import { format } from "date-fns"
import { useState } from "react"
import { GameWithResults, Member } from "../types"
import HistoryMember from "./history-member"
import { deleteLastGame } from "./delete-last-game.action"

type Props = {
  games: GameWithResults[]
  members: Member[]
}

export default function HistoryClient({ games, members }: Props) {
  const membersMap = new Map(members.map((m) => [m.id, m]))
  const [optimisticGames, setOptimisticGames] = useState(games)

  const handleDeleteLastGame = async () => {
    const confirm = window.confirm("Are you sure you want to delete the last game?")
    if (!confirm) return
    const res = await deleteLastGame()
    if (res.success) setOptimisticGames(optimisticGames.slice(1))
    else alert("Something went wrong")
  }

  return (
    <div className="mt-10">
      {optimisticGames.map((game, i) => (
        <div className="flex gap-5 w-full py-1 text-gray-500 group" key={game.id}>
          <p key={game.id}>
            <time dateTime={game.created_at} className="text-gray-500 dark:text-gray-600">
              {format(game.created_at, "MMM dd")} -{" "}
            </time>

            {game.game_results.map((result) => (
              <HistoryMember
                key={result.member_id}
                name={membersMap.get(result.member_id)?.display_name || ""}
                winner={!!result.winner}
              ></HistoryMember>
            ))}
          </p>
          {i == 0 && (
            <button className="group-hover:visible invisible" onClick={handleDeleteLastGame}>
              delete
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
