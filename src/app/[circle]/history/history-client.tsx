"use client"

import { format } from "date-fns"
import { motion } from "framer-motion"
import { useState } from "react"
import { GameWithResults, Member } from "../../../server/types"
import { useServerAction } from "zsa-react"
import { deleteLastGame } from "@/server/actions"
import HasAccess from "../_components/has-access"

type Props = {
  games: GameWithResults[]
  members: Member[]
  circleId: number
}

export default function HistoryClient({ games: defaultGames, members, circleId }: Props) {
  const membersMap = new Map(members.map((m) => [m.id, m]))
  const [games, setGames] = useState(defaultGames)

  const { isPending, execute } = useServerAction(deleteLastGame)

  const handleDeleteLastGame = async () => {
    const confirm = window.confirm("Are you sure you want to delete the last game?")
    if (!confirm) return
    const [data, error] = await execute({ circleId: circleId })
    if (data?.success) setGames(games.slice(1))
    else alert("Something went wrong")
  }

  return (
    <div className="mx-auto my-48 flex max-w-md flex-col gap-16">
      {games.map((game, i) => (
        <motion.div
          className={`group flex w-full flex-col items-center gap-1 py-1 text-gray-500`}
          key={game.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{
            rotate: -3 + Math.random() * 8,
            opacity: 1,
            y: 0,
            transition: { delay: Math.min(0.3, i * 0.03) },
          }}
        >
          <time
            dateTime={game.created_at}
            className="text-sm font-light text-gray-500 dark:text-gray-500"
          >
            {format(game.created_at, " d MMMM")}
          </time>

          <div className="flex gap-2">
            {game.game_results.map((result) => (
              <span
                key={result.member_id}
                className={`font-mono ${
                  result.winner
                    ? "font-bold text-accent"
                    : "font-extralight text-gray-800 dark:text-gray-300"
                } `}
              >
                {membersMap.get(result.member_id)?.name || ""}
              </span>
            ))}
          </div>
          <HasAccess>
            {i == 0 && (
              <button className="font-light" onClick={handleDeleteLastGame}>
                delete
              </button>
            )}
          </HasAccess>
        </motion.div>
      ))}
    </div>
  )
}
