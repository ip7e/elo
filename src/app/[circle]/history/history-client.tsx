"use client"

import { format } from "date-fns"
import { useState } from "react"
import { GameWithResults, Member } from "../types"
import HistoryMember from "./history-member"
import { deleteLastGame } from "./delete-last-game.action"
import { motion } from "framer-motion"

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
    <div className="my-48 max-w-md mx-auto flex-col flex gap-16">
      {optimisticGames.map((game, i) => (
        <motion.div
          className={`flex flex-col gap-1 w-full py-1 text-gray-500 group
          items-center
          `}
          key={game.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{
            rotate: -3 + Math.random() * 8,
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03 },
          }}
        >
          <time
            dateTime={game.created_at}
            className="text-sm text-gray-500 dark:text-gray-500 font-light"
          >
            {format(game.created_at, " d MMMM")}
          </time>

          <div className="flex gap-2">
            {game.game_results.map((result) => (
              <span
                key={result.member_id}
                className={`
                    ${
                      result.winner
                        ? "text-accent font-bold"
                        : "text-gray-800 dark:text-gray-300 font-extralight"
                    }
                  `}
              >
                {membersMap.get(result.member_id)?.name || ""}
              </span>
            ))}
          </div>
          {i == 0 && (
            <button className="font-light" onClick={handleDeleteLastGame}>
              delete
            </button>
          )}
        </motion.div>
      ))}
    </div>
  )
}
