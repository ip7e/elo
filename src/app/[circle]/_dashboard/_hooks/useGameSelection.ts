import { useState, useMemo } from "react"
import { format } from "date-fns"
import { GameWithResults } from "@/server/types"

/**
 * Hook to manage game selection state and related derived data.
 * Handles selecting/deselecting games and computing the display title.
 */
export function useGameSelection(recentGames: GameWithResults[]) {
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null)

  const handleGameSelect = (index: number | null) => {
    if (selectedGameIndex === index) {
      setSelectedGameIndex(null)
    } else {
      setSelectedGameIndex(index)
    }
  }

  const resetSelectedGame = () => setSelectedGameIndex(null)

  const leaderboardTitle = useMemo(() => {
    if (selectedGameIndex === null) return undefined
    return format(new Date(recentGames[selectedGameIndex].created_at), "MMMM d")
  }, [selectedGameIndex, recentGames])

  const hasSpotlightGame = selectedGameIndex !== null

  return {
    selectedGameIndex,
    handleGameSelect,
    resetSelectedGame,
    leaderboardTitle,
    hasSpotlightGame,
  }
}
